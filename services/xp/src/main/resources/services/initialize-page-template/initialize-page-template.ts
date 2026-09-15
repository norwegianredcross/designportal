import { run } from "/lib/xp/context";
import { connect } from "/lib/xp/node";
import { initializePageTemplate } from "/lib/rodekors/page-template";

type TemplateNode = { type: string; components?: unknown; data: { supports?: string | string[] } };

// Initialize the preview template per branch without publishing draft changes.
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
    const changes: { branch: string; id: string; path: string; before: unknown; after: unknown }[] = [];
    for (const branch of ["draft", "master"]) {
      const repo = connect({ repoId: "com.enonic.cms.designsystem-docs", branch });
      const node = repo.get<TemplateNode>("/content/docs/_templates/standard-side");
      if (node?.type !== "portal:page-template") {
        return { status: 409, body: `Missing Standard side template in ${branch}; create it in Content Studio first.` };
      }
      const after = initializePageTemplate(node);
      if (after !== node) {
        changes.push({
          branch,
          id: node._id,
          path: node._path,
          before: node.components ?? [],
          after: after.components,
        });
      }
    }
    if (apply) {
      for (const change of changes) {
        const repo = connect({ repoId: "com.enonic.cms.designsystem-docs", branch: change.branch });
        repo.modify<TemplateNode>({ key: change.id, editor: initializePageTemplate });
      }
    }
    return { status: 200, contentType: "application/json", body: JSON.stringify({ applied: apply, changes }) };
  });
}
