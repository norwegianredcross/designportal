import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import { Heading } from "rk-designsystem";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { isRichTextData } from "@/utils";
import styles from "./TableBlock.module.css";

type TableData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockTable" }
>;

interface TableProps {
  data: TableData;
  meta: MetaData;
}

/**
 * The BLOKK_TABELL pattern: an optional title above a styled table. The
 * table markup is whatever the editor built in the table-only HtmlArea
 * (headers, merged cells and all), rendered by RichTextView and styled by
 * the CSS module — tinted header band, zebra rows, and horizontal
 * scrolling inside the block when the table outgrows the column.
 */
export function TableBlock({ data, meta }: TableProps) {
  if (!isRichTextData(data.table)) return null;
  return (
    <section style={{ marginBlock: "var(--ds-size-10)" }}>
      {data.title ? (
        <Heading level={2} data-size="sm" style={{ marginBottom: "var(--ds-size-5)" }}>
          {data.title}
        </Heading>
      ) : null}
      <div className={styles.scroller}>
        <RichTextView data={data.table} meta={meta} renderMacroInEditMode={false} />
      </div>
    </section>
  );
}
