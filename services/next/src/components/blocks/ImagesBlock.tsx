import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { CSSProperties } from "react";
import type { BlockByTypename } from "@/types/blocks";
import { forceArray, notNullOrUndefined } from "@/utils";
import styles from "./ImagesBlock.module.css";
import { CORNER_TO_NOTCH, type NotchEdge, notchMaskDataUri } from "./notchMask";

type ImagesData = BlockByTypename<"no_rodekors_docs_BlockImages">;

type ImagesItem = NonNullable<NonNullable<ImagesData["items"]>[number]>;

/**
 * `image` is typed as the Content interface, so only its media_Image member carries a URL.
 * The query selects no __typename for it, so narrow on the field itself.
 */
function toImage(image: ImagesItem["image"]) {
  return image && "imageUrl" in image && image.imageUrl ? image : null;
}

type Image = NonNullable<ReturnType<typeof toImage>>;

/**
 * The source dimensions, which XP stores as strings in the media:imageInfo x-data and leaves out
 * entirely for images uploaded before it existed. The view only wants the RATIO, to reserve
 * layout space before the file loads; unreadable metadata just means no reservation.
 */
function toDimensions(image: Image) {
  const info = "x" in image ? image.x?.media?.imageInfo : null;
  const width = Number(info?.imageWidth);
  const height = Number(info?.imageHeight);

  if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return null;

  return { width, height };
}

interface ImagesProps {
  data: ImagesData;
  meta: MetaData;
  /**
   * Width of a single bildeblokk image relative to the article column —
   * the Design retning pages run heroes anywhere from full-bleed to about
   * half the measure. Defaults to medium with a height cap so a lone image
   * accompanies the article instead of dominating it; "full" is the
   * explicit hero choice. Galleries always fill the column.
   */
  size?: "full" | "medium" | "small";
  /** Which side of the column a below-full-width single image parks on.
   * Neighboring blocks do NOT wrap around it — blocks stack. */
  alignment?: "left" | "right";
  /**
   * Image silhouette for single images: plain rounded corners, or the
   * Design retning's notched step form. Galleries keep plain rounded
   * tiles. These props are code-level DEFAULTS — fields the editor sets in
   * Content Studio (stored on the block) override them.
   */
  shape?: "rounded" | "notch";
  /**
   * Geometry of the notched form, for composing the many variants the
   * Design retning uses: which edge the bite cuts into, where along that
   * edge it sits (0-100), its width/depth as percentages, and the image
   * box's aspect ratio. Ignored unless shape is "notch".
   */
  notch?: { edge?: NotchEdge; offset?: number; width?: number; depth?: number; aspect?: string };
}

/**
 * The BLOKK_BILDE pattern from the blokk-templates Figma (node 0:4457),
 * which draws two shapes:
 *   one image   -> "bildeblokk":    a single full-width rounded image
 *   two or more -> "bildegalleri":  a two-column grid of uniform images
 * The single image keeps its natural aspect (editorial photos shouldn't be
 * force-cropped when they stand alone); gallery images are cropped to the
 * spec's ~2:1 tiles so the grid stays tidy regardless of what editors
 * upload. Corner radius matches the cardsblokk panels (--ds-border-radius-lg)
 * so imagery and cards share one shape language.
 *
 * Alt text is required in the editor form, so it is always present in
 * practice; the empty-string fallback only guards malformed legacy data.
 * The lib's "can be expanded" (lightbox) behavior remains a deliberate
 * scope cut — static figures until the docs need more.
 */
const SIZE_WIDTH = { full: "100%", medium: "60%", small: "40%" } as const;

