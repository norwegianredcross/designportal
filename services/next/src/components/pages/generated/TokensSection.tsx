import { Heading, Paragraph } from "rk-designsystem";
import { TokensBrowser } from "./TokensBrowser";
import styles from "./TokensSection.module.css";
import type { GeneratedSectionSettings } from "./types";

/** Fixed generated section; the page owns its placement and editorial regions. */
export function TokensSection({ data }: { data: GeneratedSectionSettings }) {
  return (
    <section className={styles.section}>
      {data.title ? (
        <Heading level={2} data-size="md">
          {data.title}
        </Heading>
      ) : null}
      {data.intro ? <Paragraph>{data.intro}</Paragraph> : null}
      <TokensBrowser />
    </section>
  );
}
