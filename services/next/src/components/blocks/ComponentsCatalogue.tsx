"use client";

import { ArrowRightIcon } from "@navikt/aksel-icons";
import { useId, useState } from "react";
import { Heading, Paragraph, Search } from "rk-designsystem";
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
 *
 * The filter is the library's own Search field (input + clear button), and
 * the result count next to it is a live region, so a screen-reader user
 * hears "3 av 46 komponenter" as they type instead of guessing whether the
 * grid changed.
 */
export function ComponentsCatalogue({ components, showSearch }: ComponentsCatalogueProps) {
  const [query, setQuery] = useState("");
  const countId = useId();
  const needle = query.trim().toLowerCase();
  const visible = needle ? components.filter((c) => c.name.toLowerCase().includes(needle)) : components;
  const count = needle ? `${visible.length} av ${components.length} komponenter` : `${components.length} komponenter`;

  return (
    <div className={styles.catalogue}>
      {showSearch ? (
        <div className={styles.toolbar}>
          <Search className={styles.search} data-size="md">
            <Search.Input
              aria-label="Søk etter komponent"
              aria-describedby={countId}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Søk etter komponent, f.eks. Button"
            />
            <Search.ClearButton onClick={() => setQuery("")} />
          </Search>
          <Paragraph data-size="sm" id={countId} className={styles.count} role="status">
            {count}
          </Paragraph>
        </div>
      ) : null}

      {visible.length > 0 ? (
        // A list, so screen readers announce "list, 46 items" and can jump
        // between tiles; the grid is only presentation. The explicit role is
        // for Safari/VoiceOver, which drop list semantics from a list styled
        // without markers.
        // biome-ignore lint/a11y/noRedundantRoles: needed for WebKit
        <ul className={styles.grid} role="list">
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
