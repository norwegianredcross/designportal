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
  }
}`);

export function commonVariables(path: string) {
  return {
    path,
  };
}
