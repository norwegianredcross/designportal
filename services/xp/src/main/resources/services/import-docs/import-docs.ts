/**
 * Local content-migration endpoint — the write-side companion to Guillotine.
 *
 * Guillotine is read-only, and XP has no public write API, so migrating
 * articles from the old docs SPA needs a door into the content repo. This
 * service is that door: POST a page's fields as JSON and it upserts the
 * page content in the draft branch, ready for editorial review in Content
 * Studio (with an opt-in publish flag for pushing straight to master).
 *
 * Safety model, two layers:
 *  1. The endpoint only exists when the app config defines `importToken`
 *     (no.rodekors.docs.cfg). That key is set only in the local sandbox —
 *     production configs never define it, so there every request gets 404
 *     as if the service wasn't deployed.
 *  2. Even when enabled, the caller must present the same token in an
 *     Authorization: Bearer header. The seed scripts read it from the
 *     DOCS_IMPORT_TOKEN environment variable.
 *
 * The service is deliberately schema-agnostic: `data` is passed to
 * lib-content verbatim, so the seed scripts (scripts/seed-*.mjs) own the
 * block shapes and this file never needs to change when blocks are added.
 *
 * Two request shapes share the endpoint, told apart by Content-Type:
 *  - application/json      -> page upsert / removal (ImportPayload below)
 *  - multipart/form-data   -> media upload (importMedia below). Image bytes
 *    can't ride inside JSON without a base64 decoder this app doesn't
 *    bundle, while multipart parsing ships with XP's own lib-portal.
 */
import {
  create,
  createMedia,
  delete as deleteContent,
  get as getContent,
  modify,
  publish,
  unpublish,
} from "/lib/xp/content";
import { type ContextParams, run } from "/lib/xp/context";
import { getMultipartItem, getMultipartStream, getMultipartText } from "/lib/xp/portal";

interface ImportPayload {
  /** Content-repo path of the parent, e.g. "/docs" (the site). */
  parentPath?: string;
  /** URL slug for the article, e.g. "kom-i-gang". */
  name?: string;
  displayName?: string;
  /** Page fields verbatim: title, intro (HTML string), blocks (option-set array). */
  data?: Record<string, unknown>;
  /** Also push draft -> master so the public site renders it immediately. */
  publish?: boolean;
  /** Paths to unpublish and delete BEFORE any upsert — lets restructure
   * seeds clean up content that moved, instead of leaving ghosts at the
   * old paths. Nonexistent paths are skipped silently (idempotent). */
  remove?: string[];
}

// Every write runs as the system admin on the draft branch, see the comment
// above run() in post() for why the branch is forced.
const WRITE_CONTEXT: ContextParams = {
  branch: "draft",
  user: { login: "su", idProvider: "system" },
  principals: ["role:system.admin"],
};

interface ServiceResponse {
  status: number;
  contentType?: string;
  body?: string;
}

export function post(req: {
  body?: string;
  contentType?: string;
  headers: Record<string, string | undefined>;
}): ServiceResponse {
  // Layer 1+2 of the safety model (see file header): without a configured
  // token the endpoint pretends not to exist, and with one the caller must
  // present it. 404 in both failure cases so probing can't tell the
  // difference between "disabled" and "wrong token".
  const token = app.config.importToken;
  const authHeader = req.headers.Authorization ?? req.headers.authorization;
  if (!token || authHeader !== `Bearer ${token}`) {
    return { status: 404 };
  }

  // Multipart means "upload a file" - branch off before the JSON parsing,
  // which would choke on a multipart body.
  if ((req.contentType ?? "").indexOf("multipart/form-data") === 0) {
    return importMedia();
  }

  let payload: ImportPayload;
  try {
    payload = JSON.parse(req.body ?? "") as ImportPayload;
  } catch {
    return json(400, { error: "Body must be JSON" });
  }
  const hasUpsert = Boolean(payload.parentPath || payload.name || payload.data || payload.displayName);
  if (hasUpsert && !(payload.parentPath && payload.name && payload.data && payload.displayName)) {
    return json(400, { error: "parentPath, name, displayName and data are required together" });
  }
  if (!hasUpsert && !payload.remove?.length) {
    return json(400, { error: "Nothing to do" });
  }

  // The anonymous caller carries no write access by itself; the token check
  // above is what authorizes the call, and run() elevates inside the
  // request's repo context. The branch is forced to draft: XP auth-walls
  // /draft site URLs before any service runs, so the seed scripts must call
  // the public /master URL — but content still belongs in draft first, with
  // the publish flag pushing draft -> master afterwards.
  try {
    const result = run(WRITE_CONTEXT, () => {
      // Removals first, so a restructure can delete the old path and
      // recreate at the new one in a single logical run of seeds.
      const removed: string[] = [];
      for (const removePath of payload.remove ?? []) {
        const doomed = getContent({ key: removePath });
        if (!doomed) continue;
        // unpublish pulls it off master; delete drops the draft.
        unpublish({ keys: [doomed._id] });
        if (deleteContent({ key: removePath })) {
          removed.push(removePath);
        }
      }
      if (!hasUpsert) {
        return { action: "removed", removed };
      }
      // hasUpsert guarantees these exist (guard above); the casts keep
      // tsc aligned with that runtime guard.
      const parentPath = payload.parentPath as string;
      const name = payload.name as string;
      const displayName = payload.displayName as string;
      const data = payload.data as Record<string, unknown>;
      const path = `${parentPath}/${name}`;
      const existing = getContent({ key: path });

      // Upsert so the seed scripts are safe to re-run while iterating on the
      // migrated content: first run creates, later runs overwrite the fields.
      const content = existing
        ? modify({
            key: path,
            editor: (c) => {
              c.displayName = displayName;
              c.data = data as typeof c.data;
              return c;
            },
          })
        : create({
            parentPath,
            name,
            displayName,
            contentType: `${app.name}:page`,
            data,
          });
      if (!content) {
        // modify() is typed nullable; unreachable here since we only modify
        // content that get() just returned, but the guard keeps tsc honest.
        throw new Error(`Upsert failed for ${path}`);
      }

      if (payload.publish) {
        // includeDependencies pulls unpublished ancestors along (e.g. the
        // site itself on the very first seed) so a fresh sandbox works too.
        publish({ keys: [content._id], includeDependencies: true });
      }

      return {
        action: existing ? "modified" : "created",
        _id: content._id,
        _path: content._path,
        published: payload.publish === true,
        removed,
      };
    });
    return json(200, result);
  } catch (e) {
    // lib-content throws on e.g. a missing parent path; surface it in the
    // same JSON shape as the validation errors instead of XP's HTML 500.
    return json(500, { error: String(e) });
  }
}

