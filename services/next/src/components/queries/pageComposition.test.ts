import { readFileSync } from "node:fs";
import { combineMultipleQueries } from "@enonic/nextjs-adapter/guillotine/combineMultipleQueries";
import { buildSchema, parse, validate } from "graphql";
import { describe, expect, it } from "vitest";
import { commonQuery } from "./common";
import getBlocks from "./getBlocks";
import getContentHeader from "./getContentHeader";
import getPageDefault from "./getPageDefault";

const schema = buildSchema(readFileSync(new URL("../../../schema.graphql", import.meta.url), "utf8"));

describe("adapter page composition queries", () => {
  it.each([
    { name: "complete page", queries: [commonQuery, getPageDefault(), getContentHeader(), getBlocks()] },
    { name: "single part preview", queries: [commonQuery, getBlocks()] },
    { name: "common data without a page controller", queries: [commonQuery] },
  ])("keeps $name valid after the adapter merges queries", ({ queries }) => {
    const merged = combineMultipleQueries(
      queries.map((query) => ({ queryAndVariables: { query, variables: { path: "/docs/tokens" } } })),
    );
    expect(validate(schema, parse(merged.query)).map((error) => error.message)).toEqual([]);
  });
});
