import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { CSSProperties } from "react";
import { Heading, Paragraph } from "rk-designsystem";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { forceArray, notNullOrUndefined } from "@/utils";
import styles from "./CardsBlock.module.css";

type CardsData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockCards" }
>;

type CardItem = NonNullable<NonNullable<CardsData["items"]>[number]>;

interface CardsProps {
  data: CardsData;
  meta: MetaData;
}

/**
 * The cardsblokk design from the RK blokk-templates Figma (nodes 197:1301,
 * 314:46911, 316:54846): tinted panels with rounded corners whose layout
 * follows the editor's column choice —
 *   1 column  -> "stor":   full-width horizontal card, image left 16:9
 *   2 columns -> "medium": half-width horizontal card, smaller 4:3 image
 *   3 columns -> "liten":  vertical card, image on top of the panel
 * Text hierarchy per card: uppercase kicker ("stikktittel"), medium-weight
 * title, plain description. The Figma spec has no hover/underline treatment
 * — a linked card is one calm clickable surface, so the wrapping <a> resets
 * link color/underline and the title renders like a title, not a link.
 *
 * The design is NOT the library's Card component (different padding, radii
 * and typography), so the panel is built from tokens directly, the same way
 * CodeBlock builds its code surface. The Figma px values map onto tokens:
 * 20px spacing/radius -> --ds-size-5 / --ds-border-radius-lg, 40px ->
 * --ds-size-10, 14/18/24px type -> Paragraph xs / Paragraph md / Heading xs.
 */
