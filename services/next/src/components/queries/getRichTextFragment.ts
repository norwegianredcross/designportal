/**
 * Shared fragment for HtmlArea fields. Guillotine's RichText is more than a
 * string: processedHtml keeps working hrefs/srcs (resolved to real URLs by
 * processHtml) and ADDS data-link-ref/data-image-ref marker attributes; the
 * links/images arrays describe what each marker points to. The app's
 * RkRichTextView uses the markers to upgrade plain tags into componentized
 * links/images at render time — which is why rich text queries must select
 * this whole shape, not just processedHtml.
 */
export const richTextFragment = /* GraphQL */ `
  fragment richTextFragment on RichText {
    processedHtml
    links {
      ref
      uri
      content {
        _id
      }
      media {
        content {
          _id
          ... on media_Image {
            mediaUrl(type: absolute)
          }
        }
        intent
      }
    }
    images {
      ref
      image {
        _id
        ... on media_Image {
          imageUrl(scale: "width(768)", type:absolute)
        }
      }
      style {
        name
        aspectRatio
        filter
      }
    }
  }
`;
