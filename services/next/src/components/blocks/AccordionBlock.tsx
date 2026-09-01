import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import type { BlockByTypename } from "@/types/blocks";
import { forceArray, isRichTextData, notNullOrUndefined } from "@/utils";
import { Details, DetailsContent, DetailsSummary } from "../partials/Details";

type AccordionData = BlockByTypename<"no_rodekors_docs_BlockAccordion">;

export type AccordionProps = {
  data: AccordionData;
  meta: MetaData;
};

export function AccordionBlock({ data, meta }: AccordionProps) {
  return (
    <>
      <h2>{data.title}</h2>

      {forceArray(data.items)
        .filter(notNullOrUndefined)
        .map((item) => (
          <Details key={item.title} data-color={data.theme ?? undefined}>
            <DetailsSummary>{item.title}</DetailsSummary>
            {/* Inside the content slot, not beside it: an expandable section's
                body is what Details collapses, and DetailsContent carries the
                padding and open/close behaviour. Rendered as a sibling the
                text sat outside that wrapper, with an empty slot next to it. */}
            <DetailsContent className="rk-prose">
              {isRichTextData(item.text) ? (
                <RichTextView data={item.text} meta={meta} renderMacroInEditMode={false} />
              ) : null}
            </DetailsContent>
          </Details>
        ))}
    </>
  );
}
