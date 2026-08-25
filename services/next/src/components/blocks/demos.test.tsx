import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { demos } from "./demos";

/**
 * Drift guard for the demo-registry pairing: the ComboBox options in the XP
 * mixin and the keys in demos.tsx must stay identical, but nothing in the
 * type system connects the two services. Without this test, drift fails
 * SILENTLY — an editor picks a demo and the page renders nothing. Reading
 * the sibling service's XML from the test mirrors how the design system
 * repo validates its search index against page sources.
 */
const mixinXml = readFileSync(
  join(__dirname, "../../../../xp/src/main/resources/site/mixins/blocks-demo/blocks-demo.xml"),
  "utf8",
);

describe("demo registry", () => {
  const xmlOptions = [...mixinXml.matchAll(/<option value="([^"]+)"/g)].map((m) => m[1]);

  it("offers every editor option a matching demo", () => {
    for (const option of xmlOptions) {
      expect(demos, `XML option "${option}" has no demo in demos.tsx`).toHaveProperty(option);
    }
  });

  it("has no demos the editor cannot choose", () => {
    for (const key of Object.keys(demos)) {
      expect(xmlOptions, `demo "${key}" is not offered in blocks-demo.xml`).toContain(key);
    }
  });
});
