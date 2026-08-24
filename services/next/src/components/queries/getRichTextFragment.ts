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
