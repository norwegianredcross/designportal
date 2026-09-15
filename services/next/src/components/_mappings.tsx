// Page controllers and parts follow CMS100003-webpage's template composition.
// A direct Side content-type mapping would override the selected template.
import { APP_NAME, ComponentRegistry, type DataProcessor } from "@enonic/nextjs-adapter";
import { commonQuery, commonVariables } from "./queries/common";
import "@enonic/nextjs-adapter/baseMappings";
import DefaultPage from "@/components/pages/Default";
import BlocksView, { blocksProcessor } from "@/components/parts/BlocksView";
import ContentHeader, { contentHeaderProcessor } from "@/components/parts/ContentHeader";
import getContentHeader from "@/components/queries/getContentHeader";
import getBlocks from "./queries/getBlocks";
import getPageDefault from "./queries/getPageDefault";

// Runs for every page render; the result lands in props.common on all views.
ComponentRegistry.setCommonQuery([commonQuery, commonVariables]);

// Content type mappings

// Page mappings
ComponentRegistry.addPage(`${APP_NAME}:default`, {
  view: DefaultPage,
  query: getPageDefault,
});

// Layout mappings

// Part mappings
ComponentRegistry.addPart(`${APP_NAME}:blocks-view`, {
  query: getBlocks,
  view: BlocksView,
  processor: blocksProcessor as DataProcessor,
});

ComponentRegistry.addPart(`${APP_NAME}:content-header`, {
  query: getContentHeader,
  processor: contentHeaderProcessor as DataProcessor,
  view: ContentHeader,
});
