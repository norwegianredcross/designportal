import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { FunctionComponent } from "react";
import { AccordionBlock } from "./AccordionBlock";
import { FactboxBlock } from "./FactboxBlock";
import { QuoteBlock } from "./QuoteBlock";
import { TextBlock } from "./TextBlock";

/**
 * The single source of truth for "which React component renders which
 * block". Keys are GraphQL __typename values from the XP-side Block union
 * (guillotine/guillotine.ts). Both render paths (the blocks-view part and
 * the Side content-type view) read from this map, so a new block is wired
 * in exactly one place on the frontend.
 */
export const blockComponents: Record<string, FunctionComponent<{ data: any; meta: MetaData }>> = {
  no_rodekors_docs_BlockText: TextBlock,
  no_rodekors_docs_BlockAccordion: AccordionBlock,
  no_rodekors_docs_BlockQuote: QuoteBlock,
  no_rodekors_docs_BlockFactbox: FactboxBlock,
};
