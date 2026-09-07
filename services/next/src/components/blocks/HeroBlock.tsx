import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Button, Heading, Paragraph, Tag } from "rk-designsystem";
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
 * The landing hero, after the Designretning board's own hero (Figma
 * Design-retning 2436:44864): a cream panel whose bottom-right corner is
 * stepped away; kicker, display title, lead and up to two calls to action
 * on the left; optionally a photograph filling the right half, the way the
 * board's front page runs its hero photo to the edge. The board sets the
 * cross mark in the cut; here the cut stays empty by decision, the stepped
 * outline alone being the panel's signature.
 *
 * The badge (release tag + meta word) sits as a small stamp above the
 * kicker. It used to live in a notch cut from the top-left corner; the
 * direction puts the only cut bottom-right.
 */
export function HeroBlock({ data, meta }: HeroProps) {
  const actions = forceArray(data.actions)
    .filter(notNullOrUndefined)
    .filter((action) => action.linkText);
  // Exactly one of url/contentPath is set per action (or neither, for a
  // button with no target, which we drop rather than render as dead).
  const hrefOf = (action: (typeof actions)[number]) =>
    action.url ?? (action.contentPath ? getUrl(action.contentPath, meta) : undefined);
  const linked = actions.filter((action) => hrefOf(action));

  const image = data.image && "imageUrl" in data.image && data.image.imageUrl ? data.image : null;

  // At display size the balanced two-line wrap splits the organisation's
  // name ("Ett system for Røde / Kors sine digitale flater"); a non-breaking
  // space binds the pair wherever an editor types it.
  const title = data.title?.replace(/Røde Kors/g, "Røde Kors");

  return (
    <section className={`${styles.panel}${image ? ` ${styles.panelWithPhoto}` : ""}`}>
      <div className={styles.text}>
        {data.badge || data.badgeMeta ? (
          <div className={styles.stamp}>
            {data.badge ? <Tag data-size="sm">{data.badge}</Tag> : null}
            {data.badgeMeta ? <span className={styles.stampMeta}>{data.badgeMeta}</span> : null}
          </div>
        ) : null}
        {data.kicker ? (
          <Paragraph data-size="lg" className={styles.kicker}>
            {data.kicker}
          </Paragraph>
        ) : null}
        <Heading level={1} className={styles.title}>
          {title}
        </Heading>
        {data.lead ? (
          <Paragraph data-size="lg" className={styles.lead}>
            {data.lead}
          </Paragraph>
        ) : null}
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
      </div>

      {image ? (
        // A wrapper sized by the grid, with the picture filling it: an <img>
        // placed directly in the grid would size the row from its own aspect
        // ratio and a portrait upload would stretch the whole panel.
        <div className={styles.photoFrame}>
          <img
            className={styles.photo}
            src={image.imageUrl ?? undefined}
            srcSet={image.imageUrl2x ? `${image.imageUrl} 1x, ${image.imageUrl2x} 2x` : undefined}
            // The media item's own alt text; empty means decorative.
            alt={image.data?.altText ?? ""}
          />
        </div>
      ) : null}

      {/* The step cut out of the bottom-right corner, painted in the page
          background so it reads as a cut rather than a box. */}
      <div className={styles.cut} aria-hidden="true" />
    </section>
  );
}
