import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import type { FunctionComponent } from "react";
import { AccordionBlock } from "@/components/blocks/AccordionBlock";
import { TextBlock } from "@/components/blocks/TextBlock";
import { forceArray, isRichTextData, notNullOrUndefined } from "@/utils";

const blockComponents: Record<
  string,
  FunctionComponent<{ data: any; meta: MetaData }>
> = {
  no_rodekors_docs_BlockText: TextBlock,
  no_rodekors_docs_BlockAccordion: AccordionBlock,
};

interface SidePageProps {
  data?: {
    get?: { data?: { title?: string | null; intro?: unknown } | null } | null;
    blocks?: unknown[] | null;
  };
  meta: MetaData;
}

/**
 * Renders a Side directly from its content data — no page composition or
 * template required. This unblocks editor preview and publishing before any
 * page template exists; a template with parts (the reference setup) still
 * takes precedence for content that has one.
 */
const SidePage = ({ data, meta }: SidePageProps) => {
  const header = data?.get?.data;
  const blocks = forceArray(data?.blocks).filter(notNullOrUndefined) as Array<{
    __typename: string;
  }>;
  return (
    <>
      <header>
        <h1>{header?.title}</h1>
        {isRichTextData(header?.intro) ? (
          <RichTextView
            data={header.intro}
            meta={meta}
            renderMacroInEditMode={false}
          />
        ) : null}
        <hr />
      </header>
      {blocks.map((block, index) => {
        const Block = blockComponents[block.__typename];
        if (!Block) return null;
        // biome-ignore lint/suspicious/noArrayIndexKey: block order is stable
        return <Block key={`block-${index}`} data={block} meta={meta} />;
      })}
    </>
  );
};

export default SidePage;
