import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { CSSProperties } from "react";
import { Heading } from "rk-designsystem";
import { Card, type CardImage, type CardPlacement, type CardSize } from "@/components/partials/Card";
import type { BlockByTypename } from "@/types/blocks";
import { forceArray, notNullOrUndefined } from "@/utils";
import styles from "./CardsBlock.module.css";

type CardsData = BlockByTypename<"no_rodekors_docs_BlockCards">;

type CardItem = NonNullable<NonNullable<CardsData["items"]>[number]>;

/**
 * `image` is typed as the Content interface, so only its media_Image member carries a URL.
 * The query selects no __typename for it, so narrow on the field itself.
 *
 * The card form has no alt field, so the alt comes off the image content — empty means the
 * editor left it blank, which reads as decorative.
 */
function toImage(image: CardItem["image"]): CardImage | null {
  if (!image || !("imageUrl" in image) || !image.imageUrl) return null;

  return {
    src: image.imageUrl,
    /* Density descriptors rather than widths: the card image box is capped in CSS, so the only
       open question is the display's pixel ratio. Left off when the 2x scale is missing. */
    srcSet: image.imageUrl2x ? `${image.imageUrl} 1x, ${image.imageUrl2x} 2x` : undefined,
    alt: image.data?.altText ?? "",
  };
}

/** The editor picks a column count; the Figma spec names three card sizes.
 * One track is the full-width "stor", two are "medium", and anything denser
 * is "liten". */
function toSize(columns: number): CardSize {
  if (columns === 1) return "stor";
  if (columns === 2) return "medium";
  return "liten";
}

interface CardsProps {
  data: CardsData;
  meta: MetaData;
}

/**
 * The cardsblokk: a heading and a grid of cards, with the editor's column
 * choice deciding both how many fit per row and which of the three Figma card
 * sizes they render at.
 *
 * This view owns everything ABOUT THE SET — the grid, the per-card link, and
 * turning stored CMS values into finished strings. Drawing a single card is
 * components/partials/Card.
 */
export function CardsBlock({ data, meta }: CardsProps) {
  const items = forceArray(data.items).filter(notNullOrUndefined);
  const columns = data.columns ?? 3;
  const size = toSize(columns);
  // The editor's image placement (top/bottom stacks it, left/right sets it
  // beside the text) with the Figma default per size: liten stacks the image
  // on top, stor/medium put it beside the text.
  const placement = (data.imagePlacement as CardPlacement | null | undefined) ?? (size === "liten" ? "top" : "left");

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
          const image = toImage(item.image);
          const card = (
            // The key belongs on the wrapping <a>/<div> below — that is what
            // actually lands in the iterable; this element is only held in a
            // variable until then. (The directive has to be the line directly
            // above the node, so the reason goes here rather than after it.)
            // biome-ignore lint/correctness/useJsxKeyInIterable: key is on the wrapper
            <Card
              title={item.title}
              kicker={item.kicker}
              text={item.cardText}
              image={image}
              theme={item.theme}
              size={size}
              placement={placement}
            />
          );
          // The image's alt counts as text: an aria-label here would OVERRIDE
          // it in the link's accessible name.
          const hasText = Boolean(item.title || item.kicker || item.cardText || image?.alt);
          return href ? (
            <a
              // biome-ignore lint/suspicious/noArrayIndexKey: card order is stable
              key={`card-${index}`}
              href={href}
              // The whole surface is the link (module class resets the anchor
              // styling and adds the hover lift). A text-less image card would
              // otherwise be a nameless link, hence the fallback.
              // TODO(i18n): hardcoded Norwegian, same situation as CopyButton.
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
