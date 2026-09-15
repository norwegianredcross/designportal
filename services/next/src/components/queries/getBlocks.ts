import { stripOperationName } from "@/utils";
import { withEditorialBlocks } from "./getEditorialBlocksFragment";

export default () =>
  withEditorialBlocks(
    stripOperationName(/* GraphQL */ `
  query GetBlocks($path: ID!) {
    guillotine {
      blocks(key: $path) { ...editorialBlocks }
    }
  }
`),
    "blocks",
  );
