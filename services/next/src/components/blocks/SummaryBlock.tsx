import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Heading, Link, Paragraph } from "rk-designsystem";
import type { BlockByTypename } from "@/types/blocks";
import { forceArray, notNullOrUndefined } from "@/utils";
import styles from "./SummaryBlock.module.css";

type SummaryData = BlockByTypename<"no_rodekors_docs_BlockSummary">;

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
    <section>
      {data.title ? (
        <Heading level={2} data-size="sm" className={data.intro ? styles.titleWithIntro : styles.title}>
          {data.title}
        </Heading>
      ) : null}
      {data.intro ? (
        <Paragraph data-size="md" className={styles.intro}>
          {data.intro}
        </Paragraph>
      ) : null}
      <div
        className={`${styles.figures}${
          data.alignment === "center"
            ? ` ${styles.figuresCenter}`
            : data.alignment === "spread"
              ? ` ${styles.figuresSpread}`
              : ""
        }`}
      >
        {items.map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: figure order is stable
          <div key={`figure-${index}`} className={styles.figure}>
            {item.label ? (
              // Same uppercase micro-label treatment as the cards' kicker.
              <Paragraph data-size="xs" className={styles.label}>
                {item.label}
              </Paragraph>
            ) : null}
            <div className={styles.value}>{item.value}</div>
            {item.description ? (
              <Paragraph data-size="sm" className={styles.description}>
                {item.description}
              </Paragraph>
            ) : null}
          </div>
        ))}
      </div>
      {data.linkText && href ? (
        <div className={styles.linkRow}>
          <Link href={href} className={styles.link}>
            {data.linkText}
            {/* The wireframe's arrow; decorative, the text carries meaning. */}
            <ArrowRightIcon aria-hidden />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
