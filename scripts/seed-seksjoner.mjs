/**
 * Seeds the five section pages that make up the docs' information
 * architecture — the same five as today's SPA header: Designretning,
 * Design, Komponenter, Kode, Tokens. All are menu-flagged, so the header
 * lists exactly these. Kode carries the migrated overview as its landing
 * (intro, three paragraphs, three internal link cards); Designretning and
 * Design are landings awaiting content migration; Komponenter and Tokens
 * are placeholders for the pages that will be GENERATED from the
 * library's metadata and token build.
 *
 * Run AFTER the article seeds — the kode landing's cards resolve the
 * moved articles' ids. Also removes the superseded flat /docs/oversikt.
 */
import { contentId, postArticle, text } from "./seed-lib.mjs";

const card = (title, textStr, internalLink) => ({
  title,
  text: textStr,
  link: { _selected: "internal", internal: { internalLink } },
});

const plain = (name, displayName, intro) => ({
  parentPath: "/docs",
  name,
  displayName,
  publish: true,
  data: { showInMenu: true, title: displayName, intro: `<p>${intro}</p>`, blocks: [] },
});

await postArticle(plain("designretning", "Designretning", "Den visuelle retningen for Røde Kors — form, farger og prinsipper. Innholdet migreres hit fra dagens dokumentasjon."));
await postArticle(plain("design", "Design", "Retningslinjer for design i Røde Kors sine digitale produkter. Innholdet migreres hit fra dagens dokumentasjon."));
await postArticle(plain("komponenter", "Komponenter", "Komponentbiblioteket. Denne seksjonen genereres fra bibliotekets metadata og kommer som egen side."));

await postArticle({
  parentPath: "/docs",
  name: "kode",
  // The flat overview page is superseded by this landing.
  remove: ["/docs/oversikt"],
  displayName: "Kode",
  publish: true,
  data: {
    showInMenu: true,
    title: "Kode",
    intro:
      "<p>Velkommen til Røde Kors Designsystem! Dette repositoriet inneholder et bibliotek med gjenbrukbare UI-komponenter bygget med React, skreddersydd for Norges Røde Kors sine digitale prosjekter.</p>",
    blocks: [
      text(
        "<p>Det er utviklet ved å utnytte grunnkomponentene fra Digdirs Designsystemet. Denne tilnærmingen sikrer en helhetlig og gjenkjennelig visuell identitet på tvers av alle applikasjoner for Røde Kors. Systemet er forhåndskonfigurert med det offisielle Røde Kors-temaet, som leveres via en dedikert designtoken-pakke.</p>" +
          "<p>Hovedmålet er å sikre merkevarekonsistens, forbedre utviklingseffektiviteten og opprettholde høye standarder for tilgjengelighet i alle Røde Kors-applikasjoner.</p>" +
          "<p>Storybook fungerer som den interaktive dokumentasjonen og utviklingsmiljøet for å vise og teste disse komponentene.</p>",
      ),
      {
        _selected: "blocks-cards",
        "blocks-cards": {
          columnsClass: "blocks-card--cols-3",
          imageClass: "blocks-card--image-top",
          items: [
            card("Kom i gang", "Installasjon, oppsett og retningslinjer for utviklere.", await contentId("/docs/kode/kom-i-gang")),
            card("Designtokens", "Lær hvordan du bruker designtokens og fonter.", await contentId("/docs/kode/designtokens")),
            // Deliberate divergence from the SPA: its third card links the
            // Figma-MCP workflow guide, which is not migrated yet — this
            // links the contributing guide until that article lands.
            card("Bidra", "Standarder og beste praksis for å lage nye komponenter.", await contentId("/docs/kode/bidra")),
          ],
        },
      },
    ],
  },
});

await postArticle(plain("tokens", "Tokens", "Designtokens-referansen. Genereres fra token-pakken og kommer som egen side."));
