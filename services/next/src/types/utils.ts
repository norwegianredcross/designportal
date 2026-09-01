import type { PartData } from "@enonic/nextjs-adapter/types/component";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";

type Unwrap<T> = NonNullable<T> extends ReadonlyArray<infer U> ? NonNullable<U> : NonNullable<T>;

export type Get<T, P extends string> = NonNullable<
  P extends `${infer K}.${infer Rest}`
    ? K extends keyof Unwrap<T>
      ? Get<Unwrap<T>[K], Rest>
      : never
    : P extends keyof Unwrap<T>
      ? Unwrap<Unwrap<T>[P]>
      : never
>;

/**
 * Like `Extract`, but matches a union member when its `__typename` OVERLAPS
 * `Names` rather than being wholly contained by it.
 *
 * Codegen collapses blocks whose selection sets are identical into a single
 * union member carrying every typename it stands for — e.g. a member typed
 * `__typename: "…BlockText" | "…BlockTextHighlighted"`. Plain `Extract` then
 * rejects that member for either name on its own and silently yields `never`,
 * so the block's props become `never` and every field access on them is an
 * error with no obvious cause. Two blocks in this app selecting the same
 * fields is all it takes.
 *
 * Borrowed from the rk.no CMS (CMS100002-webpage), where the same collapse
 * bit first.
 */
export type ExtractByTypename<T, Names extends string> = T extends { __typename: infer N }
  ? [Extract<N, Names>] extends [never]
    ? never
    : T
  : never;

export interface PartProps<Data = any> {
  part: PartData;
  path: string;
  data?: Data;
  common?: any;
  meta: MetaData;
}
