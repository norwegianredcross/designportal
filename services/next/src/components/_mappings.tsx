import { APP_NAME, ComponentRegistry } from "@enonic/nextjs-adapter";
import { commonQuery, commonVariables } from "./queries/common";
import "@enonic/nextjs-adapter/baseMappings";
import DefaultPage from "@/components/pages/Default";
import BlocksView, { blocksProcessor } from "@/components/parts/BlocksView";
import ContentHeader, {
  contentHeaderProcessor,
} from "@/components/parts/ContentHeader";
import getContentHeader from "@/components/queries/getContentHeader";
import getBlocks from "./queries/getBlocks";

// You can set common query for all views here
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
