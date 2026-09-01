import type { GetBlocksQuery } from "./queries";
import type { ExtractByTypename, Get } from "./utils";

/** Every block the blocks query can return, as one union. */
export type Block = NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>;

/**
 * A single block's data, by its GraphQL `__typename`.
 *
 * Use this instead of writing `Extract<…, { __typename: "…" }>` in each block
 * component: see ExtractByTypename for why plain `Extract` can silently
 * resolve to `never`.
 */
export type BlockByTypename<Names extends string> = ExtractByTypename<Block, Names>;
