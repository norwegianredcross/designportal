/**
 * Called by the XP-side Next.XP app when Content Studio opens a preview.
 * Enables Next's draft mode and redirects to the requested path. The cookie
 * itself does not choose the branch — it makes fetchContent forward the
 * request headers (and opt out of static rendering); the draft branch is
 * selected by XP's render-mode header on those forwarded requests.
 * Token-gated: only XP, which shares ENONIC_API_TOKEN, can enable it.
 */
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { validatePath, validateToken } from "../../../server/validate";

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

  const path = params.get("path");
  response = validatePath(path);
  if (response !== null) {
    return response;
  }

  console.info(`Previewing [${path}]...`);

  (await draftMode()).enable();

  redirect(!path?.length ? "/" : path);
}
