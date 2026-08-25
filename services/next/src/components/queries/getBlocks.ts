import { richTextFragment } from "@/components/queries/getRichTextFragment";
import { stripOperationName } from "@/utils";

export default () =>
  richTextFragment +
  "\n" +
  stripOperationName(/* GraphQL */ `
    query GetBlocks($path:ID!) {
      guillotine {
        # blocks(key) is our own flattened field (defined in the XP app's
        # guillotine.ts), not standard Guillotine. One inline fragment per
        # union member; each must select every field its React view reads —
        # anything not selected here arrives as undefined in the component.
        blocks(key:$path) {
          ...on no_rodekors_docs_BlockText {
            __typename
            title
            text(processHtml: {type: absolute}) {
              ...richTextFragment
            }
          }
          ...on no_rodekors_docs_BlockAccordion {
            __typename
            title
            theme
            items {
              title
              text(processHtml: {type: absolute}) {
                ...richTextFragment
              }
            }
          }
          ...on no_rodekors_docs_BlockQuote {
            __typename
            text(processHtml: {type: absolute}) {
              ...richTextFragment
            }
            author
            imageUrl(scale: "square(96)")
            publicationTitle
            publicationUrl
          }
          ...on no_rodekors_docs_BlockFactbox {
            __typename
            title
            text(processHtml: {type: absolute}) {
              ...richTextFragment
            }
            theme
          }
          # No richTextFragment here: image fields are plain strings, and the
          # imageUrl arrives pre-scaled from the XP side: 2x the 1090px
          # article column (globals.css), so full-width images stay sharp on
          # retina displays. XP never upscales past the original, so small
          # sources are unaffected.
          ...on no_rodekors_docs_BlockImages {
            __typename
            # Editor-chosen silhouette (shadowed mixin): the frontend turns
            # these into the generated SVG mask, with defaults and clamping.
            form
            notchEdge
            notchOffset
            notchWidth
            notchDepth
            items {
              imageUrl(scale: "width(2180)")
              altText
              caption
              # Original pixel size — the view derives the aspect ratio and
              # reserves space before the file loads (no layout shift).
              width
              height
            }
          }
          # Card links come pre-resolved from XP: url = external address
          # verbatim, contentPath = internal target's content path (mapped
          # into the frontend URL space by getUrl in the view).
          ...on no_rodekors_docs_BlockCards {
            __typename
            title
            columns
            imagePlacement
            items {
              title
              kicker
              # Aliased: GraphQL requires same-named fields across union
              # members to have merging types, and accordion items already
              # claim "text" as RichText while a card's text is a plain
              # string.
              cardText: text
              imageUrl(scale: "width(768)")
              # Alt from the image CONTENT (the card form has no alt field).
              imageAlt
              theme
              url
              contentPath
            }
          }
          # Plain strings only — code is rendered verbatim, never as HTML.
          ...on no_rodekors_docs_BlockCode {
            __typename
            code
            language
            label
          }
          # The demo id maps into the frontend's curated registry
          # (components/blocks/demos.tsx); unknown ids render nothing.
          ...on no_rodekors_docs_BlockDemo {
            __typename
            demo
            title
          }
        }
      }
    }`);
