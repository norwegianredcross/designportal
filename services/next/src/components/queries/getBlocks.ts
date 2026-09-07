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
            image {
              _id
              ... on media_Image {
                imageUrl(scale: "square(96)", type: absolute)
                imageUrl2x: imageUrl(scale: "square(192)", type: absolute)
              }
            }
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
          # No richTextFragment here: the image block carries no rich text.
          ...on no_rodekors_docs_BlockImages {
            __typename
            # Editor choices (shadowed mixin): single-image size/alignment
            # and the corner-based notch, which the frontend turns into the
            # generated SVG mask with defaults and clamping.
            size
            alignment
            form
            notchCorner
            notchWidth
            notchDepth
            width
            items {
              image {
                _id
                ... on media_Image {
                  # 1x is the 1090px article column (globals.css); 2x covers
                  # retina. XP never upscales past the original, so a small
                  # source just serves the same file twice.
                  imageUrl(scale: "width(1090)", type: absolute)
                  imageUrl2x: imageUrl(scale: "width(2180)", type: absolute)
                  # Source pixel size, which XP's media-info extraction writes
                  # into x-data at upload. The view derives the aspect ratio
                  # from it and reserves space before the file loads (no CLS).
                  x {
                    media {
                      imageInfo {
                        imageWidth
                        imageHeight
                      }
                    }
                  }
                }
              }
              altText
              caption
            }
          }
          # Card links come pre-resolved from XP: url = external address
          # verbatim, contentPath = internal target's content path (mapped
          # into the frontend URL space by getUrl in the view).
          ...on no_rodekors_docs_BlockCards {
            __typename
            title
            # The section ingress and the "see more" link are app additions to
            # the lib's cards form (see the shadowing mixin in services/xp);
            # the link arrives pre-resolved as url XOR contentPath, like the
            # summary's.
            intro
            linkText
            url
            contentPath
            columns
            imagePlacement
            # "column" (default) or "wide" — see BlocksView, which owns how
            # much wider a wide row actually runs.
            width
            items {
              title
              kicker
              # Aliased: GraphQL requires same-named fields across union
              # members to have merging types, and accordion items already
              # claim "text" as RichText while a card's text is a plain
              # string.
              cardText: text
              image {
                _id
                ... on media_Image {
                  imageUrl(scale: "width(768)", type: absolute)
                  imageUrl2x: imageUrl(scale: "width(1536)", type: absolute)
                  # The card form has no alt field, so the image content's own
                  # alt text speaks for it; empty means decorative.
                  data {
                    altText
                  }
                }
              }
              theme
              url
              contentPath
            }
          }
          # The table block: markup from a table-only HtmlArea, styled by
          # the view; RichText so links inside cells resolve.
          ...on no_rodekors_docs_BlockTable {
            __typename
            title
            table(processHtml: {type: absolute}) {
              ...richTextFragment
            }
          }
          # Key figures with an optional pre-resolved link (see guillotine).
          # The landing hero. Actions arrive with their links pre-resolved
          # by XP (url XOR contentPath), same contract as the cards.
          ...on no_rodekors_docs_BlockHero {
            __typename
            badge
            badgeMeta
            kicker
            title
            lead
            # Optional photo; sized for the panel's picture column (about
            # half of the 1090px article column, 2x for retina).
            image {
              _id
              ... on media_Image {
                imageUrl(scale: "width(720)", type: absolute)
                imageUrl2x: imageUrl(scale: "width(1440)", type: absolute)
                data {
                  altText
                }
              }
            }
            actions {
              linkText
              url
              contentPath
            }
          }
          ...on no_rodekors_docs_BlockSummary {
            __typename
            title
            intro
            items {
              label
              value
              description
            }
            alignment
            width
            linkText
            url
            contentPath
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
          # Wording only; the component list is fetched from the library's
          # published manifest on the Next side (server/designsystem-context).
          ...on no_rodekors_docs_BlockComponents {
            __typename
            title
            intro
            showSearch
          }
          # Wording only; the tokens are read from the theme in the browser
          # (components/blocks/TokensBrowser).
          ...on no_rodekors_docs_BlockTokens {
            __typename
            title
            intro
          }
          # Wording and a limit; the releases are fetched from the library's
          # published CHANGELOG.md on the Next side (server/changelog).
          ...on no_rodekors_docs_BlockChangelog {
            __typename
            title
            intro
            maxReleases
          }
        }
      }
    }`);
