/**
 * Seeds the four remaining Code-section articles from the docs SPA
 * (DesignSystem repo, src/pages/Code/index.tsx + the code.* translation
 * strings): Designtokens, Fonter, Ikoner and Bidra. Hand-translated into
 * the CMS block model with the same conventions as seed-kom-i-gang.mjs:
 * section headings and prose in blocks-text, code samples in blocks-code
 * (short h3s directly above a sample become the code block's label), the
 * article ingress in the page's intro field.
 */
import { boldItem, code, postArticle, text, ul } from "./seed-lib.mjs";

const articles = [];

// ---------------------------------------------------------------- designtokens
articles.push({
  parentPath: "/docs",
  name: "designtokens",
  displayName: "Røde Kors Designtokens",
  publish: true,
  data: {
    title: "Røde Kors Designtokens",
    intro:
      "<p>Dette repositoriet er den sentrale kilden for alle designtokens (farger, typografi, avstander osv.) for Norges Røde Kors sine digitale produkter. Det fungerer som en sannhetskilde (single source of truth) som automatisk distribuerer stilendringer til alle tilkoblede prosjekter.</p>",
    blocks: [
      text("<h2>Hvordan ta i bruk tokens</h2><p>For å bruke designtokens i ditt prosjekt, må du installere og konfigurere temapakken.</p>"),
      code("npm install rk-designsystem", "bash", "1. Installasjon"),
      text(
        "<h3>2. Importer CSS</h3><p>I din applikasjons rot-layout (f.eks. layout.tsx), importer grunnstilarket før Røde Kors-temafilen.</p>",
      ),
      code(
        `// src/app/layout.tsx
import '@digdir/designsystemet-css/index.css';
import 'rk-design-tokens/design-tokens-build/theme.css';
import { Source_Sans_3 } from 'next/font/google';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <body className={sourceSans3.className}>{children}</body>
    </html>
  );
}`,
        "tsx",
      ),
      // DELIBERATE divergence from the docs SPA source: the original text
      // described Vercel-hosted consumers, but nothing will be hosted on
      // Vercel (owner's decision) — rewritten hosting-neutral here. The
      // SPA still carries the old wording; fix flagged separately.
      text(
        "<h2>Automatisert arbeidsflyt for Designtokens (End-to-End)</h2><p>Denne arbeidsflyten etablerer en helautomatisert pipeline som kobler designprosessen vår direkte til live produksjonsapplikasjoner. Når en designer oppdaterer stilen i Figma, bygger, versjonerer og publiserer dette systemet automatisk en ny stilpakke til npm. Deretter varsles konsumentprosjektene våre, som oppdaterer seg selv og bygger på nytt med de nye stilene.</p>",
      ),
      text(
        "<h3>Fase 1: En Designer gjør en endring (Publisist)</h3>" +
          ul([
            boldItem("Design i Figma: En designer gjør en endring på en farge, font eller annen designtoken."),
            boldItem("Push til GitHub: Ved bruk av Token Studio-pluginet pusher designeren endringene. Dette committer automatisk de oppdaterte JSON-filene til main-branchen."),
            boldItem("Trigge Publisher Workflow: Denne pushen trigger umiddelbart GitHub Action definert i .github/workflows/publish.yml."),
            boldItem("Bygg &amp; Commit Artefakter: Workflowen kjører npm run build for å generere CSS fra JSON-filene og committer resultatene."),
            boldItem("Versjonering &amp; Release: Workflowen kjører npm version patch for å øke versjonsnummeret, lage en release-commit, og tagge den."),
            boldItem("Publiser til npm: Til slutt publiserer workflowen den nye versjonen av pakken til npm-registeret."),
          ]),
      ),
      text(
        "<h3>Fase 2: Varsling av applikasjoner (Signalet)</h3><p><strong>Send et Dispatch-signal:</strong> Etter en vellykket publisering, sender workflowen et repository_dispatch-signal til konsumentprosjekter som rk-designsystem for å varsle om den nye versjonen.</p>",
      ),
      text(
        "<h3>Fase 3: Automatisk oppdatering og redeploy (Konsumentene)</h3>" +
          ul([
            boldItem('Trigge Consumer Workflow: Dispatch-signalet starter en "Update"-workflow i konsumentprosjektene.'),
            boldItem("Oppdater Avhengigheter: Workflowen kjører npm update rk-design-tokens for å hente den siste versjonen."),
            boldItem("Commit &amp; Push Oppdateringen: Workflowen committer den oppdaterte package-lock.json-filen."),
            boldItem("Automatisk utrulling: Konsumentprosjektets deploy-løp oppdager den nye commiten og ruller ut de nye stilene."),
          ]),
      ),
    ],
  },
});

