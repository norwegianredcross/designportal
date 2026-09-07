import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { FunctionComponent } from "react";
import type { Block, BlockByTypename } from "@/types/blocks";
import { AccordionBlock } from "./AccordionBlock";
import { CardsBlock } from "./CardsBlock";
import { CodeBlock } from "./CodeBlock";
import { ComponentsBlock } from "./ComponentsBlock";
import { DemoBlock } from "./DemoBlock";
import { FactboxBlock } from "./FactboxBlock";
import { HeroBlock } from "./HeroBlock";
import { ImagesBlock } from "./ImagesBlock";
import { QuoteBlock } from "./QuoteBlock";
import { SummaryBlock } from "./SummaryBlock";
import { TableBlock } from "./TableBlock";
import { TextBlock } from "./TextBlock";

/**
 * The single source of truth for "which React component renders which
 * block". Keys are GraphQL __typename values from the XP-side Block union
 * (guillotine/guillotine.ts). Both render paths (the blocks-view part and
 * the Side content-type view) read from this map, so a new block is wired
 * in exactly one place on the frontend.
 */
type BlockProps<Data> = { data: Data; meta: MetaData };

/**
 * Keys are constrained to the real `__typename` union, and each one's value
 * must accept exactly that block's data. The previous
 * `Record<string, FunctionComponent<{ data: any }>>` accepted a misspelled
 * key or a component wired to the wrong block without a murmur from tsc.
 */
type BlockRegistry = {
  [Name in Block["__typename"]]?: FunctionComponent<BlockProps<BlockByTypename<Name>>>;
};

export const blockComponents: BlockRegistry = {
  no_rodekors_docs_BlockText: TextBlock,
  no_rodekors_docs_BlockAccordion: AccordionBlock,
  no_rodekors_docs_BlockQuote: QuoteBlock,
  no_rodekors_docs_BlockFactbox: FactboxBlock,
  // Live design system example from the curated registry (local block).
  no_rodekors_docs_BlockDemo: DemoBlock,
  // Copyable code snippet — the first LOCAL block (docs-specific mixin).
  no_rodekors_docs_BlockCode: CodeBlock,
  // Component catalogue generated from the library's published manifest
  // (local block; async server component, see ComponentsBlock).
  no_rodekors_docs_BlockComponents: ComponentsBlock,
  // Link-card grid; links pre-resolved by XP (see CardsBlock).
  no_rodekors_docs_BlockCards: CardsBlock,
  // Gallery of figures; images arrive pre-scaled from XP (see ImagesBlock).
  no_rodekors_docs_BlockImages: ImagesBlock,
  // Styled table from the rich-text table editor (local block).
  no_rodekors_docs_BlockTable: TableBlock,
  // Key figures with an optional link (local block).
  no_rodekors_docs_BlockSummary: SummaryBlock,
  // Landing panel with the notched corner (local block).
  no_rodekors_docs_BlockHero: HeroBlock,
};
