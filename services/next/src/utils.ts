import type { RichTextData } from "@enonic/nextjs-adapter/types/component";

export function isRichTextData(value: unknown): value is RichTextData {
  return notNullOrUndefined((value as RichTextData)?.processedHtml);
}

/**
 * Normalizes possibly-missing or single values to an array. Guillotine list
 * fields arrive as real arrays, so on this side the guard is mostly about
 * null/undefined and adapter prop shapes. (The XP side has its own copy for
 * the storage quirk where a single repeatable entry is a bare object.)
 */
export function forceArray<A>(data: A | Array<A> | undefined | null): Array<A>;
export function forceArray<A>(data: A | ReadonlyArray<A> | undefined | null): ReadonlyArray<A>;
export function forceArray<A>(data: A | Array<A> | undefined | null): ReadonlyArray<A> {
  data = data ?? [];
  return Array.isArray(data) ? data : [data];
}

export function notNullOrUndefined<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

/**
 * The adapter merges all registered queries into one request, and its
 * matcher only recognizes anonymous `query(...){guillotine{...}}` strings —
 * a named query is silently dropped from the merge. graphql-codegen needs
 * the name to type the query, so queries are written named and the name is
 * stripped from the string actually sent.
 */
export function stripOperationName(query: string): string {
  return query.replace(/^\s*(query|mutation|subscription)\s+\w+/, "$1");
}
