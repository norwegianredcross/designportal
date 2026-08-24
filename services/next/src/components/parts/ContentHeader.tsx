import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import type { GetContentHeaderQuery } from "@/types/queries";
import type { Get, PartProps } from "@/types/utils";
import { isRichTextData } from "@/utils";

type GetContentHeaderData = Get<GetContentHeaderQuery, "guillotine.get.data">;

const ContentHeader = (props: PartProps<GetContentHeaderData>) => {
  return (
    <header>
      <h1>{props.data?.title}</h1>
      {isRichTextData(props.data?.intro) ? (
        <RichTextView
          data={props.data.intro}
          meta={props.meta}
          renderMacroInEditMode={false}
        />
      ) : null}
      <hr />
    </header>
  );
};

export default ContentHeader;

export async function contentHeaderProcessor(
  data: GetContentHeaderQuery["guillotine"],
): Promise<GetContentHeaderData | undefined> {
  return data?.get?.data ?? undefined;
}
