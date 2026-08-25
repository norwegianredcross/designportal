/**
 * Local content-migration endpoint — the write-side companion to Guillotine.
 *
 * Guillotine is read-only, and XP has no public write API, so migrating
 * articles from the old docs SPA needs a door into the content repo. This
 * service is that door: POST a page's fields as JSON and it upserts the
 * content in the draft branch, ready for editorial review in Content
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
 */
import { create, get as getContent, modify, publish } from "/lib/xp/content";
import { run } from "/lib/xp/context";

interface ImportPayload {
  /** Content-repo path of the parent, e.g. "/docs" (the site). */
  parentPath: string;
  /** URL slug for the article, e.g. "kom-i-gang". */
  name: string;
  displayName: string;
  /** Page fields verbatim: title, intro (HTML string), blocks (option-set array). */
  data: Record<string, unknown>;
  /** Also push draft -> master so the public site renders it immediately. */
  publish?: boolean;
}

export function post(req: { body?: string; headers: Record<string, string | undefined> }): {
  status: number;
  contentType?: string;
  body?: string;
} {
  // Layer 1+2 of the safety model (see file header): without a configured
  // token the endpoint pretends not to exist, and with one the caller must
  // present it. 404 in both failure cases so probing can't tell the
  // difference between "disabled" and "wrong token".
  const token = app.config.importToken;
  const authHeader = req.headers.Authorization ?? req.headers.authorization;
  if (!token || authHeader !== `Bearer ${token}`) {
    return { status: 404 };
  }

  let payload: ImportPayload;
  try {
    payload = JSON.parse(req.body ?? "") as ImportPayload;
  } catch {
    return json(400, { error: "Body must be JSON" });
  }
  if (!payload.parentPath || !payload.name || !payload.data) {
    return json(400, { error: "parentPath, name and data are required" });
  }

  // The anonymous caller carries no write access by itself; the token check
  // above is what authorizes the call, and run() elevates inside the
  // request's repo context. The branch is forced to draft: XP auth-walls
  // /draft site URLs before any service runs, so the seed scripts must call
  // the public /master URL — but content still belongs in draft first, with
  // the publish flag pushing draft -> master afterwards.
  try {
    const result = run(
      { branch: "draft", user: { login: "su", idProvider: "system" }, principals: ["role:system.admin"] },
      () => {
        const path = `${payload.parentPath}/${payload.name}`;
        const existing = getContent({ key: path });

        // Upsert so the seed scripts are safe to re-run while iterating on the
        // migrated content: first run creates, later runs overwrite the fields.
        const content = existing
          ? modify({
              key: path,
              editor: (c) => {
                c.displayName = payload.displayName;
                c.data = payload.data as typeof c.data;
                return c;
              },
            })
          : create({
              parentPath: payload.parentPath,
              name: payload.name,
              displayName: payload.displayName,
              contentType: `${app.name}:page`,
              data: payload.data,
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
        };
      },
    );
    return json(200, result);
  } catch (e) {
    // lib-content throws on e.g. a missing parent path; surface it in the
    // same JSON shape as the validation errors instead of XP's HTML 500.
    return json(500, { error: String(e) });
  }
}

function json(status: number, body: unknown) {
  return { status, contentType: "application/json", body: JSON.stringify(body) };
}
