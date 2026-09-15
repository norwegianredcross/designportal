import { stripOperationName } from "@/utils";

const getContentHeader = () =>
  stripOperationName(/* GraphQL */ `
query GetContentHeader($path:ID!) {
  guillotine {
    get(key:$path) {
      ... on no_rodekors_docs_Page {
        data {
          kicker
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
    layout: pageLayout(key:$path) { before { __typename } }
  }
}`);

export default getContentHeader;
