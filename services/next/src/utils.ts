import type { RichTextData } from "@enonic/nextjs-adapter/types/component";

export function isRichTextData(value: unknown): value is RichTextData {
  return notNullOrUndefined((value as RichTextData)?.processedHtml);
}

export function forceArray<A>(data: A | Array<A> | undefined | null): Array<A>;
export function forceArray<A>(
  data: A | ReadonlyArray<A> | undefined | null,
): ReadonlyArray<A>;
export function forceArray<A>(
  data: A | Array<A> | undefined | null,
): ReadonlyArray<A> {
  data = data ?? [];
  return Array.isArray(data) ? data : [data];
}

export function notNullOrUndefined<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

export function stripOperationName(query: string): string {
  return query.replace(/^\s*(query|mutation|subscription)\s+\w+/, "$1");
}
