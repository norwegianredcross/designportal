/**
 * Shared helpers for the article seed scripts: the block-shape constructors
 * (the exact option-set entries Content Studio stores, `_selected` + fields
 * nested under the option name) and the POST against the token-gated
 * import service (services/xp .../services/import-docs).
 *
 * Run any seed with the XP sandbox up and the import token configured:
 *   DOCS_IMPORT_TOKEN=<token from no.rodekors.docs.cfg> node scripts/seed-<name>.mjs
 */

import { readFile } from "node:fs/promises";
import { basename, extname } from "node:path";

export const text = (html) => ({ _selected: "blocks-text", "blocks-text": { text: html } });

export const code = (codeStr, language, label) => ({
  _selected: "blocks-code",
  "blocks-code": { code: codeStr, language, label },
});

/** "Label: resten av teksten" -> <li><strong>Label:</strong> resten</li>,
 * the docs SPA's bold-prefix list convention. */
export const boldItem = (s) => {
  const i = s.indexOf(":");
  if (i === -1) return `<li>${s}</li>`;
  return `<li><strong>${s.slice(0, i)}:</strong> ${s.slice(i + 1).trim()}</li>`;
};

export const ul = (items) => `<ul>${items.join("")}</ul>`;

// The service is mounted under the site. The public /master URL is used
// because XP auth-walls /draft site URLs before any service code runs; the
// service itself still writes to the draft branch and the publish flag
// then pushes draft -> master.
const serviceUrl =
  process.env.XP_IMPORT_URL ??
  "http://localhost:8080/site/designsystem-docs/master/docs/_/service/no.rodekors.docs/import-docs";

/** ContentSelector fields (e.g. the cards' internal links) store content
 * REFERENCES — ids, not paths. This resolves a path to its id through the
 * public Guillotine endpoint on master. */
export async function contentId(path) {
  const apiUrl = process.env.XP_API_URL ?? "http://localhost:8080/site/designsystem-docs/master";
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // The path travels as a variable, never interpolated into the query.
    body: JSON.stringify({
      query: "query($k:ID!){ guillotine { get(key:$k) { _id } } }",
      variables: { k: path },
    }),
  });
  if (!res.ok) {
    console.error(`Guillotine lookup failed for ${path}: ${res.status}`);
    process.exit(1);
  }
  const json = await res.json();
  const id = json?.data?.guillotine?.get?._id;
  if (!id) {
    console.error(`Could not resolve content id for ${path} — is it published?`);
    process.exit(1);
  }
  return id;
}

// Media (images) go through the same service as multipart/form-data, one
// file per call. Node 22 ships FormData/Blob/fetch, so no dependency.
const MIME_BY_EXT = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
};

/**
 * Uploads one image as media under `parentPath` and returns its content id,
 * so a seed can do `image: await postMedia({...})` straight into an
 * ImageSelector field. The content name is the file name (kept exactly,
 * extension included), which makes the item addressable by path afterwards:
 * `/docs/design/OppstartStep1.png`. The service is idempotent on that path -
 * re-running a seed returns the existing id instead of uploading again.
 */
export async function postMedia({ parentPath, filePath, name, altText, caption, publish = true }) {
  const token = requireToken();
  const fileName = name ?? basename(filePath);
  const ext = extname(fileName).slice(1).toLowerCase();
  const mimeType = MIME_BY_EXT[ext];
  if (!mimeType) {
    console.error(`postMedia: unsupported file type .${ext} (${fileName})`);
    process.exit(1);
  }

  const form = new FormData();
  form.set("parentPath", parentPath);
  form.set("name", fileName);
  form.set("publish", String(publish));
  if (altText) form.set("altText", altText);
  if (caption) form.set("caption", caption);
  // The third argument is the multipart file name; XP reads the mime type
  // from the part's Content-Type, which Blob's `type` becomes.
  form.set("file", new Blob([await readFile(filePath)], { type: mimeType }), fileName);

  // No Content-Type header here: fetch writes the multipart boundary itself.
  const res = await fetch(serviceUrl, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const bodyText = await res.text();
  if (!res.ok) {
    console.error(`Media import failed for ${fileName}: ${res.status} ${bodyText}`);
    process.exit(1);
  }
  const result = JSON.parse(bodyText);
  console.log(`Media ${result.action} ${result._path}`);
  return result._id;
}

function requireToken() {
  const token = process.env.DOCS_IMPORT_TOKEN;
  if (!token) {
    console.error("Set DOCS_IMPORT_TOKEN to the importToken value from the sandbox's no.rodekors.docs.cfg");
    process.exit(1);
  }
  return token;
}

export async function postArticle(article) {
  const token = requireToken();
  const res = await fetch(serviceUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(article),
  });
  const bodyText = await res.text();
  if (!res.ok) {
    console.error(`Import failed for ${article.name}: ${res.status} ${bodyText}`);
    process.exit(1);
  }
  // Removal-only payloads have no name; say what was done instead.
  console.log(`Imported ${article.name ?? "(removal)"}: ${bodyText}`);
}
