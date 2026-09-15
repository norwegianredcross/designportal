import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { nonNullable } from "next/dist/lib/non-nullable";
import type { FunctionComponent } from "react";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get, PartProps } from "@/types/utils";
import { forceArray } from "@/utils";
import { blockComponents } from "../blocks/registry";
import styles from "./BlocksView.module.css";

type GetBlocksQueryBlock = NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>;

// Shared block boundaries keep spacing and width consistent across both areas.
export function blockWrapperClass(block: object): string {
  // Width is optional in the block union.
  const isWide = "width" in block && (block as { width?: string | null }).width === "wide";
  return isWide ? `${styles.block} ${styles.blockWide}` : styles.block;
}

const BlocksView = (props: PartProps<GetBlocksQueryBlock[]>) => {
  return <div className={styles.blocks}>{renderBlocks(props)}</div>;
};

export const renderBlocks = (props: Pick<PartProps<GetBlocksQueryBlock[]>, "data" | "meta">) => {
  return forceArray(props.data).map((data, index) => {
    // TypeScript cannot correlate the registry lookup with the block union.
    const Block = blockComponents[data.__typename] as
      | FunctionComponent<{ data: GetBlocksQueryBlock; meta: MetaData }>
      | undefined;

    if (!Block) return null;

    return (
      // Wrap fragments so spacing applies between blocks, not within them.
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
