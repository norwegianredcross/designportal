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
    <div style={{ position: "relative" }}>
      {/* Cream panel via tokens — a code surface is not a design system
          component, so this is layout-glue styling like the cards grid. */}
      <pre
        style={{
          backgroundColor: "var(--ds-color-neutral-background-tinted)",
          border: "1px solid var(--ds-color-neutral-border-subtle)",
          borderRadius: "var(--ds-border-radius-lg)",
          padding: "var(--ds-size-4)",
          overflowX: "auto",
          fontSize: "var(--ds-font-size-2)",
        }}
      >
        <code>{data.code}</code>
      </pre>
      <div
        style={{
          position: "absolute",
          top: "var(--ds-size-2)",
          right: "var(--ds-size-2)",
          display: "flex",
          gap: "var(--ds-size-2)",
          alignItems: "center",
        }}
      >
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
  );
}
