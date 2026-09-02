import type { ReactNode } from "react";
import { Alert, Badge, Button, Card, CardBlock, Details, Paragraph, Tag } from "rk-designsystem";
import { DetailsContent, DetailsSummary } from "@/components/partials/Details";
import styles from "./demos.module.css";

/**
 * The curated demo registry: every demo an editor can choose in the
 * Komponentdemo block. Keys MUST match the ComboBox option values in the
 * XP mixin (site/mixins/blocks-demo/blocks-demo.xml) — adding a demo means
 * one option there and one entry here. All demos are server-rendered
 * design system components; any interactivity they have (like Details
 * opening) is the library's own and hydrates by itself.
 */
export const demos: Record<string, ReactNode> = {
  "button-variants": (
    <div className={styles.row}>
      <Button variant="primary">Primær</Button>
      <Button variant="secondary">Sekundær</Button>
      <Button variant="tertiary">Tertiær</Button>
    </div>
  ),
  "alert-severities": (
    <div className={styles.stack}>
      <Alert data-color="info">Informasjon til leseren.</Alert>
      <Alert data-color="warning">Noe krever oppmerksomhet.</Alert>
      <Alert data-color="danger">Noe gikk galt.</Alert>
    </div>
  ),
  /* All four scopes, not a sample of three. The set is not arbitrary: it is
     exactly what the editor's theme selector offers, which the lib's
     theme-selector service builds from the app's `themes` config
     (no.rodekors.docs.cfg). Showing three of four made the demo look like a
     taster and left the panel half empty; showing the whole set makes it a
     statement of what the system actually themes through. Keep in step with
     that config. */
  "card-scopes": (
    <div className={styles.row}>
      <Card variant="tinted" data-color="primary-color-red">
        <CardBlock>
          <Paragraph data-size="sm">primary-color-red</Paragraph>
        </CardBlock>
      </Card>
      <Card variant="tinted" data-color="neutral">
        <CardBlock>
          <Paragraph data-size="sm">neutral</Paragraph>
        </CardBlock>
      </Card>
      <Card variant="tinted" data-color="additional-color-ocean">
        <CardBlock>
          <Paragraph data-size="sm">additional-color-ocean</Paragraph>
        </CardBlock>
      </Card>
      <Card variant="tinted" data-color="additional-color-jungle">
        <CardBlock>
          <Paragraph data-size="sm">additional-color-jungle</Paragraph>
        </CardBlock>
      </Card>
    </div>
  ),
  "details-basic": (
    <Details>
      <DetailsSummary>Hva er design tokens?</DetailsSummary>
      <DetailsContent>
        <Paragraph data-size="sm">Felles variabler for farger, typografi og avstander.</Paragraph>
      </DetailsContent>
    </Details>
  ),
  "tag-badge": (
    <div className={styles.rowCentered}>
      <Tag>Emneknagg</Tag>
      <Badge count={4} />
    </div>
  ),
};
