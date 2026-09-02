import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import { Avatar, Link, Paragraph } from "rk-designsystem";
import type { BlockByTypename } from "@/types/blocks";
import { isRichTextData } from "@/utils";

type QuoteData = BlockByTypename<"no_rodekors_docs_BlockQuote">;

/**
 * `image` is typed as the Content interface, so only its media_Image member carries a URL.
 * The query selects no __typename for it, so narrow on the field itself.
 */
function toImage(image: QuoteData["image"]) {
  return image && "imageUrl" in image && image.imageUrl ? image : null;
}

interface QuoteProps {
  data: QuoteData;
  meta: MetaData;
}

/**
 * The blokk_sitat design: quote text with the author's round portrait and
 * name underneath. The editor form comes from lib-xp-item-blocks
 * (blocks-quote); the image arrives as the media content itself, and this
 * view asks the query for the scales it wants (see getBlocks.ts).
 */
export function QuoteBlock({ data, meta }: QuoteProps) {
  const image = toImage(data.image);
  /* Density descriptors rather than widths: the Avatar renders at one fixed box whatever the
     viewport, so the only open question is the display's pixel ratio. Left off entirely when
     the 2x scale is missing, so the browser falls back to src rather than being handed a
     broken candidate. */
  const srcSet = image?.imageUrl && image.imageUrl2x ? `${image.imageUrl} 1x, ${image.imageUrl2x} 2x` : undefined;

  return (
    <figure>
      <blockquote>
        {isRichTextData(data.text) ? (
          <RichTextView className="rk-prose" data={data.text} meta={meta} renderMacroInEditMode={false} />
        ) : null}
      </blockquote>
      <figcaption>
        {image ? (
          <Avatar aria-label={data.author ?? ""} data-size="md">
            {/* Guillotine already scaled the image (square crop), so a plain
                img is enough — no next/image sizing needed. Alt is empty on
                purpose: the Avatar's aria-label already names the author. */}
            <img src={image.imageUrl ?? ""} srcSet={srcSet} alt="" />
          </Avatar>
        ) : null}
        {data.author ? <Paragraph data-size="sm">{data.author}</Paragraph> : null}
        {data.publicationUrl ? (
          <Link href={data.publicationUrl}>{data.publicationTitle ?? data.publicationUrl}</Link>
        ) : null}
      </figcaption>
    </figure>
  );
}
