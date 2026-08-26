import { getUrl } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import RichTextView from "@enonic/nextjs-adapter/views/RichTextView";
import { Heading, Paragraph } from "rk-designsystem";
import { blockComponents } from "@/components/blocks/registry";
import { forceArray, isRichTextData, notNullOrUndefined } from "@/utils";
import styles from "./SidePage.module.css";

interface SidePageProps {
  data?: {
    get?: {
      _path?: string | null;
      data?: { kicker?: string | null; title?: string | null; intro?: unknown } | null;
    } | null;
    nav?: {
      children?:
        | ({
            displayName?: string | null;
            _path?: string | null;
            type?: string | null;
            data?: { kicker?: string | null } | null;
          } | null)[]
        | null;
    } | null;
    blocks?: unknown[] | null;
  };
  meta: MetaData;
}

/**
 * Renders a Side directly from its content data — no page composition or
 * template required. The layout mirrors the docs SPA's Code-section shell:
 * a sticky sidebar (which IS the content tree — the site's children in
 * the site's childOrder, published pages only) beside the
 * article, whose header carries the SPA's article identity (kicker, maroon
 * display title, maroon ingress, red lead rule).
 */
const SidePage = ({ data, meta }: SidePageProps) => {
  const header = data?.get?.data;
  const currentPath = data?.get?._path;
  const navItems = forceArray(data?.nav?.children)
    .filter(notNullOrUndefined)
    // Only real pages belong in the nav — the tree also holds template
    // folders and whatever else editors keep under the site.
    .filter((item) => item.type === "no.rodekors.docs:page");
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
  const blocks = forceArray(data?.blocks).filter(notNullOrUndefined) as Array<{
    __typename: string;
  }>;
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
        {blocks.map((block, index) => {
          const Block = blockComponents[block.__typename];
          if (!Block) return null;
          // biome-ignore lint/suspicious/noArrayIndexKey: block order is stable
          return <Block key={`block-${index}`} data={block} meta={meta} />;
        })}
      </article>
    </div>
  );
};

export default SidePage;
