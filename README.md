# Røde Kors Designsystem — dokumentasjonsplattform

Documentation platform for the Røde Kors design system, built in the same shape as
rodekors.no's CMS repo (`CMS100002-webpage`): two cooperating services under
[`services/`](./services):

- **Enonic XP** ([`services/xp`](./services/xp)) — headless CMS. Defines the block-based
  content model (via [`no.item:lib-xp-item-blocks`](https://github.com/ItemConsulting/lib-xp-item-blocks))
  and a Guillotine GraphQL API for the application `no.rodekors.docs`.
- **Next.js** ([`services/next`](./services/next)) — public renderer. Fetches content from XP
  over GraphQL via `@enonic/nextjs-adapter` and renders pages with
  [`rk-designsystem`](https://www.npmjs.com/package/rk-designsystem) components — the docs
  platform is itself a consumer of the design system it documents.

The Next.js app does not embed XP; it queries XP's Guillotine endpoint. When XP schemas
change, the Next side re-introspects the GraphQL schema and regenerates types. See each
service's README for the full workflow.

## Repository layout

```text
.
├── services/
│   ├── xp/        Enonic XP application (no.rodekors.docs)
│   └── next/      Next.js frontend (rk-designsystem consumer)
└── README.md      (this file)
```

## Local development

Both services run together. In two terminals:

```sh
cd services/xp   && enonic dev    # XP sandbox + watch + redeploy on :8080
cd services/next && npm run dev   # Next.js dev server on :3000
```

The Next.js app expects XP to be reachable on `http://localhost:8080`. Per-service
prerequisites, environment variables, and npm/Enonic CLI commands are documented in:

- [`services/xp/README.md`](./services/xp/README.md)
- [`services/next/README.md`](./services/next/README.md)

## Editor experience

The redaktørvisning intentionally mirrors rodekors.no's: the same `page` content type
(content header + a sequence of blocks), the same block library, the same trimmed rich-text
toolbar, and the same Content Studio preview wiring on the Next side. Themes offered in the
block theme selector come from the XP app config (`no.rodekors.docs.cfg`):

```properties
themes=primary-color-red=#D52B1E,neutral=#1E1E1E,additional-color-ocean=#EAF7FF,additional-color-jungle=#E6F6E4
```

## Versioning and changelogs

Each service handles its own versioning with
[Changesets](https://github.com/changesets/changesets), configured independently inside each
service. Both services are `"private": true`; the version bump plus a git tag is the release
signal.

## Status

Scaffolded from the rodekors.no CMS structure. Hosted on GitHub (personal staging) until it
moves to the organization. Deployment targets are not wired up yet.
