"use client";

import { ArrowRightIcon } from "@navikt/aksel-icons";
import { useId, useState } from "react";
import { Field, Heading, Input, Label, Paragraph } from "rk-designsystem";
import type { CatalogueEntry } from "@/server/designsystem-context";
import styles from "./ComponentsCatalogue.module.css";
import { componentIcons } from "./componentIcons";

interface ComponentsCatalogueProps {
  components: CatalogueEntry[];
  showSearch: boolean;
}

/**
 * The grid half of the catalogue: one tile per component linking to its
 * Storybook docs, with an optional name filter. This is a client component
 * only because of the filter's state; the list itself is fetched by the
 * server-side ComponentsBlock and handed in as plain data, so the same grid
 * renders in Storybook from a fixture without any network.
 *
 * Whole tile is the link (one clickable surface, no nested interactive
 * elements), opening in a new tab because Storybook is a separate app the
 * reader will want to keep the docs open next to.
 */
export function ComponentsCatalogue({ components, showSearch }: ComponentsCatalogueProps) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const needle = query.trim().toLowerCase();
  const visible = needle ? components.filter((c) => c.name.toLowerCase().includes(needle)) : components;

  return (
    <div className={styles.catalogue}>
      {showSearch ? (
        <Field className={styles.search}>
          <Label htmlFor={inputId}>Søk etter komponent</Label>
          <Input
            id={inputId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="For eksempel Button"
          />
        </Field>
      ) : null}

      {visible.length > 0 ? (
        // A list, so screen readers announce "list, 46 items" and can jump
        // between tiles; the grid is only presentation.
        <ul className={styles.grid}>
          {visible.map((component) => {
            const icon = componentIcons[component.name];
            return (
              <li key={component.name}>
                <a href={component.docsUrl} target="_blank" rel="noreferrer" className={styles.tile}>
                  <span className={styles.media}>
                    {icon ? (
                      // Decorative: the name next to it is the accessible label.
                      <img src={`/components/${icon}`} alt="" className={styles.icon} loading="lazy" />
                    ) : (
                      <span className={styles.placeholder} aria-hidden="true" />
                    )}
                  </span>
                  <span className={styles.body}>
                    <Heading level={3} data-size="xs" className={styles.name}>
                      {component.name}
                    </Heading>
                    <span className={styles.action}>
                      Åpne i Storybook
                      <ArrowRightIcon aria-hidden="true" fontSize="1.25em" />
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <Paragraph className={styles.empty} role="status">
          Ingen komponenter matcher «{query.trim()}».
        </Paragraph>
      )}
    </div>
  );
}
