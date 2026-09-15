# Røde kors webpage (Enonic XP)

The Enonic XP application `no.rodekors.docs` ("Røde kors") provides the GraphQL-backend for the [`services/next`](../next)-application. It contains all Content Types and components for the site, and exposes them using the [Guillotine GraphQL](https://developer.enonic.com/docs/guillotine)-app.

See the [Enonic XP documentation](https://developer.enonic.com/docs/xp/stable) for platform concepts.

## Prerequisites

- **[Enonic CLI](https://developer.enonic.com/docs/enonic-cli)** — drives all build, deploy, and sandbox tasks.
- **Node 22.22.3** (matches [`.nvmrc`](./.nvmrc)) — needed to run npm scripts (lint, tests, etc.) directly.

## Getting started

Create a local XP sandbox and bind this checkout to it (only needed once per machine):

```sh
enonic sandbox create designportal --version 7.16.2 --skip-start
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
session.cookieName = DESIGNPORTAL_SESSION
```

Keep this sandbox to this application alone. Deploying the rodekors.no app into it makes
Guillotine emit both apps' types, and `npm run generate` on the Next side fails on every
block fragment.

### Keep CLI lifecycle and management separate

Use `npm run dev` and `npm run enonic -- <command>` from this service. The
wrapper sets `ENONIC_CLI_HOME_PATH` to this checkout's `.local/enonic-cli` and
`ENONIC_CLI_REMOTE_URL=http://localhost:4849`, so lifecycle commands do not share
the reference project's running-sandbox record and management commands target
this instance. It also reserves debugger port 5006.

The Enonic CLI supports `ENONIC_CLI_REMOTE_URL`; a bare command defaults to 4848.
For XP 7 commands in CLI 4, include `--compat 7.16` where offered.
See [Enonic CLI configuration](https://developer.enonic.com/docs/enonic-cli/stable/xp).

On this workstation the existing dedicated sandbox is named `docs`, on XP
7.16.2. Keep that binding to retain its content; `designportal` above is the
suggested name for a new developer. In its cluster config keep
`cluster.enabled = false`. In `com.enonic.app.nextxp.cfg` use
`nextjs.docs.url=http://127.0.0.1:3100` for the local frontend.

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
refused means the sandbox is not running. The 4.x CLI speaks the XP 8 API by default; through the local wrapper,
use `--compat 7.16` against this 7.16 sandbox.

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

## Page template setup

Pages use the same composition model as `CMS100003-webpage`: a page controller
with `header` and `main` regions, containing the `content-header` and `blocks-view`
parts. The frontend renders the selected template through `Default` and
`RegionsView`; it does not override every Side with a content-type view.

For a new site, in Content Studio:

1. Under the site's **Templates** folder, create a page template called **Standard side**.
2. Set its supported content type to **Side** and choose the **Standard** controller.
3. Place **Content header** in `header` and **Blocks view** in `main`.
4. Save and publish the template. New Side content can use automatic template selection.

The content fields still own title/intro and editorial blocks, as in the reference.
The documentation-specific page-view selection adds the fixed catalogue, changelog
or token section after `main`, with optional editorial content below it. The list
itself is not a movable block. The controller's narrow/wide choice controls page width.

### Existing preview dumps

The original preview has an empty `/docs/_templates/standard-side` template.
After deploying the application, initialize it once from `services/xp`:

```sh
# DOCS_IMPORT_TOKEN is the local importToken from no.rodekors.docs.cfg.
node scripts/initialize-page-template.mjs          # inspect the proposed change
node scripts/initialize-page-template.mjs --apply  # back up and initialize
```

This changes only the empty template's composition, independently in draft and
master. Page IDs, URLs, content fields and publication state remain unchanged.
Existing editor compositions are preserved; repeated runs make no changes.
The token-protected service is disabled when no `importToken` is configured.
For another sandbox port, `DOCS_MIGRATION_URL` can override the full service URL.
If the template is missing, follow the Content Studio setup above.

## Generated documentation pages

Create a **Side** as usual. Its **Sidevisning** field optionally selects
**Komponentoversikt**, **Endringslogg**, or **Design-tokens**. Leave it empty
for an ordinary article. The URL, sidebar and main-menu settings work as before.

The page renders its title/intro, the first block area, the generated section,
then **Innhold etter listen**. Both block areas reuse the same `blocks` mixin.
Editors can add text, images, code and other editorial blocks around the list;
the generated lists are no longer options in the block picker. Catalogue and
release data still come from the published design system; tokens come from the
running theme. Page-view settings control the section wording, catalogue search
and release limit where relevant.

### Migrating older content or a restored preview dump

Deploy this version of the XP application first. From `services/xp`, set
`DOCS_IMPORT_TOKEN` to the local `importToken` in `no.rodekors.docs.cfg`, then run:

```sh
node scripts/migrate-page-views.mjs          # list affected pages only
node scripts/migrate-page-views.mjs --apply  # save original fields, then migrate
```

For a different XP port, set `DOCS_MIGRATION_URL` to the corresponding service
URL. The service is disabled when the application has no `importToken` configured.
It operates only on `designsystem-docs` pages and migrates draft and master
separately, preserving unpublished edits, page IDs, URLs and publication metadata.
It preserves all blocks before and after the original list and its settings.
Pages with multiple generated sections are rejected for manual review. Re-running
the migration makes no changes once it is complete. Older page data also has a
read compatibility path, but migrate before editing it in Content Studio.

After an XP schema change, regenerate `.xp-codegen` using
`./gradlew generateTypeScript`, then run the Next introspection and code generation.

## Building the application

```sh
enonic project build
```

Produces the deployable `.jar` under `build/libs/`. The npm pipeline (tsup) bundles server code and assets into `build/resources/main/` as part of the build.

## Develop locally

Start a hot-reload session — the sandbox boots in the background and the app is redeployed on every file change:

```sh
npm run dev
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
2. With `npm run dev` running, refresh the generated GraphQL types on the Next side:
   ```sh
   cd ../next
   npm run introspect   # fetch updated schema.graphql from the running XP instance
   npm run generate     # regenerate TypeScript types from schema.graphql
   ```
3. Use the new types in `services/next` queries.

### Full local dev loop

```sh
cd services/xp  && npm run dev      # terminal 1 — sandbox + watch + redeploy
cd services/next && npm run dev    # terminal 2 — Next.js dev server
```

## Deployment

This service is not intended to be deployed to Azure like the NextJS-app. The CI-pipelines builds the jar-file and installs it on the site in Enonic Cloud.