/**
 * Media upload: one file per request, as multipart/form-data.
 *
 * Text fields: parentPath (e.g. "/docs/design"), name (file name incl.
 * extension - it becomes the content name, so seeds can resolve the media
 * by path later, e.g. "/docs/design/OppstartStep1.png"), optional altText
 * and caption (stored on the image content, Content Studio shows them),
 * publish ("true" pushes draft -> master). File field: "file".
 *
 * Idempotent by path: a media item that already exists is returned as-is
 * (action "exists") rather than replaced. Overwriting the bytes in place is
 * possible (lib-content's modifyMedia keeps the id), but a seed re-run that
 * silently replaces an image an editor has since swapped in Content Studio
 * is not what we want. Delete it there first when replacing is the intent.
 *
 * altText is only stored for raster images: XP's built-in media:vector
 * type (what createMedia picks for SVG) has no altText field, and an
 * undeclared property would be invisible in Content Studio and Guillotine.
 */
function importMedia(): ServiceResponse {
  const parentPath = getMultipartText("parentPath");
  const name = getMultipartText("name");
  const altText = getMultipartText("altText");
  const caption = getMultipartText("caption");
  const publishFlag = getMultipartText("publish") === "true";
  const file = getMultipartItem("file");
  if (!parentPath || !name || !file) {
    return json(400, { error: "parentPath, name and a 'file' part are required" });
  }

  try {
    const result = run(WRITE_CONTEXT, () => {
      const path = `${parentPath}/${name}`;
      const existing = getContent({ key: path });
      if (existing) {
        if (publishFlag) {
          publish({ keys: [existing._id], includeDependencies: true });
        }
        return { action: "exists", _id: existing._id, _path: existing._path, published: publishFlag };
      }

      // The body is only read when something will actually be created.
      // createMedia picks the media content type (media:image,
      // media:vector, ...) from the mime type.
      const stream = getMultipartStream("file");
      if (!stream) {
        throw new Error("Could not read the uploaded file");
      }
      const media = createMedia<{ altText?: string; caption?: string }>({
        name,
        parentPath,
        mimeType: file.contentType,
        data: stream,
      });

      // createMedia has no fields for these, so they go on in a second
      // step. Only touch the content when there is something to store.
      const storeAltText = altText && media.type === "media:image";
      if (storeAltText || caption) {
        modify<{ altText?: string; caption?: string }>({
          key: media._id,
          editor: (c) => {
            if (storeAltText) c.data.altText = altText;
            if (caption) c.data.caption = caption;
            return c;
          },
        });
      }

      if (publishFlag) {
        publish({ keys: [media._id], includeDependencies: true });
      }
      return { action: "created", _id: media._id, _path: media._path, published: publishFlag };
    });
    return json(200, result);
  } catch (e) {
    return json(500, { error: String(e) });
  }
}

function json(status: number, body: unknown): ServiceResponse {
  return { status, contentType: "application/json", body: JSON.stringify(body) };
}
