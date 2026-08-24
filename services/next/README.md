# Røde kors webpage (NextJS)

Next.js 16 frontend for rodekors.no. Pulls content from the sibling Enonic XP service (`services/xp/`) over Guillotine GraphQL, and renders pages using the [@enonic/nextjs-adapter](https://developer.enonic.com/learn/next.xp/stable) integration.

[[_TOC_]]

> ⚠️ **Warning:** This is **not** stock Next.js — see `AGENTS.md` for breaking changes in the bundled fork before writing code.

## Prerequisites

- Node.js 22 (LTS); 20.9+ minimum (matches the `node:22-alpine` Docker image). With [nvm](https://github.com/nvm-sh/nvm), run `nvm use` (or `nvm install`) to pick up the version from `.nvmrc`.
- npm
- The Enonic XP service running locally on `http://localhost:8080` (started from `services/xp/`). Without it, `dev`, `introspect`, and any page render will fail.

Install dependencies:

```bash
npm install
```

## Environment variables

Config is loaded from `.env` files by Next.js. Only `.env` is committed — it holds shared, **non-secret** values that are also exposed to the browser via the `NEXT_PUBLIC_*` mirrors. The `@enonic/nextjs-adapter` validates the required variables at module load, so they must be present whenever the app is built or run (including inside `docker build`).

### Files you must create locally

These two are **git-ignored** — create them yourself before running the app. Next.js loads `.env.development` for `npm run dev` and `.env.production` for `npm run build` / `npm run start` / the Docker build, layered on top of `.env`. Each only needs to set the mode and point `ENONIC_API` at the right backend:

`.env.development`

```bash
MODE=development
ENONIC_API=http://localhost:8080/site
ENONIC_API_TOKEN=mySecretKey
```

`.env.production`

```bash
MODE=production
ENONIC_API=https://rodekors-xp7prod.enonic.cloud/api/guillotine/site
ENONIC_API_TOKEN=mySecretKey
```

For machine-local secrets or overrides, add `.env.local` (also git-ignored).

## Commands

### Development

| Command | What it does |
| ------- | ------------ |
| `npm run dev` | Start the Next.js dev server on port 3000. Requires XP to be running on :8080. |
| `npm run build` | Production build. |
| `npm run start` | Serve the production build (run `build` first). |

### GraphQL

The Guillotine schema lives in `schema.graphql` and is consumed by `graphql-codegen` (`codegen.ts`) to produce typed query/fragment definitions in `src/types/queries.d.ts`.

| Command | What it does |
| ------- | ------------ |
| `npm run introspect` | Introspect the GraphQL endpoint declared in `graphql.config.yml` (default `dev`) and overwrite `schema.graphql`. Requires XP running. Accepts an optional endpoint name: `npm run introspect prod`. |
| `npm run generate` | Run `graphql-codegen` against the local `schema.graphql` plus all `.ts` files under `src/`, regenerating `src/types/queries.d.ts`. Then formats the output with Biome. |

Typical refresh after editing content types in XP:

```bash
npm run introspect && npm run generate
```

### Storybook

Components have colocated `*.stories.tsx` files. Storybook runs on port 6006 with the Vitest, a11y, docs, and MCP addons enabled.

| Command | What it does |
| ------- | ------------ |
| `npm run storybook` | Start the Storybook dev server on port 6006. Also exposes the Storybook MCP server at `http://localhost:6006/mcp` (see `.mcp.json`). |
| `npm run build-storybook` | Static Storybook build for hosting. |
| `npm run test` | Run all story tests (Vitest + Playwright + a11y checks) once. |

### Code quality

| Command | What it does |
| ------- | ------------ |
| `npm run lint` | Biome check (lint + format diagnostics, no writes). |
| `npm run format` | Biome write-mode: applies formatting fixes in place. |

## Project layout

```
services/next/
├── .storybook/              Storybook config + RichTextView mock
├── scripts/
│   ├── codegen.ts           graphql-codegen config (schema.graphql → queries.d.ts)
│   └── introspect.mjs       Reads graphql.config.yml, writes schema.graphql
├── src/
│   ├── app/                 Next.js App Router entry, globals.css, API routes
│   ├── components/
│   │   ├── blocks/          Content blocks (Accordion, Text, …) + colocated stories
│   │   ├── pages/           Page-type views (Default)
│   │   ├── partials/        Header / Footer / Details (rk-designsystem re-exports)
│   │   ├── parts/           Composable parts (BlocksView, ContentHeader) + stories
│   │   ├── queries/         GraphQL query strings consumed by codegen
│   │   └── _mappings.tsx    Wires Enonic content types → React components
│   ├── types/
│   │   ├── queries.d.ts     Generated GraphQL types (do not edit)
│   │   └── utils.ts         Shared TS helpers (PartProps, Get<>, …)
│   ├── server/validate.ts   Server-only request helpers (uses next/server)
│   ├── phrases/             i18n string bundles
│   └── utils.ts             Browser-safe utilities (forceArray, isRichTextData, …)
├── graphql.config.yml       Endpoint config consumed by introspect + editor tooling
├── schema.graphql           Introspected GraphQL schema (regenerate via `introspect`)
└── AGENTS.md                Project-specific instructions for AI agents
```

## MCP servers

This project ships a `.mcp.json` declaring the Storybook MCP server. When Storybook is running, Claude Code (and other MCP-aware clients) can:

- List components and their docs
- Look up real prop types and example stories before using a component
- Run story tests and get preview URLs

The server only resolves while `npm run storybook` is running on port 6006.
