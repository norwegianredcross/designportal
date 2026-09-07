import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { Heading, Link, Paragraph } from "rk-designsystem";
import { designsystemContextUrl, fetchCatalogue } from "@/server/designsystem-context";
import type { BlockByTypename } from "@/types/blocks";
import { ComponentsCatalogue } from "./ComponentsCatalogue";
import styles from "./ComponentsCatalogue.module.css";

type ComponentsData = BlockByTypename<"no_rodekors_docs_BlockComponents">;

interface ComponentsProps {
  data: ComponentsData;
  meta: MetaData;
}

/**
 * Docs-specific block: the component catalogue. An async SERVER component -
 * it fetches the library's published manifest (see server/designsystem-context)
 * and hands the resulting list to the client-side grid. Editors only own the
 * title, intro and whether the search field shows; the list is never content.
 *
 * When the manifest can't be fetched the block degrades to a sentence with a
 * link to Storybook rather than failing the page: the rest of the article
 * is still worth rendering.
 */
export async function ComponentsBlock({ data }: ComponentsProps) {
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
