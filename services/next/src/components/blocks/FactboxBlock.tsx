import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import { Card, CardBlock, type CardProps, Heading } from "rk-designsystem";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { isRichTextData } from "@/utils";

type FactboxData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockFactbox" }
>;

interface FactboxProps {
  data: FactboxData;
  meta: MetaData;
}

/**
 * The blokk_fakta design: a tinted panel that sets highlighted content apart
 * from the body text. The editor's theme choice arrives as a design-system
 * color scope name (configured in the XP app config), so passing it straight
 * to data-color makes the design tokens do the theming — no color logic here.
 */
export function FactboxBlock({ data, meta }: FactboxProps) {
  return (
    <Card
      variant="tinted"
      // The theme value is whatever scope names the XP app config offers, so
      // it arrives as a plain string; the cast keeps this compiling even when
      // the design system's Color union is fully enforced. An unknown scope
      // simply renders unthemed (no CSS match) rather than crashing.
      data-color={(data.theme ?? "neutral") as CardProps["data-color"]}
    >
      <CardBlock>
        {data.title ? (
          <Heading level={2} data-size="sm">
            {data.title}
          </Heading>
        ) : null}
        {isRichTextData(data.text) ? <RichTextView data={data.text} meta={meta} renderMacroInEditMode={false} /> : null}
      </CardBlock>
    </Card>
  );
}