// ---------------------------------------------------------------------- fonter
articles.push({
  parentPath: "/docs",
  name: "fonter",
  displayName: "Fonter",
  publish: true,
  data: {
    title: "Fonter",
    intro:
      "<p>Røde Kors Designsystem bruker fonten Source Sans 3. For Next.js prosjekter, bruk next/font for optimal fontlasting.</p>",
    blocks: [
      text("<h2>For ikke-Next.js prosjekter</h2><p>For Vite, CRA eller andre prosjekter kan du laste fonten via HTML link-tag:</p>"),
      code(
        `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">`,
        "html",
      ),
      // The SPA renders classNameWarning as a styled callout; blocks-text
      // has no callout shape, so it maps to bold — a documented downgrade.
      text(
        "<h3>For Next.js (App Router)</h3><p>Bruk next/font for optimal fontlasting. VIKTIG: Bruk className, IKKE variable. variable oppretter bare en CSS-variabel uten å faktisk bruke fonten.</p><p><strong>Bruk sourceSans3.className på body eller main-elementet for å aktivere fonten. Unngå variable da dette ikke aktiverer fonten direkte.</strong></p>",
      ),
      code(
        `// src/app/layout.tsx
import '@digdir/designsystemet-css/index.css';
import 'rk-design-tokens/design-tokens-build/theme.css';
import { Source_Sans_3 } from 'next/font/google';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <body className={sourceSans3.className}>{children}</body>
    </html>
  );
}`,
        "tsx",
      ),
      text("<p>For Next.js Pages Router - samme prinsipp gjelder:</p>"),
      code(
        `// pages/_app.tsx
import '@digdir/designsystemet-css/index.css';
import 'rk-design-tokens/design-tokens-build/theme.css';
import { Source_Sans_3 } from 'next/font/google';
import type { AppProps } from 'next/app';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main className={sourceSans3.className}>
      <Component {...pageProps} />
    </main>
  );
}`,
        "tsx",
      ),
      text("<h2>Manuell installasjon (valgfritt)</h2><p>Legg til følgende i &lt;head&gt;-elementet:</p>"),
      text(
        "<h2>CSS-variabler</h2><p>Designsystemet bruker automatisk CSS-variabelen --ds-font-family. Du trenger ikke å spesifisere fonten manuelt i komponentene dine.</p>",
      ),
    ],
  },
});

// ---------------------------------------------------------------------- ikoner
articles.push({
  parentPath: "/docs",
  name: "ikoner",
  displayName: "Bruk av Ikoner",
  publish: true,
  data: {
    title: "Bruk av Ikoner",
    intro:
      "<p>Dette biblioteket er designet for å fungere sømløst med det offisielle ikonsettet fra NAV/Aksel.</p>",
    blocks: [
      text("<h2>Installasjon</h2>"),
      code("npm install @navikt/aksel-icons", "bash", "npm"),
      code("yarn add @navikt/aksel-icons", "bash", "yarn"),
      code("pnpm add @navikt/aksel-icons", "bash", "pnpm"),
      text(
        "<h2>Import og bruk</h2><p>Ikoner eksporteres som navngitte React-komponenter. Importer kun de ikonene du trenger (tree‑shakable):</p>",
      ),
      code(
        `import { AirplaneIcon, NewspaperIcon } from '@navikt/aksel-icons';
import { Button, Tag } from 'rk-designsystem';

export function IconsExample() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      {/* Ikon + tekst: skjul ikon for skjermlesere */}
      <Button>
        <AirplaneIcon aria-hidden style={{ marginRight: 'var(--ds-size-1, 4px)' }} />
        Fly
      </Button>

      {/* Ikon inni Tag */}
      <Tag data-color="info">
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          <NewspaperIcon aria-hidden style={{ marginRight: 'var(--ds-size-1, 4px)' }} />
          Ny
        </span>
      </Tag>
    </div>
  );
}`,
        "tsx",
      ),
      text(
        "<h2>Tilgjengelighetsguide</h2>" +
          ul([
            boldItem("Ikon + synlig tekst: sett aria-hidden på ikonet slik at skjermlesere ikke leser det opp to ganger."),
            boldItem("Ikon-kun triggere (f.eks. en knapp): legg til en beskrivende aria-label på triggeren, behold ikonet aria-hidden."),
            boldItem("Farge: ikoner arver currentColor; bruk komponentens variant/farge for å styre det (f.eks. knappevarianter, tag-farger)."),
            boldItem("Størrelse: sett fontSize (f.eks. fontSize=\"1.25rem\") eller inline style (f.eks. style=\"{ fontSize: '1.25rem' }\")."),
          ]),
      ),
      text(
        "<h2>Ytelse</h2><p>Bruk navngitte importer fra @navikt/aksel-icons for å holde pakkestørrelsen nede – ubrukte ikoner fjernes (tree-shaken) av moderne bundlere.</p>",
      ),
    ],
  },
});

