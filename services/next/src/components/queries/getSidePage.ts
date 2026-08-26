import { richTextFragment } from "@/components/queries/getRichTextFragment";
import { stripOperationName } from "@/utils";

// Content header + blocks in one query: used by the Side content-type
// mapping, which renders the whole page from content data alone.
export default () =>
  richTextFragment +
  "\n" +
  stripOperationName(/* GraphQL */ `
    query GetSidePage($path:ID!) {
      guillotine {
        get(key:$path) {
          ... on no_rodekors_docs_Page {
            data {
              title
              intro {
                processedHtml
                links {
                  ref
                  uri
                }
              }
            }
          }
        }
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
          # The hero/split block: text column beside an image. Link and
          # notch fields arrive pre-resolved from XP (see guillotine.ts);
          # the image is scaled for the mobile full-width stack at retina
          # density (the desktop half-column needs less).
          ...on no_rodekors_docs_BlockTextImage {
            __typename
            kicker
            title
            text(processHtml: {type: absolute}) {
              ...richTextFragment
            }
            buttonText
            url
            contentPath
            imageUrl(scale: "width(1536)")
            altText
            imagePlacement
            form
            notchCorner
            notchWidth
            notchDepth
            theme
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
