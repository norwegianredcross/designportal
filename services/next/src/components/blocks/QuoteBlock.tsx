import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import { Avatar, Link, Paragraph } from "rk-designsystem";
import type { BlockByTypename } from "@/types/blocks";
import { isRichTextData } from "@/utils";

type QuoteData = BlockByTypename<"no_rodekors_docs_BlockQuote">;

interface QuoteProps {
  data: QuoteData;
  meta: MetaData;
}

/**
 * The blokk_sitat design: quote text with the author's round portrait and
 * name underneath. The editor form comes from lib-xp-item-blocks
 * (blocks-quote); the image arrives as a ready-made URL because the XP side
 * resolves the ImageSelector id server-side (see guillotine.ts imageUrl).
 */
export function QuoteBlock({ data, meta }: QuoteProps) {
  return (
    <figure>
      <blockquote>
        {isRichTextData(data.text) ? (
          <RichTextView className="rk-prose" data={data.text} meta={meta} renderMacroInEditMode={false} />
        ) : null}
      </blockquote>
      <figcaption>
        {data.imageUrl ? (
          <Avatar aria-label={data.author ?? ""} data-size="md">
            {/* Guillotine already scaled the image (square crop), so a plain
                img is enough — no next/image sizing needed. */}
            <img src={data.imageUrl} alt="" />
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
