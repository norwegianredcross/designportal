import { stripOperationName } from "@/utils";

const getContentHeader = () =>
  stripOperationName(/* GraphQL */ `
query GetContentHeader($path:ID!) {
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
  }
}`);

export default getContentHeader;
