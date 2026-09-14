# Røde kors webpage (Enonic XP)

The Enonic XP application `no.rodekors.docs` ("Røde kors") provides the GraphQL-backend for the [`services/next`](../next)-application. It contains all Content Types and components for the site, and exposes them using the [Guillotine GraphQL](https://developer.enonic.com/docs/guillotine)-app.

See the [Enonic XP documentation](https://developer.enonic.com/docs/xp/stable) for platform concepts.

## Prerequisites

- **[Enonic CLI](https://developer.enonic.com/docs/enonic-cli)** — drives all build, deploy, and sandbox tasks.
- **Node 22.22.3** (matches [`.nvmrc`](./.nvmrc)) — needed to run npm scripts (lint, tests, etc.) directly.

## Getting started

Create a local XP sandbox and bind this checkout to it (only needed once per machine):

```sh
enonic sandbox create designportal
cd services/xp && enonic project sandbox designportal
```

Then move it off XP's default ports, so it can run at the same time as the rodekors.no
sandbox — see [Why :8081](../../README.md#why-8081-and-a-named-sandbox). In
`~/.enonic/sandboxes/designportal/home/config/com.enonic.xp.web.jetty.cfg`, uncomment and
change three lines:

```properties
http.xp.port = 8081
http.management.port = 4849
http.monitor.port = 2610
```

Keep this sandbox to this application alone. Deploying the rodekors.no app into it makes
Guillotine emit both apps' types, and `npm run generate` on the Next side fails on every
block fragment.

### The CLI ignores the management port

`enonic project sandbox` binds this checkout to the `designportal` sandbox, but that
binding governs only build and deploy. Everything that talks to the **management
endpoint** — `dump`, `load`, `export`, `import`, `snapshot`, `repo` — is hard-wired to
4848 and cannot be pointed elsewhere: those commands take no host or port flag, and
`enonic project env` exports nothing but `XP_HOME` and `JAVA_HOME`.

Run from this directory, `enonic dump load` therefore reaches the **rodekors.no** sandbox
on 4848, not ours on 4849. That matters because a load deletes every repository in the
instance it reaches, so a command silently aimed at the wrong CMS wipes it. Address the
port yourself instead — see below.

## Getting the content

A fresh clone gives you an empty CMS. Content lives in the sandbox's own database under
`~/.enonic/sandboxes/`, never in git, so `git clone` brings the content *types* and the
rendering code but not a single page. Someone who already has the content has to hand it
over, in one of two shapes.

**A Content Studio export** — a teammate marks a subtree in the content tree and exports
it. You import the zip from Content Studio's own UI (the upload icon in the Create Content
dialog). No password, no CLI, and it leaves everything else in the sandbox alone. Prefer
this when you only need the pages.

**A system dump** — `enonic dump create` on their machine, which captures every repository
plus users, roles and audit log. Heavier, and destructive on the way in.

### Loading a system dump

Unpack the archive so the dump's own folder sits directly under the sandbox's dump
directory, then POST it to the management endpoint:

```sh
unzip <archive>.zip -d ~/.enonic/sandboxes/designportal/home/data/dump/
curl -u <user> -X POST http://localhost:4849/system/load \
  -H 'Content-Type: application/json' -d '{"name":"<dump-name>"}'
```

The response is a `taskId` and nothing more: the load runs asynchronously, so the terminal
tells you nothing about how it went. Watch the content appear instead — this counts the
nodes Guillotine can see, and needs no authentication:

```sh
curl -s -X POST http://localhost:8081/site/designsystem-docs/master \
  -H 'Content-Type: application/json' \
  -d '{"query":"{ guillotine { query(first:500){ _path type } } }"}'
```

`curl -u <user>` without a colon prompts for the password on its own line, so it stays out
of shell history. A 401 means the endpoint answered and the password was wrong; connection
refused means the sandbox is not running. Use `curl`, not `enonic dump load`: besides the
port above, the 4.x CLI speaks the XP 8 API by default and needs `--compat 7.16` against
this 7.16 sandbox.

Three things to know before you run it:

- **A load deletes every repository in the instance first.** It replaces, never merges.
- **`system-repo` comes with the dump**, so the users and roles become the sender's. Your
  own admin account disappears, and the welcome screen's *Log in as Guest* — which grants
  Super User, despite the name — only appears while no admin user exists at all. If the
  sender had one, you need their credentials or the recovery below.
- **You need admin credentials before you start**, because the management endpoint
  authenticates against the *current* instance. Guest access does not reach it.

### Regaining admin access

Set a password for XP's built-in superuser in
`~/.enonic/sandboxes/designportal/home/config/system.properties`:

```properties
xp.suPassword = <password>
```

The property is read at startup only, so stop the sandbox and start it again, then log in
at <http://localhost:8081> as `su`. This is a local development sandbox; treat the
password as throwaway and keep it out of anything shared.

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

With the sandbox running, XP is reachable at <http://localhost:8081>.

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

The Next.js application is the public renderer. It does not embed XP — it queries XP's Guillotine GraphQL endpoint at `http://localhost:8081/site/designsystem-docs/master` (see [`services/next/graphql.config.yml`](../next/graphql.config.yml)).

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
