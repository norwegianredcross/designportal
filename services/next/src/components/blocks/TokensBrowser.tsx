"use client";

import { useEffect, useId, useState } from "react";
import { Button, Heading, Paragraph, ToggleGroup } from "rk-designsystem";
import {
  CATEGORY_LABELS,
  CATEGORY_ORDER,
  type DesignToken,
  formatGroupName,
  groupTokens,
  readThemeTokens,
  type TokenCategory,
  type TokenGroup,
} from "./designTokens";
import styles from "./TokensBrowser.module.css";

/**
 * The interactive half of the token block. A client component because the
 * tokens are read from the document with getComputedStyle, which only
 * exists in a browser: on the server this renders a short placeholder, and
 * the effect below fills the list right after hydration. The category
 * toggle is the same idea as the old docs site's sidebar, with the
 * library's ToggleGroup so keyboard and focus behaviour come for free.
 */
export function TokensBrowser() {
  const [tokens, setTokens] = useState<DesignToken[] | null>(null);
  const [category, setCategory] = useState<TokenCategory>("colors");
  const headingId = useId();

  useEffect(() => {
    setTokens(readThemeTokens());
  }, []);

  if (tokens === null) {
    return <Paragraph className={styles.muted}>Leser tokens fra temaet …</Paragraph>;
  }

  const grouped = groupTokens(tokens);
  const categories = CATEGORY_ORDER.filter((c) => (grouped[c]?.length ?? 0) > 0);
  // A category can be empty in a stripped-down theme; fall back to the
  // first one that has tokens rather than showing nothing.
  const active = grouped[category] ? category : categories[0];
  const groups = active ? (grouped[active] ?? []) : [];

  return (
    <div className={styles.browser}>
      <ToggleGroup
        value={active}
        onChange={(value) => setCategory(value as TokenCategory)}
        aria-label="Tokenkategori"
        data-size="sm"
      >
        {categories.map((c) => (
          <ToggleGroup.Item key={c} value={c}>
            {CATEGORY_LABELS[c]}
          </ToggleGroup.Item>
        ))}
      </ToggleGroup>

      {active ? (
        <section aria-labelledby={headingId} className={styles.category}>
          <Heading level={3} data-size="sm" id={headingId}>
            {CATEGORY_LABELS[active]}
            <span className={styles.count}> · {tokens.filter((t) => t.category === active).length} tokens</span>
          </Heading>
          {groups.map((group) =>
            active === "colors" ? (
              <ColorGroup key={group.name} group={group} />
            ) : (
              <ValueGroup key={group.name} group={group} category={active} />
            ),
          )}
        </section>
      ) : null}
    </div>
  );
}

/** Colour scope as a swatch grid: the colour speaks for itself. The
 * group heading already says "--ds-color-<scope>", so each swatch shows only
 * the part that differs ("base-default", "text-subtle"); the full name is
 * in the title and is what the copy button copies. */
function ColorGroup({ group }: { group: TokenGroup }) {
  const prefix = `--ds-color-${group.name}-`;
  return (
    <div className={styles.group}>
      <Heading level={4} data-size="xs">
        {formatGroupName(group.name)}
        <code className={styles.groupPrefix}> {prefix}…</code>
      </Heading>
      <ul className={styles.swatches}>
        {group.tokens.map((token) => (
          <li key={token.name} className={styles.swatch}>
            <span
              className={styles.swatchColor}
              style={{ backgroundColor: token.value }}
              role="img"
              aria-label={`Fargeforhåndsvisning: ${token.value}`}
            />
            <code className={styles.name} title={token.name}>
              {token.name.startsWith(prefix) ? token.name.slice(prefix.length) : token.name}
            </code>
            <span className={styles.value}>{token.value}</span>
            <CopyTokenButton name={token.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Everything that is not a colour: a row per token with a preview that
 * fits the kind of value (a bar for sizes, a box for radii and shadows,
 * "Aa" for type). */
function ValueGroup({ group, category }: { group: TokenGroup; category: TokenCategory }) {
  return (
    <div className={styles.group}>
      <Heading level={4} data-size="xs">
        {formatGroupName(group.name)}
      </Heading>
      <ul className={styles.rows}>
        {group.tokens.map((token) => (
          <li key={token.name} className={styles.row}>
            <code className={styles.name} title={token.name}>
              {token.name}
            </code>
            <span className={styles.preview}>{preview(token, category)}</span>
            <code className={styles.value} title={token.value}>
              {token.value}
            </code>
            <CopyTokenButton name={token.name} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function preview(token: DesignToken, category: TokenCategory) {
  const { name, value } = token;
  switch (category) {
    case "sizes":
      return (
        <span className={styles.sizeTrack}>
          <span className={styles.sizeBar} style={{ width: value }} />
        </span>
      );
    case "borders":
      return name.includes("radius") ? (
        <span className={styles.radiusBox} style={{ borderRadius: value }} />
      ) : (
        <span className={styles.borderLine} style={{ borderTopWidth: value }} />
      );
    case "shadows":
      return <span className={styles.shadowBox} style={{ boxShadow: value }} />;
    case "effects":
      return name.includes("opacity") ? <span className={styles.opacityBox} style={{ opacity: value }} /> : null;
    case "typography":
      if (name.includes("weight")) return <span style={{ fontWeight: value }}>Aa</span>;
      if (name.includes("line-height")) return <span style={{ lineHeight: value }}>Aa</span>;
      if (name.includes("letter-spacing")) return <span style={{ letterSpacing: value }}>Aa</span>;
      if (name.includes("family")) return <span style={{ fontFamily: value }}>Aa</span>;
      // Everything else in the typography bucket is a size (--ds-font-size-*,
      // --ds-heading-*/--ds-body-* sizes).
      return <span style={{ fontSize: value }}>Aa</span>;
    default:
      return null;
  }
}

/** Copies the token NAME - that is what a developer pastes into CSS; the
 * value is already visible next to it. Same clipboard handling as the code
 * block's CopyButton: silently a no-op outside secure contexts. */
function CopyTokenButton({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="tertiary"
      data-size="sm"
      className={styles.copy}
      aria-label={copied ? `Kopierte ${name}` : `Kopier ${name}`}
      onClick={() => {
        navigator.clipboard?.writeText(name).then(
          () => {
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
          },
          () => undefined,
        );
      }}
    >
      {copied ? "Kopiert" : "Kopier"}
    </Button>
  );
}
