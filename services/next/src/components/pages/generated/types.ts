import type { GetSidePageQuery } from "@/types/queries";

export type PageLayout = NonNullable<NonNullable<GetSidePageQuery["guillotine"]>["layout"]>;
export type GeneratedSectionSettings = Pick<PageLayout, "title" | "intro" | "showSearch" | "maxReleases">;
