import { richTextFragment } from "./getRichTextFragment";

// Keep GraphQL comments out of this fragment: the adapter extracts fragments
// with a character whitelist that does not include #. Both page regions and
// the blocks part use this selection so their block contracts stay identical.
export const editorialBlocksFragment =
  richTextFragment +
  /* GraphQL */ `
fragment editorialBlocks on no_rodekors_docs_Block {
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
          ...on no_rodekors_docs_BlockImages {
            __typename
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
                  imageUrl(scale: "width(1090)", type: absolute)
                  imageUrl2x: imageUrl(scale: "width(2180)", type: absolute)
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
          ...on no_rodekors_docs_BlockCards {
            __typename
            title
            intro
            linkText
            url
            contentPath
            columns
            imagePlacement
            width
            items {
              title
              kicker
              cardText: text
              image {
                _id
                ... on media_Image {
                  imageUrl(scale: "width(768)", type: absolute)
                  imageUrl2x: imageUrl(scale: "width(1536)", type: absolute)
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
          ...on no_rodekors_docs_BlockTable {
            __typename
            title
            table(processHtml: {type: absolute}) {
              ...richTextFragment
            }
          }
          ...on no_rodekors_docs_BlockHero {
            __typename
            badge
            badgeMeta
            kicker
            title
            lead
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
          ...on no_rodekors_docs_BlockCode {
            __typename
            code
            language
            label
          }
          ...on no_rodekors_docs_BlockDemo {
            __typename
            demo
            title
          }

}
`;

// Scope fragment names because the adapter concatenates queries without deduplication.
// Codegen reads the original shared names above.
export function withEditorialBlocks(query: string, scope: "page" | "blocks") {
  return `${editorialBlocksFragment}\n${query}`.replace(/\b(richTextFragment|editorialBlocks)\b/g, `$1_${scope}`);
}
