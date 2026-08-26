import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { forceArray, isRichTextData, notNullOrUndefined } from "@/utils";
import { Details, DetailsContent, DetailsSummary } from "../partials/Details";

type AccordionData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockAccordion" }
>;

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
            {isRichTextData(item.text) ? (
              <RichTextView className="rk-prose" data={item.text} meta={meta} renderMacroInEditMode={false} />
            ) : null}
            <DetailsContent></DetailsContent>
          </Details>
        ))}
    </>
  );
}
