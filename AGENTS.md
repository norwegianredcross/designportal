# Working in this repo

Two services, one repo: `services/xp` (Enonic XP, headless CMS) and `services/next`
(Next.js renderer). Read each service's README and AGENTS before coding in it.

## Non-negotiables

- The redaktørvisning (Content Studio editor experience) and the block model must stay
  aligned with the rodekors.no CMS architecture. Block definitions come from
  `no.item:lib-xp-item-blocks`; this app selects blocks by shadowing
  `site/mixins/blocks/blocks.xml`. Do not fork the block forms.
- The Next side renders with `rk-designsystem` components. No hand-rolled UI where a design
  system component exists, and no new design system components from this repo.
- When the XP schema changes, re-introspect and regenerate types on the Next side
  (`npm run introspect && npm run generate`) in the same PR.

## Branches and pull requests

- `main` is protected; changes arrive through pull requests on GitHub.
- Branch names: `<short-description-in-kebab-case>`, conventional-commit PR titles,
  one concern per PR, short PR descriptions.
