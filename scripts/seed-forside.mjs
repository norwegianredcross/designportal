/**
 * Seeds the docs front page — the landing a visitor gets at the site root.
 *
 * Without it the root renders header, empty <main>, footer and a 200: the
 * site content (/docs) is a portal:site, and _mappings.tsx registers views
 * only for no.rodekors.docs:page and the default page controller, so the
 * root falls through to nothing.
 *
 * WHY A CHILD AND NOT THE SITE ITSELF: the import service upserts by path
 * (services/xp .../import-docs.ts), so parentPath "/" + name "docs" would
 * resolve to the EXISTING site content and modify() would overwrite its
 * data with page fields — wiping siteConfig and with it the app's own
 * configuration. The front page is therefore an ordinary page at
 * /docs/forside, and app/[[...contentPath]]/page.tsx renders it for the
 * empty path so the URL stays "/".
 *
 * showInMenu is false: the header lists the five sections, and the front
 * page is reached by the logo, not by a menu entry.
 *
 * Run AFTER seed-seksjoner.mjs — the cards resolve the sections' ids.
 */
import { contentId, postArticle } from "./seed-lib.mjs";

const card = (title, textStr, internalLink) => ({
  title,
  text: textStr,
  link: { _selected: "internal", internal: { internalLink } },
});

// The hero's buttons point at the same sections the cards do; resolved once
// up front so the block literal below stays readable.
const kodeId = await contentId("/docs/kode");
const komponenterId = await contentId("/docs/komponenter");

await postArticle({
  parentPath: "/docs",
  name: "forside",
  displayName: "Forside",
  publish: true,
  data: {
    showInMenu: false,
    // No page-level intro: the hero block below carries the title and lead,
    // and SidePage renders the article header above the blocks — an ingress
    // here would say the same thing twice, stacked.
    title: "Røde Kors Designsystem",
    blocks: [
      {
        _selected: "blocks-hero",
        "blocks-hero": {
          badge: "1.3",
          badgeMeta: "Open Source",
          kicker: "Designsystem",
          title: "Ett system for Røde Kors sine digitale flater",
          lead: "Formspråket, retningslinjene, komponentbiblioteket og designtokens — samlet ett sted, slik at det som skal se likt ut faktisk gjør det.",
          actions: [
            { linkText: "Kom i gang", link: { _selected: "internal", internal: { internalLink: kodeId } } },
            { linkText: "Se komponentene", link: { _selected: "internal", internal: { internalLink: komponenterId } } },
          ],
        },
      },
      // Big figures are one of the Design retning's own devices ("Skala" —
      // big type and big stat numbers). Real counts, not decoration: 60 is
      // metadata.json's component entries (the published artifact downstream
      // templates consume), 388 the unique --ds-* custom properties in
      // rk-design-tokens, 6 the brand colour scopes components re-theme
      // through. Regenerate these when the library moves.
      {
        _selected: "blocks-summary",
        "blocks-summary": {
          title: "Designsystemet i tall",
          alignment: "spread",
          items: [
            { label: "Komponenter", value: "60", description: "React-komponenter klare til bruk" },
            { label: "Designtokens", value: "388", description: "farger, avstander og typografi" },
            { label: "Fargeskalaer", value: "6", description: "komponentene temes gjennom dem" },
          ],
          linkText: "Se komponentene",
          link: { _selected: "internal", internal: { internalLink: komponenterId } },
        },
      },
      // One live component, not a gallery. A design system front page that
      // only describes itself is the thing worth fixing here — but a wall of
      // demos would just be the specimen shelf again with more pixels. Buttons
      // are the most recognisable surface in the library, so a single
      // variants demo carries "these are real, working components" on its own.
      // The five curated demos live in components/blocks/demos.tsx; the editor
      // picks one from the same list in Content Studio.
      {
        _selected: "blocks-demo",
        "blocks-demo": {
          demo: "button-variants",
          title: "Ekte komponenter, rett fra biblioteket",
        },
      },
      {
        _selected: "blocks-cards",
        "blocks-cards": {
          columnsClass: "blocks-card--cols-3",
          imageClass: "blocks-card--image-top",
          items: [
            card(
              "Designretning",
              "Den visuelle retningen — form, farger og prinsipper.",
              await contentId("/docs/designretning"),
            ),
            card(
              "Design",
              "Retningslinjer for design i Røde Kors sine digitale produkter.",
              await contentId("/docs/design"),
            ),
            card(
              "Komponenter",
              "Komponentbiblioteket, generert fra bibliotekets metadata.",
              await contentId("/docs/komponenter"),
            ),
            card(
              "Kode",
              "Installasjon, designtokens, ikoner og hvordan du bidrar.",
              await contentId("/docs/kode"),
            ),
            card(
              "Tokens",
              "Designtokens-referansen, generert fra token-pakken.",
              await contentId("/docs/tokens"),
            ),
          ],
        },
      },
    ],
  },
});
