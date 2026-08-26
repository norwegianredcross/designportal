/**
 * Seeds the "Kom i gang" article — the first real page migrated from the
 * docs SPA (DesignSystem repo, src/pages/Code/index.tsx GettingStartedContent
 * + the code.getStarted translation strings).
 *
 * The SPA page is hand-translated here into the CMS block model: section
 * headings and prose become blocks-text (HtmlArea HTML), code samples become
 * blocks-code, and the article ingress becomes the page's intro field. The
 * option-set shape (`_selected` + fields nested under the option name) is
 * exactly what Content Studio itself stores, so the seeded article is
 * indistinguishable from one an editor built by hand.
 *
 * Run with the XP sandbox up and the import token configured:
 *   DOCS_IMPORT_TOKEN=<token from no.rodekors.docs.cfg> node scripts/seed-kom-i-gang.mjs
 */

import { code, postArticle, text } from "./seed-lib.mjs";

const article = {
  parentPath: "/docs",
  name: "kom-i-gang",
  displayName: "Kom i gang",
  // Published directly so the rendered page can be verified on the public
  // frontend right away; the article remains fully editable in Content Studio.
  publish: true,
  data: {
    // Sidebar category (groups pages under one heading) and the header
    // menu flag — the same fields editors control in Content Studio.
    kicker: "Oversikt",
    showInMenu: true,
    title: "Kom i gang",
    intro: "<p>For å ta i bruk Røde Kors Designsystem i din Next.js (eller annen React) applikasjon:</p>",
    blocks: [
      text(
        "<h2>1. Installasjon</h2>" +
          "<p>Installer designsystemet:</p>" +
          '<p><a href="https://github.com/norwegianredcross/DesignSystem">Gå til GitHub Repository</a></p>',
      ),
      code("npm install rk-designsystem", "bash", "npm"),
      text(
        "<p><strong>Viktig:</strong> Bruk className, IKKE variable. variable oppretter bare en CSS-variabel uten å faktisk bruke fonten.</p>",
      ),

      text(
        "<h2>2. Sett opp layout med font</h2>" +
          "<p>Det enkleste oppsettet er én import som laster alt: Digdir-basen, Røde Kors-temaet, komponentstilene og Source Sans 3:</p>",
      ),
      code("import 'rk-designsystem/styles';", "ts"),
      text(
        "<p>Vil du heller styre fonten selv med next/font i Next.js, importer stilene enkeltvis — husk da også komponentstilene (rk-designsystem.css):</p>" +
          "<p><strong>Bruk sourceSans3.className på body-elementet for å aktivere fonten.</strong></p>",
      ),
      code(
        `import '@digdir/designsystemet-css/index.css';
import 'rk-design-tokens/design-tokens-build/theme.css';
import 'rk-designsystem/dist/rk-designsystem.css'; // komponentstilene
import { Source_Sans_3 } from 'next/font/google';

const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body className={sourceSans3.className}>{children}</body>
    </html>
  );
}`,
        "tsx",
        "Eksempel for Next.js (App Router – src/app/layout.tsx)",
      ),
      code(
        `import '@digdir/designsystemet-css/index.css';
import 'rk-design-tokens/design-tokens-build/theme.css';
import 'rk-designsystem/dist/rk-designsystem.css'; // komponentstilene
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
        "Eksempel for Next.js (Pages Router – pages/_app.tsx)",
      ),

      text("<h2>3. Bruk av komponenter</h2><p>Nå kan du importere og bruke komponenter direkte:</p>"),
      code(
        `import { Alert } from 'rk-designsystem'; // Importer nødvendige komponenter

function MyComponent() {
  return (
    <Alert data-color="info" title="Til informasjon" titleLevel={2}>
      Dette er en informasjonsmelding fra Røde Kors Designsystem.
    </Alert>
  );
}`,
        "tsx",
        "3.1 Importer og bruk Røde Kors Designsystem-komponenter",
      ),
      code(
        `'use client'; // Husk 'use client' for interaktive komponenter i App Router
import React from 'react';
import { Alert } from 'rk-designsystem'; // Importer komponentene du trenger

export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">
        Røde Kors Designsystem Eksempel
      </h1>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Varsler</h2>
        {/* Røde Kors Designsystem Varsler */}
        <Alert data-color="success">
          <p>
            Velkommen! Denne meldingen er stylet med det offisielle Røde Kors-temaet.
          </p>
        </Alert>
        <Alert data-color="warning" className="mt-4">
          <p>
            Viktig informasjon ved bruk av det offisielle Røde Kors-temaet.
          </p>
        </Alert>
      </section>
      {/* Flere Røde Kors-komponenter kan legges til her etter behov */}
    </div>
  );
}`,
        "tsx",
        "3.2 Eksempel på bruk i en Next.js-side",
      ),
      text(
        "<p>Utseendet til alle komponenter styres fullt ut av pakken rk-design-tokens. For å motta visuelle oppdateringer til merkevaretemaet (som en ny primærfarge), oppdaterer du ganske enkelt pakken til siste versjon:</p>",
      ),
      code("npm update rk-design-tokens", "bash"),
    ],
  },
};

await postArticle(article);
