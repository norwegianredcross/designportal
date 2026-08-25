/**
 * Content Studio probes this endpoint before showing its preview/editor:
 * "can the frontend render this content?" 200 = yes, 418 = no (404/500 pass
 * through). The answer drives whether the page-editor panel opens at all —
 * which is why the Side content-type mapping matters: it makes every Side
 * renderable from the moment it is saved, so editors never meet a dead
 * preview panel on fresh content.
 */
import { IS_DEV_MODE, RENDER_MODE } from "@enonic/nextjs-adapter";
import { fetchContent } from "@enonic/nextjs-adapter/server";

// Register component mappings
import "../../../components/_mappings";
import type { NextRequest } from "next/server";
import { validatePath, validateToken } from "@/server/validate";

export function HEAD(req: NextRequest) {
  return processRequest(req);
}

export function GET(req: NextRequest) {
  return processRequest(req);
}

async function processRequest(req: NextRequest) {
  const params = req.nextUrl.searchParams;

  const token = params.get("token");
  let response = validateToken(token);
  if (response !== null) {
    return response;
  }

  const path = params.get("path") || [];
  response = validatePath(path);
  if (response !== null) {
    return response;
  }

  console.info(`Is renderable request for: ${path}`);

  const { meta, error = null } = await fetchContent({
    contentPath: path,
    headers: req.headers,
  });

  if (error && (error.code === "500" || error.code === "404")) {
    return new Response(null, {
      status: Number(error.code),
    });
  }

  // catch-all rendering is ignored for isRenderableRequest in edit mode
  // to allow selecting descriptors in page editor
  const catchAllInEditOrCantRender = !meta.canRender || (meta.catchAll && isRenderableRequestEditMode(req));

  const catchAllInNextProdMode = meta.renderMode === RENDER_MODE.NEXT && !IS_DEV_MODE && meta.catchAll;

  const notFound = catchAllInEditOrCantRender || catchAllInNextProdMode;

  return new Response(null, {
    status: notFound ? (meta.renderMode !== RENDER_MODE.NEXT ? 418 : 404) : 200,
  });
}

function isRenderableRequestEditMode(req: NextRequest): boolean {
  const method = req.method;
  const mode = req.nextUrl.searchParams.get("mode");
  return method === "HEAD" && mode === RENDER_MODE.EDIT;
}