// ----------------------------------------------------------------------- bidra
articles.push({
  parentPath: "/docs",
  name: "bidra",
  displayName: "Bidra til Biblioteket",
  publish: true,
  data: {
    title: "Bidra til Biblioteket",
    intro:
      "<p>Denne guiden gir et sett med standarder og beste praksis for å lage nye komponenter. Å følge disse retningslinjene sikrer at komponentbiblioteket vårt forblir konsistent, tilgjengelig og enkelt å vedlikeholde.</p>",
    blocks: [
      text(
        "<h2>Kom i gang (for bidragsytere)</h2><p>Følg disse stegene for å kjøre det lokale utviklingsmiljøet. Alle kommandoer skal kjøres fra roten av prosjektet.</p>",
      ),
      code(
        `# 1. Installer avhengigheter
pnpm i

# 2. Bygg alle pakker
pnpm build

# 3. Start den lokale Storybook-serveren
pnpm storybook`,
        "bash",
      ),
      text(
        "<h2>Kjerneprinsipper</h2><p>Hver komponent vi bygger bør følge disse kjerneprinsippene:</p>" +
          ul([
            boldItem("Tilgjengelighet (A11y): Komponenter må kunne brukes av alle, inkludert personer med nedsatt funksjonsevne. Dette betyr korrekte ARIA-attributter, tastaturnavigasjon og semantisk HTML."),
            boldItem("Gjenbrukbarhet: Komponenter bør være generiske nok til å brukes i flere kontekster uten modifikasjon."),
            boldItem("Konsistens: Komponenter skal følge våre etablerte designtokens (farger, avstander, typografi) og ha et konsistent API og struktur."),
            boldItem("Dokumentasjon: Hver komponent må dokumenteres i Storybook for å gjøre den oppdagbar og enkel å bruke for andre utviklere."),
          ]),
      ),
      text(
        "<h2>Når skal man lage en ny komponent</h2><p>Før du begynner å kode, avgjør hvilken type komponent du trenger. De fleste av våre behov faller inn i en av tre kategorier:</p>",
      ),
      text(
        "<h3>Wrapped Component (Enkel):</h3>" +
          ul([
            boldItem("Hva det er: En komponent som direkte wrapper og re-eksporterer en komponent fra @digdir/designsystemet-react uten modifikasjoner."),
            boldItem("Når den skal brukes: Når den grunnleggende Digdir-komponenten dekker behovene våre perfekt, men vi ønsker å inkludere den i vårt eget bibliotek for en konsistent importkilde."),
            boldItem("Eksempel: Buttons-komponenten er et perfekt eksempel på dette."),
          ]),
      ),
      text(
        "<h3>Wrapped Component (med stiloverstyringer):</h3>" +
          ul([
            boldItem("Hva det er: En wrappet Digdir-komponent hvor vi bruker tilpasset CSS for å justere utseendet slik at det passer bedre til Røde Kors sitt spesifikke designspråk."),
            boldItem("Når den skal brukes: Når en Digdir-komponent er funksjonelt korrekt, men trenger visuelle justeringer (f.eks. andre ikoner, border-radius, padding)."),
            boldItem("Eksempel: Alert-komponenten, som bruker composes i CSS for å arve grunnstiler og deretter påføre egne overstyringer."),
          ]),
      ),
      text(
        "<h3>Custom Component (fra bunnen):</h3>" +
          ul([
            boldItem("Hva det er: En helt ny komponent bygget når ingen eksisterende Digdir-komponent dekker kravene våre."),
            boldItem("Når den skal brukes: For unike UI-mønstre eller funksjonalitet som ikke dekkes av grunnbiblioteket."),
            boldItem("Eksempel: DateInput-komponenten er en tilpasset komponent med egen tilstand, logikk og styling."),
          ]),
      ),
      text(
        "<h2>Filstruktur for komponenter</h2><p>For å opprettholde konsistens, bør hver ny komponent følge denne filstrukturen. Lag en ny mappe under src/components/ med komponentens PascalCase-navn.</p>",
      ),
      code(
        `src/
└── components/
    └── MyNewComponent/
        ├── index.ts                 // Public API - eksporterer komponenten og props
        ├── MyNewComponent.tsx       // React komponentlogikk og JSX
        ├── MyNewComponent.stories.tsx // Storybook stories for dokumentasjon
        ├── styles.module.css        // Scoped CSS (kun for custom components)
        └── MyNewComponent.test.tsx  // (Valgfritt men anbefalt) Unit-tester`,
        undefined,
      ),
      text("<h2>Retningslinjer for koding</h2>"),
      text(
        "<h3>1. Komponentlogikk (MyNewComponent.tsx)</h3>" +
          ul([
            boldItem("TypeScript først: Alle komponenter må skrives i TypeScript. Definer et Props-interface for komponenten din, som utvider fra grunnleggende HTML-element eller Digdir-komponentprops hvis aktuelt."),
            boldItem("Forward Refs: Bruk alltid React.forwardRef for å tillate foreldrekomponenter å få en ref til det underliggende DOM-elementet."),
            "<li><strong>Tilgjengelighet er obligatorisk:</strong><ul>" +
              "<li>Bruk semantisk HTML (&lt;button&gt;, &lt;label&gt;, &lt;nav&gt;).</li>" +
              "<li>Sørg for at alle interaktive elementer kan fokuseres og betjenes med tastatur.</li>" +
              "<li>Gi aria-label for knapper som kun har ikon eller elementer hvor tekstetiketten ikke er synlig.</li>" +
              "<li>Bruk aria-invalid, aria-describedby, osv., for å kommunisere tilstand til hjelpemidler.</li>" +
              "</ul></li>",
            boldItem("Controlled vs. Uncontrolled: Hvis komponenten din har tilstand (som en input), bør den støtte både kontrollerte (value + onChange) og ukontrollerte (defaultValue) mønstre."),
            boldItem("Props-navngiving: Bruk data-* attributter for stylingvarianter (f.eks. data-size, data-color) for å samkjøre med mønstrene i våre eksisterende komponenter."),
          ]),
      ),
      text(
        "<h3>2. Styling (styles.module.css)</h3>" +
          ul([
            boldItem("CSS Modules: For tilpassede komponenter må alle stiler plasseres i en styles.module.css-fil. Dette scoper klassenavn lokalt og forhindrer globale stilkonflikter."),
            boldItem("Designtokens: Bruk alltid våre designtokens (var(--ds-...)) for farger, avstander, fonter, osv. Ikke bruk hardkodede verdier (f.eks. #FFF, 16px)."),
            boldItem("Overstyring av Wrapped Components: For wrapped components, bruk en standard CSS-fil. Bruk @layer og composes nøkkelord for å utvide grunnleggende Digdir-stiler uten å øke CSS-spesifisiteten unødvendig."),
          ]),
      ),
      text(
        "<h3>3. Dokumentasjon (MyNewComponent.stories.tsx)</h3>" +
          ul([
            "<li>Din Storybook-fil er den offisielle dokumentasjonen. Den må være tydelig og omfattende.</li>",
            boldItem("meta Object: Definer komponentens tittel, komponentreferanse, og tags: ['autodocs'] for å aktivere automatisk dokumentasjon."),
            boldItem("argTypes: Dokumenter hver enkelt prop. Gi en beskrivelse, kontrolltype (f.eks. select, boolean, text), og alternativer hvis aktuelt. Dette driver de interaktive kontrollene i Storybook."),
            boldItem("Lag flere Stories: Lag en egen story for hver nøkkeltilstand og variant av komponenten din (f.eks. Default, Disabled, WithError, WithIcon)."),
          ]),
      ),
      text(
        "<h2>Bidragsprosess</h2><ol><li><strong>Opprett en Pull Request (PR):</strong><ul>" +
          "<li><strong>Opprett en Branch:</strong> Pull de siste endringene fra main-branchen og opprett en ny feature-branch: git checkout -b feat/min-nye-komponent.</li>" +
          "<li><strong>Åpne en Draft PR:</strong> Så snart du starter, åpne en draft pull request på GitHub. Dette forhindrer dobbeltarbeid og lar andre se hva du jobber med.</li>" +
          "<li><strong>Commit endringene dine:</strong> Mens du jobber, lag små, logiske commits.</li>" +
          "<li><strong>Klar for gjennomgang:</strong> Når utviklingen er ferdig og alle automatiserte sjekker passerer, merk PR-en som \"Ready for review\" og be om en gjennomgang fra designsystem-forvalterne.</li>" +
          "</ul></li></ol>",
      ),
    ],
  },
});

for (const article of articles) {
  await postArticle(article);
}
