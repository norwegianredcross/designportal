import type { MetaData } from "@enonic/nextjs-adapter";
import { getUrl } from "@enonic/nextjs-adapter";
import { forceArray, notNullOrUndefined } from "@/utils";
import styles from "./Sidebar.module.css";

interface NavChild {
  displayName?: string | null;
  _path?: string | null;
  type?: string | null;
  data?: { kicker?: string | null } | null;
}

interface SidebarProps {
  currentPath?: string | null;
  nav?: {
    children?: (NavChild | null)[] | null;
    parent?: { _path?: string | null; children?: (NavChild | null)[] | null } | null;
  } | null;
  meta: MetaData;
}

export function Sidebar({ currentPath, nav, meta }: SidebarProps) {
  // Section scoping: a section page (one with page children of its own)
  // lists those children; an article lists its siblings. Only real pages
  // count — the tree also holds template folders and whatever else
  // editors keep around.
  const isPage = (item: NavChild) => item.type === "no.rodekors.docs:page";
  const ownChildren = forceArray(nav?.children).filter(notNullOrUndefined).filter(isPage);
  const siblings = forceArray(nav?.parent?.children).filter(notNullOrUndefined).filter(isPage);
  // An empty SECTION landing (direct child of the site) gets no sidebar at
  // all — falling back to siblings there would list the five sections,
  // duplicating the header with a shifted meaning. Same /docs coupling as
  // the queries.
  const isEmptySectionLanding = ownChildren.length === 0 && nav?.parent?._path === "/docs";
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
  return navItems.length > 0 ? (
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
  ) : null;
}
