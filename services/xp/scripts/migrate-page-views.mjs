import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const token = process.env.DOCS_IMPORT_TOKEN;
if (!token) throw new Error("Set DOCS_IMPORT_TOKEN to importToken from no.rodekors.docs.cfg");
const endpoint = process.env.DOCS_MIGRATION_URL ??
  "http://localhost:8081/site/designsystem-docs/master/docs/_/service/no.rodekors.docs/migrate-page-views";

async function request(apply) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ apply }),
  });
  if (!response.ok) throw new Error(`Migration failed (${response.status}): ${await response.text()}`);
  return response.json();
}

const preview = await request(false);
for (const change of preview.changes) console.log(`${change.branch}: ${change.path} → ${change.after.pageView._selected}`);
if (!preview.changes.length) {
  console.log("All pages already use the new model.");
} else if (!process.argv.includes("--apply")) {
  console.log("Dry run only. Run again with --apply to migrate these pages.");
} else {
  const directory = await mkdtemp(join(tmpdir(), "docs-page-views-"));
  const backup = join(directory, "before.json");
  await writeFile(backup, JSON.stringify(preview, null, 2), { mode: 0o600 });
  console.log(`Original page fields saved to ${backup}`);
  const result = await request(true);
  await writeFile(join(directory, "applied.json"), JSON.stringify(result, null, 2), { mode: 0o600 });
  console.log(`Migrated ${result.changes.length} branch records.`);
}
