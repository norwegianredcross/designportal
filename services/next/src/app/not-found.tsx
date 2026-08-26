import { Heading, Paragraph } from "rk-designsystem";

/**
 * Rendered by Next when a content path resolves to nothing (page.tsx calls
 * notFound() on the adapter's 404). Content moves in the CMS are the
 * normal cause — point people at the section landing instead of a dead
 * end. Norwegian only, like the rest of the frontend for now.
 */
export default function NotFound() {
  return (
    <main>
      <Heading level={1} data-size="xl">
        Fant ikke siden
      </Heading>
      <Paragraph data-size="lg">
        Siden kan ha blitt flyttet da dokumentasjonen ble omstrukturert. Prøv menyen øverst, eller start på{" "}
        <a className="ds-link" href="/kode">
          Kode-seksjonen
        </a>
        .
      </Paragraph>
    </main>
  );
}
