import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { CSSProperties } from "react";
import { Heading, Paragraph } from "rk-designsystem";
import type { BlockByTypename } from "@/types/blocks";
import { forceArray, notNullOrUndefined } from "@/utils";
import styles from "./CardsBlock.module.css";

type CardsData = BlockByTypename<"no_rodekors_docs_BlockCards">;

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
    <section>
      {data.title ? (
        <Heading level={2} data-size="sm" className={styles.title}>
          {data.title}
        </Heading>
      ) : null}
      <div className={styles.grid} style={{ "--card-columns": columns } as CSSProperties}>
        {items.map((item, index) => {
          // Exactly one of url/contentPath is set (or neither, for "none");
          // internal contentPaths are mapped into this app's URL space.
          const href = item.url ?? (item.contentPath ? getUrl(item.contentPath, meta) : undefined);
          const card = (
            // The key belongs on the wrapping <a>/<div> below — that is what
            // actually lands in the iterable; this element is only held in a
            // variable until then. (The directive has to be the line directly
            // above the node, so the reason goes here rather than after it.)
            // biome-ignore lint/correctness/useJsxKeyInIterable: key is on the wrapper
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
            <div key={`card-${index}`} className={styles.cell}>
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
  // Per-card theme from the editor's theme selector, applied as a
  // data-color SCOPE (same mechanism as faktaboks/trekkspill): inside it
  // the generic tokens resolve to the theme's palette, so the surface AND
  // the text follow the editor's choice — redaktøren mixes freely per
  // card. Unknown theme ids (the list lives in deploy config, not the
  // schema) don't match a scope and inherit the page's palette, with the
  // neutral tint as the background fallback.
  const scope = item.theme ?? "neutral";
  // Stor (1 column) uses the roomier 40px padding/gap from the Figma spec;
  // medium/liten use 20px.
  const pad = columns === 1 ? "var(--ds-size-10)" : "var(--ds-size-5)";
  // The one value the module cannot know: it depends on the editor's column
  // choice. Everything else about the panel lives in CardsBlock.module.css.
  const padVar = { "--card-pad": pad } as CSSProperties;

  const text = (
    <div className={styles.text}>
      {item.kicker ? (
        // The "stikktittel": uppercase micro-heading. The 0.05em tracking is
        // a raw value on purpose — the token scale has no uppercase-tracking
        // step (it tops out at 0.015em), and untracked uppercase reads
        // cramped.
        <Paragraph data-size="xs" className={styles.kicker}>
          {item.kicker}
        </Paragraph>
      ) : null}
      {item.title ? (
        // No explicit color: the global heading rule uses the generic text
        // token, which resolves inside this card's data-color scope — the
        // title's tone follows the editor's theme choice by itself.
        <Heading level={3} data-size="xs" className={styles.cardTitle}>
          {item.title}
        </Heading>
      ) : null}
      {item.cardText ? (
        <Paragraph data-size="md" className={styles.cardText}>
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
        className={`${styles.topImage}${reverse ? ` ${styles.topImageReverse}` : ""}`}
      />
    );
    const panel = (
      <div data-color={scope} className={`${styles.panel}${reverse ? ` ${styles.panelReverse}` : ""}`} style={padVar}>
        {text}
      </div>
    );
    return (
      <div className={styles.stack}>
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
        className={`${reverse ? styles.rowReverse : styles.row} ${styles.sidePanel}`}
        data-color={scope}
        style={padVar}
      >
        <img src={item.imageUrl} alt={item.imageAlt ?? ""} className={styles.sideImage} style={imageVars} />
        {text}
      </div>
    );
  }

  // Uten bilde: plain tinted panel, all corners rounded.
  return (
    <div data-color={scope} className={styles.plainPanel} style={padVar}>
      {text}
    </div>
  );
}
