import { forceArray } from "/lib/rodekors/arrays";
import type { Blocks } from "/site/mixins/blocks";

export type EditorialBlock = NonNullable<Blocks["blocks"]>[number];
export type PageViewKind = "components" | "changelog" | "tokens";
export interface PageViewSettings {
  title?: string;
  intro?: string;
  showSearch?: boolean;
  maxReleases?: number;
}
type PageView = { _selected: PageViewKind } & Partial<Record<PageViewKind, PageViewSettings>>;
type LegacyName = `blocks-${PageViewKind}`;
type LegacyBlock = { _selected: LegacyName } & Partial<Record<LegacyName, PageViewSettings>>;

export interface PageLayoutData {
  blocks?: (EditorialBlock | LegacyBlock)[] | EditorialBlock | LegacyBlock;
  pageView?: PageView;
  afterContent?: { blocks?: EditorialBlock[] | EditorialBlock };
}

function isLegacy(block: EditorialBlock | LegacyBlock): block is LegacyBlock {
  return ["blocks-components", "blocks-changelog", "blocks-tokens"].indexOf(block._selected) !== -1;
}

/** Move one legacy generated block into the fixed page slot, preserving order
 * and settings. Also used on reads so restored older dumps still render.
 * Ambiguous pages are rejected rather than silently discarding a second list.
 */
export function migratePageLayout<T extends PageLayoutData>(data: T): T {
  const blocks = forceArray(data.blocks);
  const legacy = blocks.filter(isLegacy);
  if (!legacy.length) return data;
  if (legacy.length > 1 || data.pageView?._selected) {
    throw new Error("Page has multiple generated sections; choose one page view before migrating");
  }
  const block = legacy[0];
  const index = blocks.indexOf(block);
  const kind = block._selected.slice("blocks-".length) as PageViewKind;
  return {
    ...data,
    blocks: blocks.slice(0, index),
    pageView: { _selected: kind, [kind]: block[block._selected] ?? {} },
    afterContent: {
      ...data.afterContent,
      blocks: [...blocks.slice(index + 1), ...forceArray(data.afterContent?.blocks)] as EditorialBlock[],
    },
  };
}

export function getPageLayout(data: PageLayoutData) {
  const migrated = migratePageLayout(data);
  const kind = migrated.pageView?._selected;
  return {
    kind: kind ?? "article",
    ...(kind ? migrated.pageView?.[kind] : {}),
    before: forceArray(migrated.blocks) as EditorialBlock[],
    after: forceArray(migrated.afterContent?.blocks),
  };
}
