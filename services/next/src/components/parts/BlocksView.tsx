import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { nonNullable } from "next/dist/lib/non-nullable";
import type { FunctionComponent } from "react";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get, PartProps } from "@/types/utils";
import { forceArray } from "@/utils";
import { blockComponents } from "../blocks/registry";
import styles from "./BlocksView.module.css";

type GetBlocksQueryBlock = NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>;

/**
 * The wrapper class for ONE block: the boundary element every block needs
 * (see the module's own comment), plus whether this one leaves the article
 * column.
 *
 * It lives here rather than inline because there are two render paths — this
 * part and SidePage — and they had already drifted into two copies of the
 * wrapper. A width choice that only one of them honoured would look like a
 * broken editor field, not like a missing line of code.
 */
export function blockWrapperClass(block: object): string {
  // Only some blocks carry the composed blocks-width mixin, so the union as a
  // whole has no `width` — narrow on the field rather than on every typename
  // that happens to offer it today.
  const isWide = "width" in block && (block as { width?: string | null }).width === "wide";
  return isWide ? `${styles.block} ${styles.blockWide}` : styles.block;
}

const BlocksView = (props: PartProps<GetBlocksQueryBlock[]>) => {
  return <div className={styles.blocks}>{renderBlocks(props)}</div>;
};

const renderBlocks = (props: PartProps<GetBlocksQueryBlock[]>) => {
  return forceArray(props.data).map((data, index) => {
    // The registry is correlated per typename, but TypeScript cannot narrow the
    // lookup and the block union together, so widen to the union the
    // components collectively accept.
    const Block = blockComponents[data.__typename] as
      | FunctionComponent<{ data: GetBlocksQueryBlock; meta: MetaData }>
      | undefined;

    if (!Block) return null;

    return (
      // The wrapper is the block boundary the stylesheet keys on. Blocks that
      // return fragments would otherwise spill several roots into the flex
      // container and pick up between-block spacing internally.
      //
      // It is also what a full-width block widens: the row escapes the
      // article column here, so no block component has to know the page frame
      // exists.
      <div
        // biome-ignore lint/suspicious/noArrayIndexKey: This will not be re-ordered, so allow index in key
        key={`block-${index}`}
        className={blockWrapperClass(data)}
        data-block={data.__typename}
      >
        <Block data={data} meta={props.meta} />
      </div>
    );
  });
};

export default BlocksView;

export async function blocksProcessor(data: GetBlocksQuery["guillotine"]): Promise<GetBlocksQueryBlock[]> {
  return forceArray(data?.blocks).filter(nonNullable);
}
