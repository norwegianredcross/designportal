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

/** A "cardsblokk stor": the full-width feature band from the block template
 * (Figma blokk-templates 417:28136) — picture on one side, kicker, heading,
 * text and a call to action on the other. One card in a one-column block is
 * exactly that shape, which is why this takes the same fields as `card` plus
 * an image, a kicker and an optional palette scope. */
const featureCard = ({ kicker, title, text: textStr, imageId, theme, internalLink }) => ({
  kicker,
  title,
  text: textStr,
  imageId,
  ...(theme ? { theme } : {}),
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
const paletteId = await contentId("/docs/designretning/DesignretningVarmPalette.png");
const varmId = await contentId("/docs/designretning/DesignretningVarmPalette.png");
const korsId = await contentId("/docs/designretning/DesignretningRodTradKors.png");
const menneskerId = await contentId("/docs/designretning/DesignretningMenneskerIFokus.png");
const designretningId = await contentId("/docs/designretning");
const tokensId = await contentId("/docs/tokens");

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
      // The page now follows the block template's "forside generisk"
      // (Figma blokk-templates 403:25051), which alternates plain sections
      // with tinted feature bands instead of stacking identical strips:
      //   head → kort (små) → BAND → statistikk → BAND (tonet) → kort (bilde)
      // Each section carries a title, and the bands are what break the rhythm.
      //
      // Snarveiene first, as the template does: six small cards straight after
      // the hero, so someone who knows where they are going leaves immediately.
      {
        _selected: "blocks-cards",
        "blocks-cards": {
          title: "Snarveier",
          columnsClass: "blocks-card--cols-3",
          // Required by the lib's form (blocks-image-placement, minimum 1) even
          // though these cards carry no picture — leaving it out fails
          // validation with a bare ContentDataValidationException.
          imageClass: "blocks-card--image-top",
          items: [
            card("Designretning", "Den visuelle retningen — form, farger og prinsipper.", designretningId),
            card("Design", "Retningslinjer for design i Røde Kors sine digitale produkter.", await contentId("/docs/design")),
            card("Komponenter", "Komponentbiblioteket, generert fra bibliotekets metadata.", komponenterId),
            card("Kode", "Installasjon, designtokens, ikoner og hvordan du bidrar.", kodeId),
            card("Tokens", "Designtokens-referansen, generert fra token-pakken.", tokensId),
          ],
        },
      },
      // First band. The photograph now has a job instead of sitting alone:
      // "Mennesker i fokus" is a bærende virkemiddel, and the direction says
      // outright that "bilder og tekst er de viktigste — de bærer historiene og
      // menneskene som gjør merkevaren ekte". One column renders the template's
      // cardsblokk stor: picture beside kicker, heading, text and a CTA.
      {
        _selected: "blocks-cards",
        "blocks-cards": {
          columnsClass: "blocks-card--cols-1",
          imageClass: "blocks-card--image-left",
          items: [
            featureCard({
              kicker: "Designretning",
              title: "Systemet begynner med menneskene det er laget for",
              text: "Seks virkemidler oversetter Røde Kors sin identitet til digitale flater — varme former, tydelig skala, den røde tråden fra korset, og ekte mennesker i ekte situasjoner.",
              imageId: heroFotoId,
              internalLink: designretningId,
            }),
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
      // Second band, tinted — the template puts a green panel here to break
      // the run of plain sections (403:26035). additional-color-jungle is one
      // of the four scopes the editor can pick, and the palette diagram is the
      // subject, so the panel demonstrates the thing it is talking about.
      {
        _selected: "blocks-cards",
        "blocks-cards": {
          columnsClass: "blocks-card--cols-1",
          imageClass: "blocks-card--image-right",
          items: [
            featureCard({
              kicker: "Farger",
              title: "Én palett, fire skalaer, konsekvent bruk",
              text: "Fargene er utvidet med varme nøytrale toner som komplementerer rød uten å konkurrere med den. Farge brukes med tilbakeholdenhet — jo mer hvitt som omgir den, jo sterkere fremstår merkevarefargen.",
              imageId: varmId,
              theme: "additional-color-jungle",
              internalLink: tokensId,
            }),
          ],
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
      // The template closes with a row of picture cards rather than another
      // link list (403:25841). Three of the six virkemidler, each with the
      // diagram that already illustrates it inside Design retning — the thesis
      // of the system, shown instead of linked.
      {
        _selected: "blocks-cards",
        "blocks-cards": {
          title: "Virkemidlene",
          columnsClass: "blocks-card--cols-3",
          imageClass: "blocks-card--image-top",
          items: [
            featureCard({
              kicker: "Varm",
              title: "Avrundede former og varme farger",
              text: "Et uttrykk som oppleves nært, menneskelig og trygt.",
              imageId: varmId,
              internalLink: await contentId("/docs/designretning/varm"),
            }),
            featureCard({
              kicker: "Rød tråd",
              title: "Korsets ytterpunkter som formspråk",
              text: "Grafiske fragmenter binder flatene sammen uten å konkurrere med logoen.",
              imageId: korsId,
              internalLink: await contentId("/docs/designretning/rod-trad"),
            }),
            featureCard({
              kicker: "Mennesker i fokus",
              title: "Ekte historier, ekte mennesker",
              text: "Bilder og tekst bærer historiene som gjør merkevaren ekte.",
              imageId: menneskerId,
              internalLink: await contentId("/docs/designretning/mennesker-i-fokus"),
            }),
          ],
        },
      },
    ],
  },
});
