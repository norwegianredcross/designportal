import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import { Heading } from "rk-designsystem";
import type { GetContentHeaderQuery } from "@/types/queries";
import type { Get, PartProps } from "@/types/utils";
import { forceArray, isRichTextData } from "@/utils";
import styles from "./ContentHeader.module.css";

type GetContentHeaderData = Get<GetContentHeaderQuery, "guillotine.get.data">;

const ContentHeader = (props: PartProps<GetContentHeaderData>) => {
  // A leading hero already supplies the page's h1 and introduction.
  if (!props.data) return null;
  return (
    <header>
      {props.data.kicker ? <p className={styles.kicker}>{props.data.kicker}</p> : null}
      <Heading level={1} data-size="xl">
        {props.data.title}
      </Heading>
      {isRichTextData(props.data?.intro) ? (
        <div data-size="lg" className={`ds-paragraph ${styles.ingress}`}>
          <RichTextView className="rk-prose" data={props.data.intro} meta={props.meta} renderMacroInEditMode={false} />
        </div>
      ) : null}
      <hr className={styles.leadRule} />
    </header>
  );
};

export default ContentHeader;

export async function contentHeaderProcessor(
  data: GetContentHeaderQuery["guillotine"],
): Promise<GetContentHeaderData | undefined> {
  if (forceArray(data?.layout?.before)[0]?.__typename === "no_rodekors_docs_BlockHero") return undefined;
  return data?.get?.data ?? undefined;
}
