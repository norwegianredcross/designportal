// This query is executed for every page rendering.
// Result is included in props.common

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
