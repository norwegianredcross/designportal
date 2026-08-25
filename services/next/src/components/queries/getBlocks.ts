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
