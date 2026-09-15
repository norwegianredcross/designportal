<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Design system

Follow the Røde Kors design-system guide when using `rk-designsystem` components.
It is a local snapshot of <https://norwegianredcross.github.io/DesignSystem/storybook/AI_DESIGN_SYSTEM_GUIDE.md>
— refresh it with `curl -fsSL <that URL> -o .claude/AI_DESIGN_SYSTEM_GUIDE.md` when the design team announces an update.

@.claude/AI_DESIGN_SYSTEM_GUIDE.md

# Blocks

The block pipeline mirrors the rk.no CMS (`CMS100003-webpage`) on purpose — same
architecture, so what is learned in one repo transfers to the other. Four rules
come from mistakes that repo hit first.

## Type a block with `BlockByTypename`

```ts
type HeroData = BlockByTypename<"no_rodekors_docs_BlockHero">;
```

Never `Extract<…, { __typename: "…" }>` directly. Codegen collapses blocks whose
selection sets are identical into a single union member carrying every typename
it stands for, and plain `Extract` then rejects that member for either name on
its own and silently yields `never` — every field access on the block becomes an
error with no obvious cause. Two blocks selecting the same fields is all it
takes. See `ExtractByTypename` in `types/utils.ts`.

## The registry is typed, not a `Record<string, …>`

`blockComponents` is a mapped type over the real `__typename` union, so a
misspelled key and a component wired to the wrong block are both compile
errors. Adding a block means adding its entry there and nowhere else on the
frontend; both editorial render paths (the blocks-view part and the page’s after-content area) read it.

## No inline styles

Every block's look lives in a `<Name>Block.module.css`. Inline styles cannot be
overridden by a stylesheet, and cannot express hover, focus or media queries at
all. Values the editor chooses — a column count, a padding that depends on card
size, an image's own aspect ratio — pass in as CSS custom properties set on the
element, which is the only thing that legitimately stays in a `style` prop.

## Spacing between blocks belongs to the container

`BlocksView.module.css` owns the rhythm; a block never sets its own outer
margin. A block that needs different spacing declares what it is
(`data-block="images"`) and the container decides, so the rule stays in one
place where it can see both neighbours.

## Adding a block, end to end

1. Reuse the shared block mixin from `no.item:lib-xp-item-blocks`; only docs-specific extensions define a local form.
2. register it as an `<option>` in `site/mixins/blocks/blocks.xml`
3. Norwegian labels in `i18n/phrases.properties`
4. `guillotine/guillotine.ts` — type, union member, and a `resolveBlocks` case
5. `./gradlew generateTypeScript`, then deploy and `npm run introspect && npm run generate`
6. the shared `getEditorialBlocksFragment.ts` used by `getBlocks.ts` and `getPageDefault.ts`
7. `<Name>Block.tsx` + `.module.css` + `.stories.tsx`
8. the entry in `components/blocks/registry.ts`

## Page composition

Match `CMS100003-webpage`: the route fetches and dispatches to `MainView`;
`addPage` registers the controller, and `Default` renders the shell and regions.
Use `addPart` for placed components. Do not add a direct mapping for the Side
content type: it overrides the editor's selected page controller/template.
Generated documentation sections stay fixed in the page view, outside the block
registry. Keep the real render mode when rendering regions so editing metadata
is present in Content Studio without being forced on public requests.
