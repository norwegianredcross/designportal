/** Resolve CMS URLs and dispatch to the selected page controller.
 * ENONIC_MAPPINGS strips /docs; normal requests read master, previews read draft.
 * Importing _mappings registers the page and part views.
 */
import { I18n } from "@enonic/nextjs-adapter";
import { fetchContent } from "@enonic/nextjs-adapter/server";
import MainView from "@enonic/nextjs-adapter/views/MainView";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../components/_mappings";

// Content is served from Enonic XP at request time, so render every page
// dynamically (SSR) instead of pre-fetching content paths at build time.
export const dynamic = "force-dynamic";

export type PageProps = {
  contentPath?: string[];
};

// Render the front page at / without changing the browser URL.
const FRONT_PAGE = "forside";
const resolveContentPath = (contentPath?: string[]) => (contentPath?.length ? contentPath : [FRONT_PAGE]);

export default async function Page({ params }: { params: Promise<PageProps> }) {
  const resolvedParams = await params;
  const data = await fetchContent({
    ...resolvedParams,
    contentPath: resolveContentPath(resolvedParams.contentPath),
  });

  // Missing and unpublished pages must return 404.
  if (data.error?.code === "404") {
    notFound();
  }

  await I18n.setLocale(data.meta.locale ?? data.meta.defaultLocale);

  return <MainView {...data} />;
}

export async function generateMetadata({ params }: { params: Promise<PageProps> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { common } = await fetchContent({
    ...resolvedParams,
    contentPath: resolveContentPath(resolvedParams.contentPath),
  });
  return {
    title: common?.get?.displayName ?? "Not found",
  };
}
