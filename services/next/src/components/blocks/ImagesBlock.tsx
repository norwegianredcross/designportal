import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { CSSProperties } from "react";
import type { BlockByTypename } from "@/types/blocks";
import { forceArray, notNullOrUndefined } from "@/utils";
import styles from "./ImagesBlock.module.css";
import { CORNER_TO_NOTCH, type NotchEdge, notchMaskDataUri } from "./notchMask";

type ImagesData = BlockByTypename<"no_rodekors_docs_BlockImages">;

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
  const items = forceArray(data.items)
    .filter(notNullOrUndefined)
    .filter((item) => item.imageUrl);
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
      {items.map((item, index) => {
        const notched = !gallery && effectiveShape === "notch";
        // Reserve the image's own aspect ratio (from the media metadata)
        // before the file loads; without both dimensions the browser sizes
        // it on arrival like before.
        const naturalRatio = item.width && item.height ? `${item.width} / ${item.height}` : undefined;
        const img = (
          <img
            src={item.imageUrl ?? undefined}
            alt={item.altText ?? ""}
            className={`${styles.image}${gallery ? ` ${styles.imageInGallery}` : ""}`}
            // Reserve the image's own aspect ratio (from the media metadata)
            // before the file loads; without both dimensions the browser sizes
            // it on arrival as before.
            style={naturalRatio ? ({ "--rk-image-aspect": naturalRatio } as CSSProperties) : undefined}
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
                src={item.imageUrl ?? undefined}
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
