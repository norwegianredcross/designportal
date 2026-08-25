import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { CopyButton } from "./CopyButton";

type CodeData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockCode" }
>;

interface CodeProps {
  data: CodeData;
  meta: MetaData;
}

/**
 * Docs-specific block (local mixin, not from lib-xp-item-blocks): a
 * copyable code snippet with an optional language tag, the same treatment
 * as the docs SPA's GuideCodeBlock. Rendered verbatim in a pre/code pair —
 * React escapes the text, so markup in code samples displays instead of
 * executing. No syntax highlighting yet; the language value only feeds the
 * small tag (a future highlighter can use it as-is).
 */
export function CodeBlock({ data }: CodeProps) {
  if (!data.code) return null;
  return (
    // Blocks stack as bare siblings and rely on their elements' own margins
    // for rhythm; the pre's UA margin is zeroed for the header join below,
    // so the wrapper carries the block's vertical spacing instead.
    <div style={{ marginBlock: "var(--ds-size-4)" }}>
      {/* Header bar attached on top of the panel: the controls used to be
          absolutely overlaid on the code, which collided with long
          single-line snippets. In their own bar they can never cover code,
          and the label field gets a visible home (it was aria-only). */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "var(--ds-size-4)",
          backgroundColor: "var(--ds-color-neutral-background-tinted)",
          border: "1px solid var(--ds-color-neutral-border-subtle)",
          borderRadius: "var(--ds-border-radius-lg) var(--ds-border-radius-lg) 0 0",
          padding: "var(--ds-size-2) var(--ds-size-4)",
        }}
      >
        <span
          style={{
            fontSize: "var(--ds-font-size-2)",
            fontWeight: "var(--ds-font-weight-medium)",
            // Let even unbreakable command-like labels wrap instead of
            // pushing the non-shrinking controls out of the bar.
            minWidth: 0,
            overflowWrap: "anywhere",
          }}
        >
          {data.label}
        </span>
        <div style={{ display: "flex", gap: "var(--ds-size-2)", alignItems: "center", flexShrink: 0 }}>
          {data.language ? (
            <span
              style={{
                fontSize: "var(--ds-font-size-1)",
                color: "var(--ds-color-neutral-text-subtle)",
              }}
            >
              {data.language}
            </span>
          ) : null}
          <CopyButton code={data.code} label={data.label} />
        </div>
      </div>
      {/* Cream panel via tokens — a code surface is not a design system
          component, so this is layout-glue styling like the cards grid.
          The top corners are square so the panel joins the header bar,
          whose bottom border doubles as the divider line between them. */}
      <pre
        style={{
          backgroundColor: "var(--ds-color-neutral-background-tinted)",
          border: "1px solid var(--ds-color-neutral-border-subtle)",
          borderTop: "none",
          borderRadius: "0 0 var(--ds-border-radius-lg) var(--ds-border-radius-lg)",
          margin: 0,
          padding: "var(--ds-size-4)",
          overflowX: "auto",
          fontSize: "var(--ds-font-size-2)",
        }}
      >
        <code>{data.code}</code>
      </pre>
    </div>
  );
}
