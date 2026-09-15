import { stripOperationName } from "@/utils";
import { withEditorialBlocks } from "./getEditorialBlocksFragment";

// Data owned by the Standard page controller. Header and main blocks use part queries.
export default () =>
  withEditorialBlocks(
    stripOperationName(/* GraphQL */ `
    query GetPageDefault($path:ID!) {
      guillotine {
        get(key:$path) {
          # _path identifies the current page in the sidebar (active state).
          _path
        }
        # Section children or article siblings, in tree order (up to 100).
        nav: get(key:$path) {
          children(first:100) {
            displayName
            _path
            type
            ... on no_rodekors_docs_Page {
              data {
                kicker
              }
            }
          }
          parent {
            _path
            children(first:100) {
              displayName
              _path
              type
              ... on no_rodekors_docs_Page {
                data {
                  kicker
                }
              }
            }
          }
        }
        layout: pageLayout(key:$path) {
          kind
          title
          intro
          showSearch
          maxReleases
          after { ...editorialBlocks }
        }
      }
    }`),
    "page",
  );
