import { connect } from "/lib/xp/node";
import { run } from "/lib/xp/context";
import { migratePageLayout, type PageLayoutData } from "/lib/rodekors/page-layout";

type PageNode = { type: string; data: PageLayoutData };

/** Explicit, repeatable schema migration for preview content and older dumps.
 * Uses the locally configured import token. No token means no endpoint.
 * Migrate each branch independently: publishing draft would expose edits that
 * were never published. Only the page's data changes; identity, permissions,
 * publication metadata and all other node properties stay intact.
 */
export function post(req: { body?: string; headers: Record<string, string | undefined> }) {
  const token = app.config.importToken;
  if (!token || (req.headers.Authorization ?? req.headers.authorization) !== `Bearer ${token}`) {
    return { status: 404 };
  }
  let apply = false;
  try {
    apply = JSON.parse(req.body ?? "{}").apply === true;
  } catch {
    return { status: 400, body: "Expected JSON" };
  }
  return run({ user: { login: "su", idProvider: "system" }, principals: ["role:system.admin"] }, () => {
    const changes: { branch: string; id: string; path: string; before: PageLayoutData; after: PageLayoutData }[] = [];
    // Preflight both branches before writing anything. Refuse ambiguous
    // pages (multiple lists) instead of choosing one and losing content.
    for (const branch of ["draft", "master"]) {
      const repo = connect({ repoId: "com.enonic.cms.designsystem-docs", branch });
      let start = 0;
      while (true) {
        const result = repo.query({ query: "type = 'no.rodekors.docs:page'", start, count: 100, sort: "_id ASC" });
        for (const hit of result.hits) {
          const node = repo.get<PageNode>(hit.id);
          if (!node) continue;
          const after = migratePageLayout(node.data);
          if (after !== node.data) changes.push({ branch, id: node._id, path: node._path, before: node.data, after });
        }
        start += result.hits.length;
        if (!result.hits.length || start >= result.total) break;
      }
    }
    if (apply) {
      for (const change of changes) {
        const repo = connect({ repoId: "com.enonic.cms.designsystem-docs", branch: change.branch });
        repo.modify<PageNode>({
          key: change.id,
          editor: (node) => {
            // Re-evaluate against the latest version inside the editor.
            node.data = migratePageLayout(node.data);
            return node;
          },
        });
      }
    }
    return {
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ applied: apply, changes }),
    };
  });
}
