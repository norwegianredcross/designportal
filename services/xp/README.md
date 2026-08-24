# Røde kors webpage (Enonic XP)

The Enonic XP application `no.rodekors.docs` ("Røde kors") provides the GraphQL-backend for the [`services/next`](../next)-application. It contains all Content Types and components for the site, and exposes them using the [Guillotine GraphQL](https://developer.enonic.com/docs/guillotine)-app.

See the [Enonic XP documentation](https://developer.enonic.com/docs/xp/stable) for platform concepts.

## Prerequisites

- **[Enonic CLI](https://developer.enonic.com/docs/enonic-cli)** — drives all build, deploy, and sandbox tasks.
- **Node 22.22.3** (matches [`.nvmrc`](./.nvmrc)) — needed to run npm scripts (lint, tests, etc.) directly.

## Getting started

Create and start a local XP sandbox (only needed once per machine):

```sh
enonic sandbox create rodekors
```

## Building

```sh
enonic project build
```

Produces the deployable `.jar` under `build/libs/`. The npm pipeline (tsup) bundles server code and assets into `build/resources/main/` as part of the build.

## Develop locally

Start a hot-reload session — the sandbox boots in the background and the app is redeployed on every file change:

```sh
enonic dev
```

With the sandbox running, XP is reachable at <http://localhost:8080>.

A one-off deploy without watch mode:

```sh
enonic project deploy
```

## npm scripts

Invoked directly when you want fast feedback outside the full build/deploy cycle:

| Script                | What it does                                              |
| --------------------- | --------------------------------------------------------- |
| `npm run build`       | Bundles server code and assets via tsup                   |
| `npm run check`       | Runs `check:types` and `lint` in parallel                 |
| `npm run check:types` | TypeScript type-check via tsup                            |
| `npm run lint`        | Biome `check --error-on-warnings` (lint + format check)   |
| `npm run format`      | Apply Biome safe fixes and formatting                     |
| `npm run test`        | Jest test suite                                           |
| `npm run cov`         | Jest with coverage report                                 |

## Project layout

```text
src/
  main/
    resources/
      site/         # content types, mixins, x-data, pages, parts (XP schemas)
      lib/rodekors/ # shared TypeScript utilities
      guillotine/   # Guillotine GraphQL schema extensions (custom block types)
      i18n/         # translation bundles
      assets/       # client-side assets, bundled separately by tsup
  jest/             # Jest setup and helpers
```

## Relationship to `services/next`

The Next.js application is the public renderer. It does not embed XP — it queries XP's Guillotine GraphQL endpoint at `http://localhost:8080/site/rodekors/master` (see [`services/next/graphql.config.yml`](../next/graphql.config.yml)).

The custom resolvers and types in [`src/main/resources/guillotine/guillotine.ts`](./src/main/resources/guillotine/guillotine.ts) directly shape what the Next.js app can query. When you add a new content type or block, the typical loop is:

1. Define / update the schema and resolvers here in XP.
2. With `enonic dev` running, refresh the generated GraphQL types on the Next side:
   ```sh
   cd ../next
   npm run introspect   # fetch updated schema.graphql from the running XP instance
   npm run generate     # regenerate TypeScript types from schema.graphql
   ```
3. Use the new types in `services/next` queries.

### Full local dev loop

```sh
cd services/xp  && enonic dev      # terminal 1 — sandbox + watch + redeploy
cd services/next && npm run dev    # terminal 2 — Next.js dev server
```

## Deployment

This service is not intended to be deployed to Azure like the NextJS-app. The CI-pipelines builds the jar-file and installs it on the site in Enonic Cloud.
