import { nonNullable } from "next/dist/lib/non-nullable";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get, PartProps } from "@/types/utils";
import { forceArray } from "@/utils";
import { blockComponents } from "../blocks/registry";

type GetBlocksQueryBlock = NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>;

const BlocksView = (props: PartProps<GetBlocksQueryBlock[]>) => {
  return forceArray(props.data).map((data, index) => {
    const Block = blockComponents[data.__typename];

    if (!Block) return null;

    // biome-ignore lint/suspicious/noArrayIndexKey: This will not be re-ordered, so allow index in key
    return <Block key={`block-${index}`} data={data} meta={props.meta} />;
  });
};

export default BlocksView;

export async function blocksProcessor(data: GetBlocksQuery["guillotine"]): Promise<GetBlocksQueryBlock[]> {
  return forceArray(data?.blocks).filter(nonNullable);
}
