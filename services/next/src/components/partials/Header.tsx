import { getUrl, type MetaData } from "@enonic/nextjs-adapter";
import { Header as DesignSystemHeader } from "rk-designsystem";
import type { Common } from "@/types/utils";

/** Editors select main-menu pages; their content-tree order sets the order here. */
export function Header({ common, meta }: { common?: Common; meta: MetaData }) {
  const navItems = (common?.menu?.children ?? [])
    .filter((item) => item?.type === "no.rodekors.docs:page" && "data" in item && item.data?.showInMenu && item._path)
    .map((item) => ({ label: item?.displayName ?? "", href: getUrl(item?._path ?? "", meta) }));

  return (
    <DesignSystemHeader
      showUser={false}
      showSearch={false}
      showThemeToggle={true}
      navItems={navItems}
      showNavItems={navItems.length > 0}
    />
  );
}
