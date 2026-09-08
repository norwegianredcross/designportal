"use client";

import { ArrowRightIcon } from "@navikt/aksel-icons";
import { useId, useState } from "react";
import { Chip, Heading, Paragraph, Search } from "rk-designsystem";
import type { CatalogueEntry } from "@/server/designsystem-context";
import styles from "./ComponentsCatalogue.module.css";
import { COMPONENT_GROUPS, type ComponentGroup, componentGroup } from "./componentGroups";
import { componentIcons } from "./componentIcons";

interface ComponentsCatalogueProps {
  components: CatalogueEntry[];
  showSearch: boolean;
}

/**
 * The grid half of the catalogue: one tile per component linking to its
 * Storybook docs. This is a client component only because of the filter
 * state; the list itself is fetched by the server-side ComponentsBlock and
 * handed in as plain data, so the same grid renders in Storybook from a
 * fixture without any network.
 *
 * Two ways in: a search field for readers who know the name, and a row of
 * type chips for readers who know what they need ("a form control"). At
 * rest the grid is grouped under those types, so the page reads as a
 * catalogue rather than an alphabet; any filter flattens it to one grid.
 * The result count is a live region, announced as the filter changes.
 *
 * Whole tile is the link (one clickable surface, no nested interactive
 * elements), opening in a new tab because Storybook is a separate app the
 * reader will want to keep the docs open next to.
 */
export function ComponentsCatalogue({ components, showSearch }: ComponentsCatalogueProps) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<ComponentGroup | "alle">("alle");
  const countId = useId();
  const chipName = useId();

  const needle = query.trim().toLowerCase();
  const visible = components.filter(
    (c) => (!needle || c.name.toLowerCase().includes(needle)) && (group === "alle" || componentGroup(c.name) === group),
  );
  const filtered = Boolean(needle) || group !== "alle";
  const count = filtered ? `${visible.length} av ${components.length} komponenter` : `${components.length} komponenter`;

  // Only groups that have members, in the fixed order, so an empty "Annet"
  // never shows up as a chip or a heading.
  const groups = COMPONENT_GROUPS.filter((g) => components.some((c) => componentGroup(c.name) === g));

  return (
    <div className={styles.catalogue}>
      {showSearch ? (
        <div className={styles.toolbar}>
          <div className={styles.searchRow}>
            <Search className={styles.search} data-size="lg">
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
          {/* Chip.Radio is a native radio under the hood, so the row is a
              real single-choice group for keyboard and screen readers. */}
          <fieldset className={styles.chips}>
            <legend className={styles.srOnly}>Filtrer etter type</legend>
            <Chip.Radio name={chipName} value="alle" checked={group === "alle"} onChange={() => setGroup("alle")}>
              Alle
            </Chip.Radio>
            {groups.map((g) => (
              <Chip.Radio key={g} name={chipName} value={g} checked={group === g} onChange={() => setGroup(g)}>
                {g}
              </Chip.Radio>
            ))}
          </fieldset>
        </div>
      ) : null}

      {visible.length === 0 ? (
        <Paragraph className={styles.empty}>Ingen komponenter matcher «{query.trim()}».</Paragraph>
      ) : filtered || !showSearch ? (
        <Grid components={visible} />
      ) : (
        groups.map((g) => {
          const members = visible.filter((c) => componentGroup(c.name) === g);
          return (
            <section key={g} className={styles.group} aria-labelledby={`${chipName}-${g}`}>
              <Heading level={3} data-size="sm" id={`${chipName}-${g}`} className={styles.groupTitle}>
                {g}
                <span className={styles.groupCount}> · {members.length}</span>
              </Heading>
              <Grid components={members} />
            </section>
          );
        })
      )}
    </div>
  );
}

function Grid({ components }: { components: CatalogueEntry[] }) {
  return (
    // A list, so screen readers announce "list, 46 items" and can jump
    // between tiles; the grid is only presentation. The explicit role is
    // for Safari/VoiceOver, which drop list semantics from a list styled
    // without markers.
    // biome-ignore lint/a11y/noRedundantRoles: needed for WebKit
    <ul className={styles.grid} role="list">
      {components.map((component) => {
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
                <Heading level={4} data-size="xs" className={styles.name}>
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
  );
}
