import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, GraphicElement, Heading, Paragraph, Tag } from "rk-designsystem";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { forceArray, notNullOrUndefined } from "@/utils";
import styles from "./HeroBlock.module.css";

type HeroData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockHero" }
>;

interface HeroProps {
  data: HeroData;
  meta: MetaData;
}

/**
 * The landing hero, carried over from the docs SPA's Home page: a cream
 * panel with the "krysset" step cut out of its top-left corner, holding a
 * stamp in that notch, then kicker, display title, lead and up to two calls
 * to action.
 */
export function HeroBlock({ data, meta }: HeroProps) {
  const actions = forceArray(data.actions)
    .filter(notNullOrUndefined)
    .filter((action) => action.linkText);
  // Exactly one of url/contentPath is set per action (or neither, for a
  // button with no target — which we drop rather than render as dead).
  const hrefOf = (action: (typeof actions)[number]) =>
    action.url ?? (action.contentPath ? getUrl(action.contentPath, meta) : undefined);
  const linked = actions.filter((action) => hrefOf(action));
  const hasNotch = Boolean(data.badge || data.badgeMeta);
  // At display size the balanced two-line wrap splits the organisation's name
  // ("Ett system for Røde / Kors sine digitale flater"), which no measure
  // fixes — text-wrap: balance picks that break at every width the panel
  // allows. A non-breaking space binds the pair, so the line falls somewhere
  // else no matter what an editor types in the title field.
  const title = data.title?.replace(/Røde Kors/g, "Røde\u00A0Kors");

  return (
    <section className={`${styles.panel}${hasNotch ? "" : ` ${styles.panelPlain}`}`}>
      {hasNotch ? (
        <div className={styles.notch}>
          {data.badge ? <Tag data-size="sm">{data.badge}</Tag> : null}
          {data.badgeMeta ? <span className={styles.notchMeta}>{data.badgeMeta}</span> : null}
        </div>
      ) : null}

      {data.kicker ? <span className={styles.kicker}>{data.kicker}</span> : null}

      <Heading level={1} className={styles.title}>
        {title}
      </Heading>

      {data.lead ? (
        <Paragraph data-size="lg" className={styles.lead}>
          {data.lead}
        </Paragraph>
      ) : null}

      {/* The rød tråd, in the corner the board puts it: on the direction's own
          hero (Figma 2436:44864) the panel's bottom-right is stepped away and
          the cross sits in the gap. Ours keeps its step top-left, where the
          version stamp lives, so the mark takes the opposite corner.
          GraphicElement is the library's own brand-shape component — position
          rather than CSS rotation, per its docs. */}
      <GraphicElement shape="cross" position="bottom-right" size="lg" className={styles.cross} />

      {linked.length > 0 ? (
        <div className={styles.actions}>
          {linked.map((action, index) => (
            <Button
              key={hrefOf(action)}
              asChild
              data-size="lg"
              // First action is the primary call; any second one is secondary.
              variant={index === 0 ? "primary" : "secondary"}
            >
              <a href={hrefOf(action)}>
                {action.linkText}
                {index === 0 ? <ArrowRightIcon aria-hidden /> : null}
              </a>
            </Button>
          ))}
        </div>
      ) : null}
    </section>
  );
}
