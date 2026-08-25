/**
 * The lookup table between the CMS and React — the heart of the rendering
 * contract. XP identifies everything by descriptor (app-name:name); this
 * file binds each descriptor to a {view, query, processor} triple:
 *
 *   - query:      GraphQL sent to Guillotine when that thing renders
 *   - processor:  massages the raw query result into view props
 *   - view:       the React component
 *
 * Three kinds of binding. For the page itself the adapter tries, in order:
 *   1. addContentType (non-catchAll) — keyed on the content's TYPE. Note:
 *      this wins even when an editor HAS assigned a page controller, so
 *      SidePage is the renderer for every Side.
 *   2. addPage — the page controller an editor assigned via a template.
 *   3. addContentType registered as catchAll.
 * addPart is a separate lookup entirely: parts are resolved per placed
 * component when a page's regions render.
 *
 * This module runs for its side effects — page.tsx imports it so the
 * registry is populated before the first fetch.
 */
import { APP_NAME, ComponentRegistry } from "@enonic/nextjs-adapter";
import { commonQuery, commonVariables } from "./queries/common";
import "@enonic/nextjs-adapter/baseMappings";
import DefaultPage from "@/components/pages/Default";
import SidePage from "@/components/pages/SidePage";
import BlocksView, { blocksProcessor } from "@/components/parts/BlocksView";
import ContentHeader, { contentHeaderProcessor } from "@/components/parts/ContentHeader";
import getContentHeader from "@/components/queries/getContentHeader";
import getBlocks from "./queries/getBlocks";
import getSidePage from "./queries/getSidePage";

// Runs for every page render; the result lands in props.common on all views.
ComponentRegistry.setCommonQuery([commonQuery, commonVariables]);

// Content type mappings

// Page mappings
ComponentRegistry.addPage(`${APP_NAME}:default`, {
  view: DefaultPage,
  //query: getPage,
});

// Layout mappings

// Part mappingss
ComponentRegistry.addPart(`${APP_NAME}:blocks-view`, {
  query: getBlocks,
  view: BlocksView,
  processor: blocksProcessor as any,
});

ComponentRegistry.addPart(`${APP_NAME}:content-header`, {
  query: getContentHeader,
  processor: contentHeaderProcessor as any,
  view: ContentHeader,
});

// Content type mappings: a Side renders straight from its data when no page
// or template is set — see SidePage for why.
ComponentRegistry.addContentType(`${APP_NAME}:page`, {
  query: getSidePage,
  view: SidePage as any,
});
