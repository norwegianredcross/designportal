import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { forceArray, notNullOrUndefined } from "@/utils";

type ImagesData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockImages" }
>;

interface ImagesProps {
  data: ImagesData;
  meta: MetaData;
}

/**
 * The blokk_bilde design: one or more images with alt text and optional
 * captions. Alt text is required in the editor form, so it is always
 * present in practice; the empty-string fallback only guards malformed
 * legacy data. Images come pre-scaled to article width from the XP side
 * (imageUrl scale in the query), so plain img tags are enough — no client
 * -side image machinery. The lib's "can be expanded" (lightbox) behavior
 * is a deliberate scope cut for now — static figures until the docs need
 * more.
 */
export function ImagesBlock({ data }: ImagesProps) {
  return (
    <>
      {forceArray(data.items)
        .filter(notNullOrUndefined)
        .filter((item) => item.imageUrl)
        .map((item, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: gallery order is stable
          <figure key={`image-${index}`}>
            {/* The URL is scaled to 768px; the style keeps it inside narrower
                viewports instead of overflowing on mobile. */}
            <img
              src={item.imageUrl ?? undefined}
              alt={item.altText ?? ""}
              style={{ maxWidth: "100%", height: "auto" }}
            />
            {item.caption ? <figcaption>{item.caption}</figcaption> : null}
          </figure>
        ))}
    </>
  );
}
