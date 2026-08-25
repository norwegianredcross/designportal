import { I18n } from "@enonic/nextjs-adapter";
import { fetchContent } from "@enonic/nextjs-adapter/server";
import MainView from "@enonic/nextjs-adapter/views/MainView";
import type { Metadata } from "next";
import { Footer } from "../../components/partials/Footer";
import { Header } from "../../components/partials/Header";
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

export async function generateMetadata({
  params,
}: {
  params: Promise<PageProps>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { common } = await fetchContent({
    ...resolvedParams,
    contentPath: resolvedParams.contentPath ?? [],
  });
  return {
    title: common?.get?.displayName ?? "Not found",
  };
}