export function ImagesBlock({ data, size = "medium", alignment = "left", shape = "rounded", notch }: ImagesProps) {
  // Pair each entry with its narrowed media_Image up front, so the render
  // below never has to re-narrow and entries without a usable image drop out.
  const items = forceArray(data.items)
    .filter(notNullOrUndefined)
    .map((item) => {
      const image = toImage(item.image);
      return image ? { item, image } : null;
    })
    .filter(notNullOrUndefined);
  if (items.length === 0) return null;
  const gallery = items.length > 1;
  // Content Studio wins over code: the shadowed mixin's fields (size,
  // alignment, form, notchCorner/Width/Depth) override the component
  // props, which act as defaults for Storybook and any hardcoded usage.
  const effectiveShape = (data.form as "rounded" | "notch" | null | undefined) ?? shape;
  const effectiveSize = (data.size as "full" | "medium" | "small" | null | undefined) ?? size;
  const effectiveAlignment = (data.alignment as "left" | "right" | null | undefined) ?? alignment;
  // The editor picks a corner; code props may still use the generator's
  // raw edge/offset. A corner from the CMS wins over both.
  const cornerNotch = data.notchCorner ? CORNER_TO_NOTCH[data.notchCorner] : undefined;
  const effectiveNotch = {
    edge: cornerNotch?.edge ?? notch?.edge ?? "bottom",
    offset: cornerNotch?.offset ?? notch?.offset ?? 100,
    width: data.notchWidth ?? notch?.width ?? 35,
    depth: data.notchDepth ?? notch?.depth ?? 28,
    aspect: notch?.aspect ?? "4 / 3",
  };
  return (
    <div className={`${styles.wrapper}${gallery ? ` ${styles.gallery}` : ""}`}>
      {items.map(({ item, image }, index) => {
        const notched = !gallery && effectiveShape === "notch";
        // Reserve the image's own aspect ratio (from the media metadata)
        // before the file loads; without readable dimensions the browser
        // sizes it on arrival like before.
        // Named dimensions, not `size` — that is already the component's
        // width prop, and shadowing it here would be a trap for the next edit.
        const dimensions = toDimensions(image);
        const naturalRatio = dimensions ? `${dimensions.width} / ${dimensions.height}` : undefined;
        /* Density descriptors rather than widths: the 1x scale already matches the article
           column, so the only open question is the display's pixel ratio. Left off entirely
           when the 2x scale is missing, so the browser falls back to src. */
        const srcSet = image.imageUrl2x ? `${image.imageUrl} 1x, ${image.imageUrl2x} 2x` : undefined;
        /* A lone image whose dimensions we know can have its WIDTH capped so the natural
           height lands on the height cap — see .imageFits. Gallery tiles are excluded: their
           2:1 crop is the point, it is what keeps the grid even. Without readable dimensions
           there is nothing to compute from, so the old height cap still crops. */
        const fits = !gallery && dimensions;
        const img = (
          <img
            src={image.imageUrl ?? undefined}
            srcSet={srcSet}
            alt={item.altText ?? ""}
            className={`${styles.image}${gallery ? ` ${styles.imageInGallery}` : ""}${
              fits ? ` ${styles.imageFits}` : ""
            }`}
            style={
              dimensions
                ? ({
                    "--rk-image-aspect": naturalRatio,
                    // The two numbers separately as well, because the width cap has to divide
                    // them and calc() cannot take them apart again once they are one token.
                    "--rk-image-w": dimensions.width,
                    "--rk-image-h": dimensions.height,
                  } as CSSProperties)
                : undefined
            }
          />
        );
        return (
          <figure
            // biome-ignore lint/suspicious/noArrayIndexKey: gallery order is stable
            key={`image-${index}`}
            className={`${styles.figure}${gallery ? ` ${styles.figureInGallery}` : ""}${
              !gallery && effectiveAlignment === "right" ? ` ${styles.figureRight}` : ""
            }`}
            style={
              gallery
                ? undefined
                : ({ "--rk-image-width": SIZE_WIDTH[effectiveSize] ?? SIZE_WIDTH.medium } as CSSProperties)
            }
          >
            {notched ? (
              // The notched silhouette: one image masked by a generated
              // SVG path (see notchMask.ts). The mask's viewBox matches
              // the aspect ratio set here, so the geometry never distorts.
              <img
                src={image.imageUrl ?? undefined}
                srcSet={srcSet}
                alt={item.altText ?? ""}
                className={styles.imageNotched}
                style={
                  {
                    "--rk-notch-aspect": effectiveNotch.aspect,
                    "--rk-notch-mask": notchMaskDataUri(effectiveNotch),
                  } as CSSProperties
                }
              />
            ) : (
              img
            )}
            {item.caption ? <figcaption className={styles.caption}>{item.caption}</figcaption> : null}
          </figure>
        );
      })}
    </div>
  );
}
