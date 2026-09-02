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
// The Hjelpekorps photograph. The only real photograph in the repo today —
// every other media item is a UI mockup or a diagram — so the front page and
// Design retning share it until there is more photography to draw on.
const heroFotoId = await contentId("/docs/designretning/DesignretningHeroFoto.png");

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
      // Ekte mennesker, ekte bilder. The Design retning names this a bærende
      // element ("Mennesker i fokus") and says outright that "bilder og tekst
      // er de viktigste — de bærer historiene og menneskene som gjør
      // merkevaren ekte". The front page had neither a person nor a picture on
      // it, which is most of why it read as generic: everything below the hero
      // was text on tint. Full width and directly under the hero, so the first
      // thing after the promise is who the promise is for.
      {
        _selected: "blocks-images",
        "blocks-images": {
          size: "full",
          items: [
            {
              imageId: heroFotoId,
              altText: "Frivillige fra Røde Kors Hjelpekorps i aksjon i fjellet",
            },
          ],
        },
      },
      // Big figures are one of the Design retning's own devices ("Skala" —
      // big type and big stat numbers). Real counts, not decoration, and all
      // three re-verified against their sources: 60 is metadata.json's
      // component entries (the published artifact downstream templates
      // consume), 388 the unique --ds-* custom properties across
      // rk-design-tokens' css.
      //
      // The third said 6 and was wrong — there are 4. The scopes a component
      // can be re-themed through are the ones the editor's theme selector
      // offers, and that list is built by the lib's theme-selector service
      // from the app's `themes` config (no.rodekors.docs.cfg), which names
      // primary-color-red, neutral, additional-color-ocean and
      // additional-color-jungle. Digdir's own semantic scopes (info, warning,
      // danger, success) resolve too, but no block form exposes them, and
      // accent/brand1/brand2 are aliases of primary-color-red. Regenerate
      // these when the library moves.
      {
        _selected: "blocks-summary",
        "blocks-summary": {
          title: "Designsystemet i tall",
          alignment: "spread",
          items: [
            { label: "Komponenter", value: "60", description: "React-komponenter klare til bruk" },
            { label: "Designtokens", value: "388", description: "farger, avstander og typografi" },
            { label: "Fargeskalaer", value: "4", description: "komponentene temes gjennom dem" },
          ],
          linkText: "Se komponentene",
          link: { _selected: "internal", internal: { internalLink: komponenterId } },
        },
      },
      // Still ONE live component, not a gallery — a wall of demos would just
      // be the specimen shelf again with more pixels. But the button variants
      // occupied 290px of a 1090px panel, so three quarters of it was empty
      // and the block read as filler. card-scopes fills the row and carries
      // more at the same time: it is the same component re-themed through the
      // colour scopes, which is the one thing about this system a screenshot
      // cannot show. The five curated demos live in
      // components/blocks/demos.tsx; the editor picks one from the same list
      // in Content Studio.
      {
        _selected: "blocks-demo",
        "blocks-demo": {
          demo: "card-scopes",
          title: "Én komponent, fire fargeskalaer",
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
