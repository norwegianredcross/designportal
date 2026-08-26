import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Heading, Link, Paragraph } from "rk-designsystem";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { forceArray, notNullOrUndefined } from "@/utils";

type SummaryData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockSummary" }
>;

interface SummaryProps {
  data: SummaryData;
  meta: MetaData;
}

/**
 * The BLOKK_OPPSUMMERING pattern: title and intro over a row of key
 * figures — small label, display-scale value, quiet description — with an
 * optional "see more" link bottom-right (the same tertiary link-with-arrow
 * the cardsblokk sheet uses). Values are editor-formatted strings, so
 * "40 %", "120+" and "4,2" all render verbatim.
 */
export function SummaryBlock({ data, meta }: SummaryProps) {
  // value is required in the form; the extra filter guards malformed data
  // so no empty figure slot can render.
  const items = forceArray(data.items)
    .filter(notNullOrUndefined)
    .filter((item) => item.value);
  if (items.length === 0) return null;
  // Exactly one of url/contentPath is set (or neither); internal paths are
  // mapped into this app's URL space, same as the cards.
  const href = data.url ?? (data.contentPath ? getUrl(data.contentPath, meta) : undefined);
  return (
    <section style={{ marginBlock: "var(--ds-size-10)" }}>
      {data.title ? (
        <Heading
          level={2}
          data-size="sm"
          // Tight above the intro; the siblings' full gap when the intro
          // is absent and the figures follow directly.
          style={{ marginBottom: data.intro ? "var(--ds-size-2)" : "var(--ds-size-5)" }}
        >
          {data.title}
        </Heading>
      ) : null}
      {data.intro ? (
        <Paragraph data-size="md" style={{ margin: "0 0 var(--ds-size-6)" }}>
          {data.intro}
        </Paragraph>
      ) : null}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--ds-size-10)",
          // The editor's alignment: figures parked left (default),
          // centered, or spread across the full row width. Unknown values
          // fall back to left.
          justifyContent:
            data.alignment === "center" ? "center" : data.alignment === "spread" ? "space-between" : "flex-start",
        }}
      >
        {items.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: figure order is stable
          <div key={`figure-${index}`} style={{ minWidth: "8rem" }}>
            {item.label ? (
              // Same uppercase micro-label treatment as the cards' kicker.
              <Paragraph
                data-size="xs"
                style={{ textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 var(--ds-size-1)" }}
              >
                {item.label}
              </Paragraph>
            ) : null}
            {/* The figure itself: display scale, maroon via the global
                heading token rule's palette (explicit token here since a
                number is not a heading element). */}
            <div
              style={{
                fontSize: "var(--ds-font-size-9)",
                fontWeight: "var(--ds-font-weight-medium)",
                // Raw value: the line-height token scale (sm/md/lg) has no
                // display-tight step for big standalone figures.
                lineHeight: 1.1,
                color: "var(--ds-color-text-default)",
              }}
            >
              {item.value}
            </div>
            {item.description ? (
              <Paragraph
                data-size="sm"
                style={{ margin: "var(--ds-size-1) 0 0", color: "var(--ds-color-neutral-text-subtle)" }}
              >
                {item.description}
              </Paragraph>
            ) : null}
          </div>
        ))}
      </div>
      {data.linkText && href ? (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "var(--ds-size-6)" }}>
          <Link href={href} style={{ display: "inline-flex", alignItems: "center", gap: "var(--ds-size-1)" }}>
            {data.linkText}
            {/* The wireframe's arrow; decorative, the text carries meaning. */}
            <ArrowRightIcon aria-hidden />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
