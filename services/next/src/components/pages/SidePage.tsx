import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import type { FunctionComponent } from "react";
import { Heading, Paragraph } from "rk-designsystem";
import { blockComponents } from "@/components/blocks/registry";
import type { Block } from "@/types/blocks";
import { forceArray, isRichTextData, notNullOrUndefined } from "@/utils";
import blockStyles from "../parts/BlocksView.module.css";
import styles from "./SidePage.module.css";

interface NavChild {
  displayName?: string | null;
  _path?: string | null;
  type?: string | null;
  data?: { kicker?: string | null } | null;
}

interface SidePageProps {
  data?: {
    get?: {
      _path?: string | null;
      data?: { kicker?: string | null; title?: string | null; intro?: unknown } | null;
    } | null;
    nav?: {
      children?: (NavChild | null)[] | null;
      parent?: { _path?: string | null; children?: (NavChild | null)[] | null } | null;
    } | null;
    blocks?: unknown[] | null;
  };
  meta: MetaData;
}

/**
 * Renders a Side directly from its content data — no page composition or
 * template required. The layout mirrors the docs SPA's Code-section shell:
 * a sticky sidebar scoped to the SECTION you are in (a section page lists
 * its own children; an article lists its siblings — the tree's childOrder,
 * published pages only) beside the
 * article, whose header carries the SPA's article identity (kicker, maroon
 * display title, maroon ingress, red lead rule).
 */
const SidePage = ({ data, meta }: SidePageProps) => {
  const header = data?.get?.data;
  const currentPath = data?.get?._path;
  // Section scoping: a section page (one with page children of its own)
  // lists those children; an article lists its siblings. Only real pages
  // count — the tree also holds template folders and whatever else
  // editors keep around.
  const isPage = (item: NavChild) => item.type === "no.rodekors.docs:page";
  const ownChildren = forceArray(data?.nav?.children).filter(notNullOrUndefined).filter(isPage);
  const siblings = forceArray(data?.nav?.parent?.children).filter(notNullOrUndefined).filter(isPage);
  // An empty SECTION landing (direct child of the site) gets no sidebar at
  // all — falling back to siblings there would list the five sections,
  // duplicating the header with a shifted meaning. Same /docs coupling as
  // the queries.
  const isEmptySectionLanding = ownChildren.length === 0 && data?.nav?.parent?._path === "/docs";
  const navItems = ownChildren.length > 0 ? ownChildren : isEmptySectionLanding ? [] : siblings;
  // Group by kicker (the page's category line), preserving the editors'
  // tree order both for groups and within them; kicker-less pages gather
  // under the default heading.
  const groups: { title: string; items: typeof navItems }[] = [];
  for (const item of navItems) {
    const title = item.data?.kicker || "Dokumentasjon";
    const group = groups.find((g) => g.title === title);
    if (group) group.items.push(item);
    else groups.push({ title, items: [item] });
  }
  // The real block union rather than `{ __typename: string }`: the loose cast
  // let this index the registry with any string, which is exactly what the
  // typed registry is there to prevent.
  const blocks = forceArray(data?.blocks).filter(notNullOrUndefined) as Block[];
  return (
    <div className={styles.layout}>
      {navItems.length > 0 ? (
        <nav className={styles.sidebar} aria-label="Dokumentasjon">
          {groups.map((group) => (
            <div key={group.title} className={styles.group}>
              <p className={styles.groupTitle}>{group.title}</p>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li key={item._path}>
                    <a
                      href={getUrl(item._path ?? "", meta)}
                      className={item._path === currentPath ? styles.linkActive : styles.link}
                      aria-current={item._path === currentPath ? "page" : undefined}
                    >
                      {item.displayName}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      ) : null}
      <article className={styles.article}>
        <header>
          {header?.kicker ? <p className={styles.kicker}>{header.kicker}</p> : null}
          <Heading level={1} data-size="xl">
            {header?.title}
          </Heading>
          {isRichTextData(header?.intro) ? (
            <Paragraph data-size="lg" asChild className={styles.ingress}>
              <div>
                <RichTextView className="rk-prose" data={header.intro} meta={meta} renderMacroInEditMode={false} />
              </div>
            </Paragraph>
          ) : null}
          <hr className={styles.leadRule} />
        </header>
        {/* Same container as BlocksView so a Side and a blocks-view part space
            their blocks identically — the rhythm has one owner. */}
        <div className={blockStyles.blocks}>
          {blocks.map((block, index) => {
            // Same widening as BlocksView: the registry is correlated per
            // typename, but TypeScript cannot narrow the lookup and the union
            // together.
            const BlockView = blockComponents[block.__typename] as
              | FunctionComponent<{ data: Block; meta: MetaData }>
              | undefined;
            if (!BlockView) return null;
            return (
              // Same wrapper as BlocksView — see its module for why blocks
              // need their own boundary element.
              // biome-ignore lint/suspicious/noArrayIndexKey: block order is stable
              <div key={`block-${index}`} className={blockStyles.block} data-block={block.__typename}>
                <BlockView data={block} meta={meta} />
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
};

export default SidePage;
