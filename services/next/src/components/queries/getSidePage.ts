import { stripOperationName } from "@/utils";
import { editorialBlocksFragment } from "./getEditorialBlocksFragment";

// Content header + blocks in one query: used by the Side content-type
// mapping, which renders the whole page from content data alone.
export default () =>
  editorialBlocksFragment +
  "\n" +
  stripOperationName(/* GraphQL */ `
    query GetSidePage($path:ID!) {
      guillotine {
        get(key:$path) {
          # _path identifies the current page in the sidebar (active state).
          _path
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
        # The sidebar IS the content tree, scoped to the SECTION you are
        # in: a section page (child of the site) lists its own children;
        # an article lists its siblings (the parent section's children).
        # Order follows the tree's childOrder (manual once editors sort);
        # unpublished pages never reach master. first:100 assumes a
        # section never has more pages than that.
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
          before { ...editorialBlocks }
          after { ...editorialBlocks }
        }
      }
    }`);
