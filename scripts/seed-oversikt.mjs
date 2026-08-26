/**
 * Seeds the docs landing page, migrated from the SPA's Code-section
 * overview (OverviewContent + the code.overview translation strings):
 * three intro paragraphs and the three link cards. One deliberate
 * divergence: the SPA's third card links the Figma-MCP workflow guide,
 * which is not migrated yet — it links the contributing guide instead
 * until that article lands.
 */
import { contentId, postArticle, text } from "./seed-lib.mjs";

/** A cards option-set entry in the exact stored shape (see the codegen
 * type BlocksCards): css-class-encoded layout choices, link option-set
 * per card. internalLink is a Reference property, so targets must be
 * resolved to content ids first (contentId in seed-lib). */
// No kicker: the SPA's overview cards carry only title + text, and a
// kicker duplicating the title would render stacked twice.
const card = (title, textStr, internalLink) => ({
  title,
  text: textStr,
  link: { _selected: "internal", internal: { internalLink } },
});

await postArticle({
  parentPath: "/docs",
  name: "oversikt",
  displayName: "Oversikt",
  publish: true,
  data: {
    kicker: "Oversikt",
    showInMenu: true,
    title: "Røde Kors Designsystem",
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
            card(
              "Kom i gang",
              "Installasjon, oppsett og retningslinjer for utviklere.",
              await contentId("/docs/kom-i-gang"),
            ),
            card(
              "Designtokens",
              "Lær hvordan du bruker designtokens og fonter.",
              await contentId("/docs/designtokens"),
            ),
            card(
              "Bidra",
              "Standarder og beste praksis for å lage nye komponenter.",
              await contentId("/docs/bidra"),
            ),
          ],
        },
      },
    ],
  },
});
