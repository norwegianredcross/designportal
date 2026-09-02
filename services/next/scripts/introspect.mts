#!/usr/bin/env node
import { writeFile } from "node:fs/promises";
import { buildClientSchema, getIntrospectionQuery, type IntrospectionQuery, printSchema } from "graphql";
import { loadConfig } from "graphql-config";

type Endpoint = { url?: string; headers?: Record<string, string> };

type IntrospectionResponse = {
  data: IntrospectionQuery;
  errors?: readonly { message: string }[];
};

const endpointName = process.argv[2] ?? "dev";

const config = await loadConfig({ rootDir: process.cwd() });
if (!config) {
  throw new Error("No GraphQL config found (expected graphql.config.yml in the project root).");
}
const project = config.getDefault();

const endpoints = (project.extensions?.endpoints ?? {}) as Record<string, Endpoint>;
const endpoint = endpoints[endpointName];
if (!endpoint?.url) {
  throw new Error(
    `No endpoint "${endpointName}" found in graphql.config.yml. Known: ${Object.keys(endpoints).join(", ") || "(none)"}`,
  );
}

const outPath = typeof project.schema === "string" ? project.schema : "schema.graphql";

const response = await fetch(endpoint.url, {
  method: "POST",
  headers: { "Content-Type": "application/json", ...(endpoint.headers ?? {}) },
  body: JSON.stringify({ query: getIntrospectionQuery() }),
});

if (!response.ok) {
  throw new Error(`Introspection request to ${endpoint.url} failed: ${response.status} ${response.statusText}`);
}

const { data, errors } = (await response.json()) as IntrospectionResponse;
if (errors?.length) {
  throw new Error(`Introspection returned errors: ${JSON.stringify(errors, null, 2)}`);
}

const sdl = `${printSchema(buildClientSchema(data))}\n`;
await writeFile(outPath, sdl, "utf8");
console.log(`Wrote ${outPath} from ${endpointName} (${endpoint.url})`);
