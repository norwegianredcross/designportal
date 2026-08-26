/**
 * Runs the full seed set in a working order. The order matters and is
 * circular without the shell step: articles are created UNDER /docs/kode,
 * but the full kode landing (seed-seksjoner) resolves card links TO the
 * published articles — so a minimal kode shell is posted first, then the
 * articles, then the real sections.
 */
import { postArticle } from "./seed-lib.mjs";

// 1. Minimal shell so the article parent exists on a fresh sandbox.
await postArticle({
  parentPath: "/docs",
  name: "kode",
  displayName: "Kode",
  publish: true,
  data: { showInMenu: true, title: "Kode", blocks: [] },
});

// 2. Articles (create under /docs/kode, clean up old flat paths).
await import("./seed-kom-i-gang.mjs");
await import("./seed-kode-artikler.mjs");

// 3. Sections, including the full kode landing with resolved card links.
await import("./seed-seksjoner.mjs");
