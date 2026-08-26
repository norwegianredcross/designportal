import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import type { CSSProperties } from "react";
import { Button, Heading, Paragraph } from "rk-designsystem";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { isRichTextData } from "@/utils";
import { type NotchEdge, notchMaskDataUri } from "./notchMask";
import styles from "./TextImageBlock.module.css";

type TextImageData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockTextImage" }
>;

interface TextImageProps {
  data: TextImageData;
  meta: MetaData;
}

/**
 * Maps the editor's corner choice onto the mask generator's edge+offset
 * model: a corner is just a bite flush against one end of a horizontal
 * edge. The generator's full generality (any edge, any offset) stays
 * available to code; the editor sees only the four corners.
 */
const CORNER_TO_NOTCH: Record<string, { edge: NotchEdge; offset: number }> = {
  "bottom-right": { edge: "bottom", offset: 100 },
  "bottom-left": { edge: "bottom", offset: 0 },
  "top-right": { edge: "top", offset: 100 },
  "top-left": { edge: "top", offset: 0 },
};

/**
 * The hero/split composition from the Design retning Figma: kicker, title,
 * rich text and an optional CTA button beside an image that can carry the
 * notched silhouette. An editor-chosen theme wraps the whole block in a
 * tinted panel; without one the composition sits directly on the page.
 */
export function TextImageBlock({ data, meta }: TextImageProps) {
  // Exactly one of url/contentPath is set (or neither); internal paths are
  // mapped into this app's URL space, same as the cards.
  const href = data.url ?? (data.contentPath ? getUrl(data.contentPath, meta) : undefined);
  const corner = CORNER_TO_NOTCH[data.notchCorner ?? "bottom-right"] ?? CORNER_TO_NOTCH["bottom-right"];
  const image = data.imageUrl ? (
    <img
      src={data.imageUrl}
      alt={data.altText ?? ""}
      style={{
        width: "100%",
        aspectRatio: "4 / 3",
        objectFit: "cover",
        display: "block",
        ...(data.form === "notch"
          ? {
              maskImage: notchMaskDataUri({
                ...corner,
                width: data.notchWidth ?? 35,
                depth: data.notchDepth ?? 28,
                aspect: "4 / 3",
              }),
              maskSize: "100% 100%",
            }
          : { borderRadius: "var(--ds-border-radius-lg)" }),
      }}
    />
  ) : null;
  return (
    <section
      style={{
        marginBlock: "var(--ds-size-10)",
        // A theme turns the block into a tinted panel (unknown ids fall
        // back to neutral); without one it renders unwrapped.
        ...(data.theme
          ? ({
              backgroundColor: `var(--ds-color-${data.theme}-background-tinted, var(--ds-color-neutral-background-tinted))`,
              borderRadius: "var(--ds-border-radius-lg)",
              padding: "var(--ds-size-10)",
            } as CSSProperties)
          : {}),
      }}
    >
      <div className={data.imagePlacement === "left" ? styles.rowReverse : styles.row}>
        <div className={styles.column}>
          {data.kicker ? (
            // Same stikktittel treatment as the cards: uppercase with the
            // tracking the token scale doesn't offer a step for.
            <Paragraph data-size="xs" style={{ textTransform: "uppercase", letterSpacing: "0.05em", margin: 0 }}>
              {data.kicker}
            </Paragraph>
          ) : null}
          {data.title ? (
            <Heading level={2} data-size="md" style={{ marginBlock: "0 var(--ds-size-4)" }}>
              {data.title}
            </Heading>
          ) : null}
          {isRichTextData(data.text) ? (
            <RichTextView data={data.text} meta={meta} renderMacroInEditMode={false} />
          ) : null}
          {data.buttonText && href ? (
            // asChild renders the Button AS the anchor — a real link with
            // the design system's button surface, no client JS needed.
            <Button
              asChild
              data-color="primary-color-red"
              // fit-content: as a block-level flex child the anchor would
              // otherwise stretch to the full column width.
              style={{ marginTop: "var(--ds-size-4)", width: "fit-content" }}
            >
              <a href={href}>{data.buttonText}</a>
            </Button>
          ) : null}
        </div>
        {/* A deleted media leaves imageUrl null: drop the column entirely
            so the text takes the full width instead of hugging a void. */}
        {image ? <div className={styles.column}>{image}</div> : null}
      </div>
    </section>
  );
}
