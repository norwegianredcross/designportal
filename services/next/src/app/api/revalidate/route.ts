/**
 * Called by XP on publish/unpublish so Next drops its cached render of the
 * affected path (or everything, when no path is given). With the catch-all
 * currently force-dynamic this is belt-and-braces, but it keeps publish
 * semantics correct if caching is ever enabled.
 */
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { validateToken } from "@/server/validate";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  // Check for secret to confirm this is a valid request
  const token = params.get("token");
  const response = validateToken(token);
  if (response !== null) {
    return response;
  }

  const path = params.get("path");
  try {
    if (!path) {
      // This will revalidate everything
      revalidatePath("/", "layout");
      console.info(`Revalidated everything`);
    } else {
      revalidatePath(normalizePath(path), "page");
      console.info(`Revalidated [${path}]`);
    }
    return Response.json({ revalidated: true }, { status: 200 });
  } catch (err) {
    console.error(`Revalidation [${path ?? "everything"}] error: ` + err);
    return Response.json({ revalidated: false }, { status: 200 });
  }
}

function normalizePath(path: string[] | string): string {
  return typeof path === "string" ? (path.charAt(0) !== "/" ? "/" + path : path) : "/" + path.join("/");
}
