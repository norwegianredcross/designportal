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

/**
 * Storybook derives a docs page id from the story title: "Components/Button"
 * becomes `components-button--docs`. Its sanitiser lower-cases the title and
 * turns every run of characters outside a-z 0-9 into a single "-", so
 * "ToggleGroup" is `components-togglegroup`. Every library component's
 * stories carry the "Components/<Name>" title, which is what makes the link
 * predictable without asking Storybook. The replace below mirrors that
 * sanitiser so a future name with a dot or space still lands right.
 */
export function storybookDocsUrl(storybookUrl: string, componentName: string): string {
  const id = componentName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${storybookUrl}/?path=/docs/components-${id}--docs`;
}
