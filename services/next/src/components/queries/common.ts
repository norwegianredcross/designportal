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
    # Header navigation: the pages editors ticked "Show in main menu" on,
    # in the site's childOrder. Same "/docs" <-> ENONIC_MAPPINGS coupling
    # as the sidebar query in getSidePage.
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
