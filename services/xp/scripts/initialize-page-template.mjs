import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const token = process.env.DOCS_IMPORT_TOKEN;
if (!token) throw new Error("Set DOCS_IMPORT_TOKEN to importToken from no.rodekors.docs.cfg");
const endpoint = process.env.DOCS_MIGRATION_URL ??
  "http://localhost:8081/site/designsystem-docs/master/docs/_/service/no.rodekors.docs/initialize-page-template";

async function request(apply) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ apply }),
  });
  if (!response.ok) throw new Error(`Template initialization failed (${response.status}): ${await response.text()}`);
  return response.json();
}

const preview = await request(false);
for (const change of preview.changes) console.log(`${change.branch}: ${change.path} → Standard controller with header/main parts`);
if (!preview.changes.length) {
  console.log("The template already has a composition. Nothing changed.");
} else if (!process.argv.includes("--apply")) {
  console.log("Dry run only. Run again with --apply to initialize the empty template.");
} else {
  const directory = await mkdtemp(join(tmpdir(), "docs-page-template-"));
  const backup = join(directory, "before.json");
  await writeFile(backup, JSON.stringify(preview, null, 2), { mode: 0o600 });
  console.log(`Original template components saved to ${backup}`);
  const result = await request(true);
  await writeFile(join(directory, "applied.json"), JSON.stringify(result, null, 2), { mode: 0o600 });
  console.log(`Initialized ${result.changes.length} template branch records.`);
}
