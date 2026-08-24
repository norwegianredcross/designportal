import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { isRichTextData } from "@/utils";

type TextData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockText" }
>;

interface TextProps {
  data: TextData;
  meta: MetaData;
}

export function TextBlock({ data, meta }: TextProps) {
  return (
    <>
      <h2>{data.title}</h2>
      {isRichTextData(data.text) ? (
        <RichTextView
          data={data.text}
          meta={meta}
          renderMacroInEditMode={false}
        />
      ) : null}
    </>
  );
}
