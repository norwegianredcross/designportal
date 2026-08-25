/**
 * Wraps every content render with the editor-awareness Content Studio needs:
 *
 * - In EDIT mode (the page editor iframe) the output is wrapped in
 *   StaticContent, which disables hydration — clicks select components in
 *   the editor instead of triggering app interactivity.
 * - For COMPONENT requests, Content Studio is live-refreshing ONE component
 *   after an edit; the `data-single-component-output` wrapper is the marker
 *   the XP-side Next.XP proxy looks for to lift that fragment out of the
 *   full page response before handing it to the editor.
 *
 * Neither branch affects normal visitors (renderMode NEXT).
 */
import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import { fetchContent } from "@enonic/nextjs-adapter/server";
import StaticContent from "@enonic/nextjs-adapter/views/StaticContent";
import type { ReactNode } from "react";
import type { PageProps } from "./page";

type LayoutProps = {
  params: Promise<PageProps>;
  children: ReactNode;
};

export default async function PageLayout({ params, children }: LayoutProps) {
  const resolvedParams = await params;
  const { meta } = await fetchContent({
    ...resolvedParams,
    contentPath: resolvedParams.contentPath || [],
  });

  const isEdit = meta?.renderMode === RENDER_MODE.EDIT;

  // Component rendering - for component updates in Content Studio without reloading page
  if (meta.requestType === XP_REQUEST_TYPE.COMPONENT) {
    // don't wrap it in direct next access because we want to show 1 component on the page
    const content: ReactNode =
      meta.renderMode === RENDER_MODE.NEXT ? (
        children
      ) : (
        <details data-single-component-output="true">{children}</details>
      );

    return <StaticContent condition={isEdit}>{content}</StaticContent>;
  }

  return <StaticContent condition={isEdit}>{children}</StaticContent>;
}
