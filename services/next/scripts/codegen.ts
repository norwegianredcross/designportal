import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "schema.graphql",
  documents: ["src/**/*.ts", "!src/types/**/*"],
  generates: {
    "./src/types/queries.d.ts": {
      plugins: ["typescript-operations"],
      config: {
        mergeFragmentTypes: true,
      },
    },
  },
};

export default config;
