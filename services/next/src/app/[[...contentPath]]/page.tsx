/**
 * The only page route in the app. There are no file-based content pages:
 * every URL lands here, and what renders is decided by data from the CMS.
 *
 * The flow per request:
 *   1. Next puts the URL segments in `contentPath`.
 *   2. `fetchContent` translates URL -> XP content path using ENONIC_MAPPINGS
 *      ("no:designsystem-docs/docs" = project designsystem-docs, site at
 *      /docs, site path stripped from URLs — so /test is content /docs/test),
 *      picks the branch from XP's render-mode header (edit/preview/inline
 *      requests read draft; normal visits — including direct localhost
 *      access — read master, which is why unpublished content only shows in
 *      Content Studio's preview), and POSTs GraphQL to ENONIC_API.
 *   3. The result's meta decides which registered view renders (see
 *      _mappings.tsx); MainView dispatches to it.
 *
 * Importing _mappings here is what populates the ComponentRegistry — the
 * import runs for its side effects.
 */
import { I18n } from "@enonic/nextjs-adapter";
import { fetchContent } from "@enonic/nextjs-adapter/server";
import MainView from "@enonic/nextjs-adapter/views/MainView";
import type { Metadata } from "next";
// Imported straight from the package: rk-designsystem ships per-module
// 'use client' banners, so server components can use Header/Footer without
// local client wrappers.
import { Footer, Header } from "rk-designsystem";
import "../../components/_mappings";

// Content is served from Enonic XP at request time, so render every page
// dynamically (SSR) instead of pre-fetching content paths at build time.
export const dynamic = "force-dynamic";

export type PageProps = {
  contentPath?: string[];
};

export default async function Page({ params }: { params: Promise<PageProps> }) {
  const resolvedParams = await params;
  const data = await fetchContent({
    ...resolvedParams,
    contentPath: resolvedParams.contentPath ?? [],
  });

  await I18n.setLocale(data.meta.locale ?? data.meta.defaultLocale);

  return (
    <>
      <Header showUser={false} showSearch={false} showThemeToggle={true} />
      <main>
        <MainView {...data} />
      </main>
      <Footer></Footer>
    </>
  );
}

export async function generateMetadata({ params }: { params: Promise<PageProps> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { common } = await fetchContent({
    ...resolvedParams,
    contentPath: resolvedParams.contentPath ?? [],
  });
  return {
    title: common?.get?.displayName ?? "Not found",
  };
}
