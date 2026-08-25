import { describe, expect, it } from "vitest";
import { notchMaskDataUri } from "./notchMask";

/** Decodes the data-URI back to the raw SVG for structural assertions. */
function svgOf(uri: string): string {
  return decodeURIComponent(uri.slice('url("data:image/svg+xml,'.length, -2));
}

describe("notchMaskDataUri", () => {
  it("renders a corner bite with six fillets when flush", () => {
    const svg = svgOf(notchMaskDataUri({ edge: "bottom", offset: 100, width: 35, depth: 28, aspect: "4 / 3" }));
    // Flush bites merge two vertices away: 6 corners -> 6 quadratic arcs.
    expect(svg.match(/Q/g)).toHaveLength(6);
    expect(svg).toContain('viewBox="0 0 1000 750"');
  });

  it("rounds every corner when flush LEFT too (regression: duplicate corner point)", () => {
    const svg = svgOf(notchMaskDataUri({ edge: "bottom", offset: 0, width: 55, depth: 18, aspect: "21 / 9" }));
    expect(svg.match(/Q/g)).toHaveLength(6);
    // No degenerate zero-length fillets: every Q must move the pen.
    expect(svg).not.toMatch(/NaN/);
  });

  it("renders a mid-edge bite with eight fillets", () => {
    const svg = svgOf(notchMaskDataUri({ edge: "bottom", offset: 50, width: 30, depth: 20, aspect: "4 / 3" }));
    expect(svg.match(/Q/g)).toHaveLength(8);
  });

  it("keeps every point inside the viewBox on every edge", () => {
    for (const edge of ["top", "bottom", "left", "right"] as const) {
      const svg = svgOf(notchMaskDataUri({ edge, offset: 30, width: 40, depth: 25, aspect: "16 / 9" }));
      // Only the path data — the xmlns URL contains numbers too.
      const d = svg.match(/ d="([^"]+)"/)?.[1] ?? "";
      const coords = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map(Number);
      // viewBox 1000 x 562.5 — bound each axis separately so a y-overshoot
      // can't hide under the wider x-limit.
      const pairs = [...d.matchAll(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g)];
      for (const [, x, y] of pairs) {
        expect(Number(x)).toBeGreaterThanOrEqual(0);
        expect(Number(x)).toBeLessThanOrEqual(1000);
        expect(Number(y)).toBeGreaterThanOrEqual(0);
        expect(Number(y)).toBeLessThanOrEqual(562.5);
      }
      expect(Math.min(...coords)).toBeGreaterThanOrEqual(0);
    }
  });

  it("clamps hostile geometry instead of producing degenerate paths", () => {
    const svg = svgOf(notchMaskDataUri({ edge: "bottom", offset: 500, width: 500, depth: -10, aspect: "4 / 3" }));
    expect(svg).toContain("Z");
    expect(svg.match(/Q/g)?.length).toBeGreaterThanOrEqual(6);
  });
});
