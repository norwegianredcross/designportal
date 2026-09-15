import { stripOperationName } from "@/utils";
import { editorialBlocksFragment } from "./getEditorialBlocksFragment";

export default () =>
  editorialBlocksFragment +
  "\n" +
  stripOperationName(/* GraphQL */ `
  query GetBlocks($path: ID!) {
    guillotine {
      blocks(key: $path) { ...editorialBlocks }
    }
  }
`);