export function CardsBlock({ data, meta }: CardsProps) {
  const items = forceArray(data.items).filter(notNullOrUndefined);
  const columns = data.columns ?? 3;
  // The editor's image placement (top/bottom = vertical card, left/right =
  // horizontal) with the Figma default per size: liten stacks the image on
  // top, stor/medium put it beside the text.
  const placement = data.imagePlacement ?? (columns === 3 ? "top" : "left");
  const vertical = placement === "top" || placement === "bottom";
  return (
    <section style={{ marginBlock: "var(--ds-size-10)" }}>
      {data.title ? (
        <Heading level={2} data-size="sm" style={{ marginBottom: "var(--ds-size-5)" }}>
          {data.title}
        </Heading>
      ) : null}
      <div
        style={{
          display: "grid",
          // Exactly `columns` tracks when they fit: the minimum is each
          // track's exact share of the row (gaps subtracted, so the math
          // adds up), and the minimum floor collapses the count on narrow
          // screens instead of overflowing. auto-fill (not -fit) keeps the
          // empty tracks, so two cards in a 3-column block stay card-sized
          // instead of stretching to fill the row.
          gridTemplateColumns: `repeat(auto-fill, minmax(max(240px, calc((100% - ${columns - 1} * var(--ds-size-5)) / ${columns})), 1fr))`,
          gap: "var(--ds-size-5)",
        }}
      >
        {items.map((item, index) => {
          // Exactly one of url/contentPath is set (or neither, for "none");
          // internal contentPaths are mapped into this app's URL space.
          const href = item.url ?? (item.contentPath ? getUrl(item.contentPath, meta) : undefined);
          const card = (
            <Card
              item={item}
              columns={columns}
              vertical={vertical}
              reverse={placement === "bottom" || placement === "right"}
            />
          );
          // imageAlt counts as text: an aria-label here would OVERRIDE the
          // image's alt in the link's accessible name.
          const hasText = Boolean(item.title || item.kicker || item.cardText || item.imageAlt);
          return href ? (
            <a
              // biome-ignore lint/suspicious/noArrayIndexKey: card order is stable
              key={`card-${index}`}
              href={href}
              // The whole surface is the link (module class resets the
              // anchor styling and adds the hover lift). A text-less image
              // card would otherwise be a nameless link, hence the
              // fallback. TODO(i18n): hardcoded Norwegian, same situation
              // as CopyButton.
              aria-label={hasText ? undefined : "Les mer"}
              className={styles.cardLink}
            >
              {card}
            </a>
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: card order is stable
            <div key={`card-${index}`} style={{ height: "100%" }}>
              {card}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Card({
  item,
  columns,
  vertical,
  reverse,
}: {
  item: CardItem;
  columns: number;
  vertical: boolean;
  reverse: boolean;
}) {
  // Per-card theme from the editor's theme selector; every theme has a
  // background-tinted token, and neutral is the Figma default (lys beige).
  // Unknown theme ids (the list lives in deploy config, not the schema) fall
  // back to the neutral surface instead of a transparent card.
  const surface = `var(--ds-color-${item.theme ?? "neutral"}-background-tinted, var(--ds-color-neutral-background-tinted))`;
  const radius = "var(--ds-border-radius-lg)";
  // Stor (1 column) uses the roomier 40px padding/gap from the Figma spec;
  // medium/liten use 20px.
  const pad = columns === 1 ? "var(--ds-size-10)" : "var(--ds-size-5)";

  const text = (
    <div style={{ display: "flex", flexDirection: "column", flex: "1 1 0", minWidth: 0 }}>
      {item.kicker ? (
        // The "stikktittel": uppercase micro-heading. The 0.05em tracking is
        // a raw value on purpose — the token scale has no uppercase-tracking
        // step (it tops out at 0.015em), and untracked uppercase reads
        // cramped.
        <Paragraph data-size="xs" style={{ textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
          {item.kicker}
        </Paragraph>
      ) : null}
      {item.title ? (
        <Heading level={3} data-size="xs" style={{ margin: 0 }}>
          {item.title}
        </Heading>
      ) : null}
      {item.cardText ? (
        <Paragraph data-size="md" style={{ margin: 0 }}>
          {item.cardText}
        </Paragraph>
      ) : null}
    </div>
  );

  if (vertical && item.imageUrl) {
    // Liten med bilde: the image sits ON TOP of the panel (rounded top
    // corners on the image, rounded bottom corners on the text panel), not
    // inside it — per the Figma masks, which are plain rounded rectangles.
    const image = (
      <img
        // Alt from the image content itself; empty (decorative) when the
        // editor gave the media no alt text.
        src={item.imageUrl}
        alt={item.imageAlt ?? ""}
        style={{
          width: "100%",
          aspectRatio: "16 / 9",
          objectFit: "cover",
          display: "block",
          borderRadius: reverse ? `0 0 ${radius} ${radius}` : `${radius} ${radius} 0 0`,
        }}
      />
    );
    const panel = (
      <div
        style={{
          backgroundColor: surface,
          padding: pad,
          // The spec's extra 40px sits on the panel edge FACING AWAY from
          // the image, so it mirrors when the image moves below the text.
          paddingTop: reverse ? "var(--ds-size-10)" : pad,
          paddingBottom: reverse ? pad : "var(--ds-size-10)",
          borderRadius: reverse ? `${radius} ${radius} 0 0` : `0 0 ${radius} ${radius}`,
          flexGrow: 1,
        }}
      >
        {text}
      </div>
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {reverse ? panel : image}
        {reverse ? image : panel}
      </div>
    );
  }

  if (!vertical && item.imageUrl) {
    // Stor/medium med bilde: one tinted panel, image beside the text. The
    // Figma spec rounds only the stor image's top corners and leaves medium
    // square — inside a padded panel that reads as a rendering bug, so both
    // sizes get a uniform small radius on all corners instead.
    // Direction and the image's box live in the CSS module so the mobile
    // media query can restack them; the data-driven sizes travel through
    // custom properties.
    const imageVars = {
      "--card-image-width": columns === 1 ? "min(320px, 35%)" : "min(160px, 35%)",
      "--card-image-ratio": columns === 1 ? "16 / 9" : "4 / 3",
    } as CSSProperties;
    return (
      <div
        className={reverse ? styles.rowReverse : styles.row}
        style={{ backgroundColor: surface, borderRadius: radius, padding: pad, gap: pad }}
      >
        <img src={item.imageUrl} alt={item.imageAlt ?? ""} className={styles.sideImage} style={imageVars} />
        {text}
      </div>
    );
  }

  // Uten bilde: plain tinted panel, all corners rounded.
  return <div style={{ backgroundColor: surface, borderRadius: radius, padding: pad, height: "100%" }}>{text}</div>;
}
