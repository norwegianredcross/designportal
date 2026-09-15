// Executed for every page render regardless of which view wins; the result
// is handed to all views as props.common. Keep it minimal — everything here
// is paid for on every single request.

import { stripOperationName } from "@/utils";

export const commonQuery = stripOperationName(/* GraphQL */ `
query Common($path:ID!){
  guillotine {
    get(key:$path) {
      displayName
      type
    }
    # Menu pages in tree order; /docs matches ENONIC_MAPPINGS.
    menu: get(key:"/docs") {
      children(first:100) {
        displayName
        _path
        type
        ... on no_rodekors_docs_Page {
          data {
            showInMenu
          }
        }
      }
    }
  }
}`);

export function commonVariables(path: string) {
  return {
    path,
  };
}
