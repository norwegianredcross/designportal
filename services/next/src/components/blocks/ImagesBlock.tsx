import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { CSSProperties } from "react";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { forceArray, notNullOrUndefined } from "@/utils";
import { type NotchEdge, notchMaskDataUri } from "./notchMask";

type ImagesData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockImages" }
>;

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

export function ImagesBlock({ data, size = "medium", shape = "rounded", notch }: ImagesProps) {
  const items = forceArray(data.items)
    .filter(notNullOrUndefined)
    .filter((item) => item.imageUrl);
  if (items.length === 0) return null;
  const gallery = items.length > 1;
  // Content Studio wins over code: the shadowed mixin's fields (form,
  // notchEdge/Offset/Width/Depth) override the component props, which act
  // as defaults for Storybook and any hardcoded usage.
  const effectiveShape = (data.form as "rounded" | "notch" | null | undefined) ?? shape;
  const effectiveNotch = {
    edge: (data.notchEdge as NotchEdge | null | undefined) ?? notch?.edge ?? "bottom",
    offset: data.notchOffset ?? notch?.offset ?? 100,
    width: data.notchWidth ?? notch?.width ?? 35,
    depth: data.notchDepth ?? notch?.depth ?? 28,
    aspect: notch?.aspect ?? "4 / 3",
  };
  return (
    <div
      style={{
        // Same vertical rhythm as the cards block: the figures' browser
        // margins are zeroed below, so the wrapper carries the spacing.
        marginBlock: "var(--ds-size-10)",
        display: "grid",
        // Two tracks that share the row exactly (gap subtracted); the 240px
        // floor collapses the gallery to one column on narrow screens. A
        // single image spans the one track it gets.
        gridTemplateColumns: gallery
          ? "repeat(auto-fill, minmax(max(240px, calc((100% - var(--ds-size-5)) / 2)), 1fr))"
          : "1fr",
        gap: "var(--ds-size-5)",
      }}
    >
      {items.map((item, index) => {
        const notched = !gallery && effectiveShape === "notch";
        const img = (
          <img
            src={item.imageUrl ?? undefined}
            alt={item.altText ?? ""}
            style={
              notched
                ? undefined
                : {
                    width: "100%",
                    // Gallery tiles are uniform ~2:1 crops per the Figma
                    // sheet. A lone image keeps its natural shape up to a
                    // height cap — beyond it, cover-cropping keeps the
                    // column tidy instead of towering over the article.
                    // TODO: the lone image still has no reserved height
                    // below the cap (the GraphQL fragment exposes no
                    // dimensions), so the article can shift when it loads.
                    // Fixing CLS properly means resolving width/height on
                    // the XP side first.
                    aspectRatio: gallery ? "2 / 1" : undefined,
                    // cover in BOTH modes: gallery tiles crop to 2:1, and a
                    // capped single image crops instead of squashing when
                    // the height cap kicks in before its natural height.
                    objectFit: "cover",
                    height: gallery ? undefined : "auto",
                    maxHeight: gallery ? undefined : "32rem",
                    display: "block",
                    borderRadius: "var(--ds-border-radius-lg)",
                  }
            }
          />
        );
        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: gallery order is stable
          <figure key={`image-${index}`} style={{ margin: 0, width: gallery ? undefined : SIZE_WIDTH[size] }}>
            {notched ? (
              // The notched silhouette: one image masked by a generated
              // SVG path (see notchMask.ts). The mask's viewBox matches
              // the aspect ratio set here, so the geometry never distorts.
              <img
                src={item.imageUrl ?? undefined}
                alt={item.altText ?? ""}
                style={
                  {
                    width: "100%",
                    aspectRatio: effectiveNotch.aspect,
                    objectFit: "cover",
                    display: "block",
                    maskImage: notchMaskDataUri(effectiveNotch),
                    maskSize: "100% 100%",
                  } as CSSProperties
                }
              />
            ) : (
              img
            )}
            {item.caption ? (
              <figcaption
                style={{
                  fontSize: "var(--ds-font-size-2)",
                  color: "var(--ds-color-neutral-text-subtle)",
                  marginTop: "var(--ds-size-2)",
                  // Unbroken strings (URLs in captions) wrap instead of
                  // escaping the tile.
                  overflowWrap: "break-word",
                }}
              >
                {item.caption}
              </figcaption>
            ) : null}
          </figure>
        );
      })}
    </div>
  );
}
