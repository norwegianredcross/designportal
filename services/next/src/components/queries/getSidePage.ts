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
          # imageUrl arrives pre-scaled from the XP side (article width).
          ...on no_rodekors_docs_BlockImages {
            __typename
            items {
              imageUrl(scale: "width(768)")
              altText
              caption
            }
          }
        }
      }
    }`);
