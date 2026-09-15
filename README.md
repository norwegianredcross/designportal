# Røde Kors Designsystem — dokumentasjonsplattform

Documentation platform for the Røde Kors design system, built in the same shape as
the rodekors.no CMS architecture: two cooperating services under
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
cd services/xp   && npm run dev    # XP sandbox + watch + redeploy on :8081
cd services/next && npm run dev   # Next.js dev server on :3100
```

The Next.js app expects XP to be reachable on `http://localhost:8081`. Per-service
prerequisites, environment variables, and npm/Enonic CLI commands are documented in:

### Independent instances

Designportal uses the CMS100002-webpage architecture as a reference. It has its
own XP application (`no.rodekors.docs`), content project (`designsystem-docs`),
database, configuration, Next.js process and CLI lifecycle state. Both run XP
7.16.2; neither needs the other application installed.

| Service | Designportal | Reference on this workstation |
| --- | --- | --- |
| XP sandbox | `docs` (new machines may use `designportal`) | `rodekors` |
| XP HTTP | 8081 | 8090 |
| Management | 4849 | 4858 |
| Monitor | 2610 | 2619 |
| Debugger, when enabled | 5006 | 5005 |
| Next.js | 3100 | 3000 (local preview configured as 3002) |
| Storybook | 6106 | 6006 |

Open designportal at **http://127.0.0.1:3100**, and the reference frontend via
`localhost`. Different hostnames also keep Next.js preview cookies separate;
cookies are not isolated by port. Designportal's Content Studio session uses
its own `DESIGNPORTAL_SESSION` cookie.

Run `npm run dev` in `services/xp`. The wrapper uses the sandbox named in that
service's git-ignored `.enonic`, stores its own CLI state under `.local/enonic-cli`,
and directs management requests to port 4849. Its sandbox home points to the
existing dedicated sandbox, so content stays in place. Only the SDK binaries
are shared. Use `npm run enonic -- <command>` for other Enonic CLI operations.
Avoid bare `enonic dev`/`stop` for designportal: the CLI otherwise uses a global
running-sandbox record. Both checkouts must have explicit sandbox bindings.

Configuration and setup: [XP README](services/xp/README.md) and
[Next.js README](services/next/README.md).

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
