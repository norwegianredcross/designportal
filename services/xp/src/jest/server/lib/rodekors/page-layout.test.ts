import { getPageLayout, migratePageLayout, type PageLayoutData } from "/lib/rodekors/page-layout";
import { describe, expect, test } from "@jest/globals";

const before = { _selected: "blocks-text", "blocks-text": { text: "Before" } } as const;
const after = { _selected: "blocks-code", "blocks-code": { code: "after()" } } as const;

describe("generated page layouts", () => {
  test.each([
    "components",
    "changelog",
    "tokens",
  ] as const)("migrates %s without losing surrounding content", (kind) => {
    const name = `blocks-${kind}` as const;
    const data: PageLayoutData = {
      blocks: [before, { _selected: name, [name]: { title: "List", maxReleases: 3, showSearch: false } }, after],
    };
    const migrated = migratePageLayout(data);
    expect(getPageLayout(migrated)).toEqual({
      kind,
      title: "List",
      maxReleases: 3,
      showSearch: false,
      before: [before],
      after: [after],
    });
    expect(migratePageLayout(migrated)).toBe(migrated);
    expect(data.blocks).toHaveLength(3);
  });

  test("ordinary pages and single stored blocks need no migration", () => {
    const data = { title: "Article", blocks: before };
    expect(migratePageLayout(data)).toBe(data);
    expect(getPageLayout(data)).toEqual({ kind: "article", before: [before], after: [] });
  });

  test("new pages render content from both regions", () => {
    expect(
      getPageLayout({ pageView: { _selected: "tokens", tokens: {} }, blocks: before, afterContent: { blocks: after } }),
    ).toEqual({ kind: "tokens", before: [before], after: [after] });
  });

  test("refuses ambiguous legacy pages without dropping lists", () => {
    const legacy = { _selected: "blocks-tokens", "blocks-tokens": {} } as const;
    expect(() => migratePageLayout({ blocks: [legacy, legacy] })).toThrow("multiple generated sections");
    expect(() => migratePageLayout({ blocks: legacy, pageView: { _selected: "components", components: {} } })).toThrow(
      "multiple generated sections",
    );
  });

  test("keeps extra page fields and existing trailing content", () => {
    const migrated = migratePageLayout({
      title: "Keep",
      showInMenu: true,
      blocks: [{ _selected: "blocks-tokens" as const, "blocks-tokens": {} }, before],
      afterContent: { blocks: after },
    });
    expect(migrated).toMatchObject({ title: "Keep", showInMenu: true, afterContent: { blocks: [before, after] } });
  });
});
