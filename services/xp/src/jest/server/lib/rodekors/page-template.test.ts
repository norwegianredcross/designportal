import { initializePageTemplate } from "/lib/rodekors/page-template";
import { describe, expect, test } from "@jest/globals";

describe("standard page template", () => {
  test("initializes header/main parts without changing the template's identity or content", () => {
    const template = { _id: "existing", data: { supports: "no.rodekors.docs:page" } };
    const result = initializePageTemplate({ ...template, components: [] });
    expect(result).toMatchObject(template);
    expect(result.components).toEqual([
      { type: "page", path: "/", page: { descriptor: "no.rodekors.docs:default", config: {} } },
      { type: "part", path: "/header/0", part: { descriptor: "no.rodekors.docs:content-header", config: {} } },
      { type: "part", path: "/main/0", part: { descriptor: "no.rodekors.docs:blocks-view", config: {} } },
    ]);
    expect(initializePageTemplate(result)).toBe(result);
  });

  test.each([
    [{ type: "page", path: "/", page: { descriptor: "custom:page" } }],
    { type: "page" },
  ])("preserves an existing editor composition", (components) => {
    const template = { components };
    expect(initializePageTemplate(template)).toBe(template);
  });
});
