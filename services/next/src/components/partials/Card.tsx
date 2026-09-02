import type { CSSProperties } from "react";
import { Heading, Paragraph } from "rk-designsystem";
import styles from "./Card.module.css";

export type CardImage = { src: string; srcSet?: string; alt: string };

/** The three Figma card sizes. Named after the spec rather than the editor's
 * column count, because the column count is a property of the GRID — a card
 * asked to render itself has no business knowing how many siblings it has. */
export type CardSize = "stor" | "medium" | "liten";

/** Where the picture sits relative to the text, in the editor's own
 * vocabulary. top/bottom stack it; left/right set it beside the text. */
export type CardPlacement = "top" | "bottom" | "left" | "right";

export type CardProps = {
  title?: string | null;
  kicker?: string | null;
  text?: string | null;
  image?: CardImage | null;
  /** Palette scope id from the editor's theme selector. */
  theme?: string | null;
  size?: CardSize;
  placement?: CardPlacement;
};

/**
 * One card in the cardsblokk design from the RK blokk-templates Figma (nodes
 * 197:1301, 314:46911, 316:54846): a tinted panel with rounded corners, an
 * optional picture, an uppercase kicker ("stikktittel"), a title and a short
 * text. Three sizes —
 *   stor:   full-width horizontal card, roomy 40px padding, 16:9 image
 *   medium: half-width horizontal card, 20px padding, smaller 4:3 image
 *   liten:  vertical card, image on top of the panel
 *
 * Deliberately knows nothing about where its content came from: callers hand
 * it finished strings and a finished image, so the same card works for a
 * content block, a listing, or anything else that needs one. It also draws no
 * link — a caller that wants the card to lead somewhere wraps it, which keeps
 * one clickable surface instead of a link nested inside a link.
 *
 * The design is NOT the library's Card component (different padding, radii
 * and typography), so the panel is built from tokens directly, the same way
 * CodeBlock builds its code surface. The Figma px values map onto tokens:
 * 20px spacing/radius -> --ds-size-5 / --ds-border-radius-lg, 40px ->
 * --ds-size-10, 14/18/24px type -> Paragraph xs / Paragraph md / Heading xs.
 */
export function Card({ title, kicker, text, image, theme, size = "liten", placement = "top" }: CardProps) {
  // Per-card theme applied as a data-color SCOPE (same mechanism as
  // faktaboks/trekkspill): inside it the generic tokens resolve to the theme's
  // palette, so the surface AND the text follow the editor's choice —
  // redaktøren mixes freely per card. Unknown theme ids (the list lives in
  // deploy config, not the schema) don't match a scope and inherit the page's
  // palette, with the neutral tint as the background fallback.
  const scope = theme ?? "neutral";
  const vertical = placement === "top" || placement === "bottom";
  // "Reverse" is the mirrored half of each pair: the picture after the text
  // rather than before it.
  const reverse = placement === "bottom" || placement === "right";
  // Stor uses the roomier 40px padding/gap from the Figma spec; the smaller
  // two use 20px. This is the one value the module cannot know on its own.
  const padVar = { "--card-pad": size === "stor" ? "var(--ds-size-10)" : "var(--ds-size-5)" } as CSSProperties;

  const body = (
    <div className={styles.text}>
      {kicker ? (
        <Paragraph data-size="xs" className={styles.kicker}>
          {kicker}
        </Paragraph>
      ) : null}
      {title ? (
        // No explicit color: the global heading rule uses the generic text
        // token, which resolves inside this card's data-color scope — the
        // title's tone follows the editor's theme choice by itself.
        <Heading level={3} data-size="xs" className={styles.cardTitle}>
          {title}
        </Heading>
      ) : null}
      {text ? (
        <Paragraph data-size="md" className={styles.cardText}>
          {text}
        </Paragraph>
      ) : null}
    </div>
  );

  if (vertical && image) {
    // Liten med bilde: the image sits ON TOP of the panel (rounded top corners
    // on the image, rounded bottom corners on the text panel), not inside it —
    // per the Figma masks, which are plain rounded rectangles.
    const imageEl = (
      <img
        src={image.src}
        srcSet={image.srcSet}
        alt={image.alt}
        className={`${styles.topImage}${reverse ? ` ${styles.topImageReverse}` : ""}`}
      />
    );
    const panel = (
      <div data-color={scope} className={`${styles.panel}${reverse ? ` ${styles.panelReverse}` : ""}`} style={padVar}>
        {body}
      </div>
    );
    return (
      <div className={styles.stack}>
        {reverse ? panel : imageEl}
        {reverse ? imageEl : panel}
      </div>
    );
  }

  if (image) {
    // Stor/medium med bilde: one tinted panel, image beside the text. The
    // Figma spec rounds only the stor image's top corners and leaves medium
    // square — inside a padded panel that reads as a rendering bug, so both
    // sizes get a uniform small radius on all corners instead.
    // Direction and the image's box live in the CSS module so the mobile media
    // query can restack them; the size-driven values travel as custom
    // properties.
    const imageVars = {
      "--card-image-width": size === "stor" ? "min(320px, 35%)" : "min(160px, 35%)",
      "--card-image-ratio": size === "stor" ? "16 / 9" : "4 / 3",
    } as CSSProperties;
    return (
      <div
        className={`${reverse ? styles.rowReverse : styles.row} ${styles.sidePanel}`}
        data-color={scope}
        style={padVar}
      >
        <img src={image.src} srcSet={image.srcSet} alt={image.alt} className={styles.sideImage} style={imageVars} />
        {body}
      </div>
    );
  }

  // Uten bilde: plain tinted panel, all corners rounded.
  return (
    <div data-color={scope} className={styles.plainPanel} style={padVar}>
      {body}
    </div>
  );
}
