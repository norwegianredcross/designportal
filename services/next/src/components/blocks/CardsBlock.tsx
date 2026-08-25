import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { Card, CardBlock, type CardProps, Heading, Paragraph } from "rk-designsystem";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { forceArray, notNullOrUndefined } from "@/utils";

type CardsData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockCards" }
>;

interface CardsProps {
  data: CardsData;
  meta: MetaData;
}

/**
 * The blokk_cards design: a grid of link cards. Grid width follows the
 * editor's column choice (1-3); each card can carry a kicker, title, text,
 * image and its own theme. Links arrive pre-resolved from XP as either an
 * external url (used verbatim) or an internal contentPath, which getUrl
 * maps into this app's URL space (strips the site prefix per
 * ENONIC_MAPPINGS — the same translation the catch-all route does in
 * reverse).
 */
export function CardsBlock({ data, meta }: CardsProps) {
  const items = forceArray(data.items).filter(notNullOrUndefined);
  return (
    <section>
      {data.title ? (
        <Heading level={2} data-size="md">
          {data.title}
        </Heading>
      ) : null}
      <div
        style={{
          display: "grid",
          // The editor picked 1-3 columns; collapse to what fits on small
          // screens via auto-fit against a minimum card width.
          gridTemplateColumns: `repeat(auto-fit, minmax(240px, ${data.columns ? `${100 / data.columns}%` : "1fr"}))`,
          gap: "var(--ds-size-4)",
        }}
      >
        {items.map((item, index) => {
          // Exactly one of url/contentPath is set (or neither, for "none").
          const href = item.url ?? (item.contentPath ? getUrl(item.contentPath, meta) : undefined);
          const inner = (
            <CardBlock>
              {item.kicker ? <Paragraph data-size="xs">{item.kicker}</Paragraph> : null}
              {item.title ? (
                <Heading level={3} data-size="sm">
                  {item.title}
                </Heading>
              ) : null}
              {item.imageUrl ? (
                // Pre-scaled by XP; style guards against overflow only.
                <img src={item.imageUrl} alt="" style={{ maxWidth: "100%", height: "auto" }} />
              ) : null}
              {item.cardText ? <Paragraph data-size="sm">{item.cardText}</Paragraph> : null}
            </CardBlock>
          );
          return (
            <Card
              // biome-ignore lint/suspicious/noArrayIndexKey: card order is stable
              key={`card-${index}`}
              variant="tinted"
              data-color={(item.theme ?? "neutral") as CardProps["data-color"]}
              // asChild renders the Card as the link itself when the card
              // links somewhere - the whole surface becomes clickable.
              {...(href ? { asChild: true } : {})}
            >
              {href ? <a href={href}>{inner}</a> : inner}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
