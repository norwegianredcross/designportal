import { Heading, Link, Paragraph } from "rk-designsystem";
import { designsystemContextUrl, fetchCatalogue } from "@/server/designsystem-context";
import { ComponentsCatalogue } from "./ComponentsCatalogue";
import styles from "./ComponentsCatalogue.module.css";
import type { GeneratedSectionSettings } from "./types";

/** Fixed generated section; the page owns its placement and editorial regions. */
export async function ComponentsSection({ data }: { data: GeneratedSectionSettings }) {
  const catalogue = await fetchCatalogue();
  // The CheckBox's default is "checked", but content saved before the field
  // existed has no value at all - treat missing as on, matching the form.
  const showSearch = data.showSearch ?? true;

  return (
    <section className={styles.section}>
      {data.title ? (
        <Heading level={2} data-size="md">
          {data.title}
        </Heading>
      ) : null}
      {data.intro ? <Paragraph>{data.intro}</Paragraph> : null}
      {catalogue ? (
        <ComponentsCatalogue components={catalogue.components} showSearch={showSearch} />
      ) : (
        <Paragraph>
          Komponentlisten kunne ikke hentes akkurat nå. Alle komponentene er dokumentert i{" "}
          <Link href={designsystemContextUrl} target="_blank" rel="noreferrer">
            Storybook
          </Link>
          .
        </Paragraph>
      )}
    </section>
  );
}
