import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { nonNullable } from "next/dist/lib/non-nullable";
import type { FunctionComponent } from "react";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get, PartProps } from "@/types/utils";
import { forceArray } from "@/utils";
import { blockComponents } from "../blocks/registry";

type GetBlocksQueryBlock = NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>;

const BlocksView = (props: PartProps<GetBlocksQueryBlock[]>) => {
  return forceArray(props.data).map((data, index) => {
    // The registry is correlated per typename, but TypeScript cannot narrow the
    // lookup and the block union together, so widen to the union the
    // components collectively accept.
    const Block = blockComponents[data.__typename] as
      | FunctionComponent<{ data: GetBlocksQueryBlock; meta: MetaData }>
      | undefined;

    if (!Block) return null;

    // biome-ignore lint/suspicious/noArrayIndexKey: This will not be re-ordered, so allow index in key
    return <Block key={`block-${index}`} data={data} meta={props.meta} />;
  });
};

export default BlocksView;

export async function blocksProcessor(data: GetBlocksQuery["guillotine"]): Promise<GetBlocksQueryBlock[]> {
  return forceArray(data?.blocks).filter(nonNullable);
}
