import type { GetPageDefaultQuery } from "@/types/queries";

export type PageLayout = NonNullable<NonNullable<GetPageDefaultQuery["guillotine"]>["layout"]>;
export type GeneratedSectionSettings = Pick<PageLayout, "title" | "intro" | "showSearch" | "maxReleases">;
