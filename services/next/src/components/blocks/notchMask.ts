/**
 * Generates the notched-image silhouette from the Design retning as an SVG
 * mask data-URI: a rounded rectangle with a rounded rectangular bite cut
 * into one edge. Replacing the earlier multi-region CSS construction with
 * one generated path is what makes the geometry fully composable — any
 * edge, any position along it, any proportions — while keeping every
 * convex corner and concave fillet correctly rounded.
 *
 * The viewBox matches the image box's aspect ratio and the element sets
 * the same ratio, so the mask stretches without distorting: the corner
 * radius is defined in viewBox units and scales uniformly with the
 * rendered size (like the Figma masks themselves do).
 */

export type NotchEdge = "top" | "bottom" | "left" | "right";

type Point = [number, number];

/** ViewBox width; height follows the aspect. */
const VIEW_W = 1000;
/** Corner radius in viewBox units (~3% of the width, near the 20px token
 * at article width). */
const RADIUS = 30;

function parseAspect(aspect: string): [number, number] {
  const [w, h] = aspect.split("/").map((part) => Number.parseFloat(part.trim()));
  if (!w || !h || Number.isNaN(w) || Number.isNaN(h)) return [4, 3];
  return [w, h];
}

/**
 * Outline for a bite cut into the BOTTOM edge, clockwise. The flush cases
 * (bite touching a corner) drop the vertices that would coincide, so the
 * rounding pass never sees zero-length edges.
 */
function bottomBitten(W: number, H: number, a1: number, a2: number, d: number): Point[] {
  const eps = 0.5;
  const pts: Point[] = [
    [0, 0],
    [W, 0],
  ];
  if (a2 < W - eps) {
    pts.push([W, H], [a2, H], [a2, H - d]);
  } else {
    pts.push([W, H - d]);
  }
  pts.push([a1, H - d]);
  if (a1 > eps) {
    pts.push([a1, H], [0, H]);
  }
  // Flush-left needs no extra point: [a1, H - d] IS the corner. (An earlier
  // version pushed it twice, and the zero-length edge left that corner
  // square — the rounding pass clamps the radius to half the edge length.)
  return pts;
}

/**
 * Every vertex is rounded with a quadratic fillet: step RADIUS back along
 * both adjacent edges and curve through the vertex. The same code rounds
 * convex corners and the bite's concave fillets — the curve direction
 * simply follows the polygon's turn.
 */
function roundedPath(rawPts: Point[]): string {
  // Defensive dedupe: coincident consecutive points would make the fillet
  // radius collapse to zero (and divide by zero in the unit vectors).
  const pts = rawPts.filter((p, i) => {
    const prev = rawPts[(i - 1 + rawPts.length) % rawPts.length];
    return Math.hypot(p[0] - prev[0], p[1] - prev[1]) > 0.01;
  });
  const n = pts.length;
  const parts: string[] = [];
  const fmt = (v: number) => (Math.round(v * 10) / 10).toString();
  for (let i = 0; i < n; i++) {
    const p = pts[i];
    const prev = pts[(i - 1 + n) % n];
    const next = pts[(i + 1) % n];
    const lin = Math.hypot(p[0] - prev[0], p[1] - prev[1]);
    const lout = Math.hypot(next[0] - p[0], next[1] - p[1]);
    const rr = Math.min(RADIUS, lin / 2, lout / 2);
    const pA: Point = [p[0] - ((p[0] - prev[0]) / lin) * rr, p[1] - ((p[1] - prev[1]) / lin) * rr];
    const pB: Point = [p[0] + ((next[0] - p[0]) / lout) * rr, p[1] + ((next[1] - p[1]) / lout) * rr];
    parts.push(i === 0 ? `M${fmt(pA[0])} ${fmt(pA[1])}` : `L${fmt(pA[0])} ${fmt(pA[1])}`);
    parts.push(`Q${fmt(p[0])} ${fmt(p[1])} ${fmt(pB[0])} ${fmt(pB[1])}`);
  }
  return `${parts.join("")}Z`;
}

export interface NotchOptions {
  /** Which edge the bite cuts into. */
  edge: NotchEdge;
  /** 0-100: where along the edge the bite sits (0 flush with the left/top
   * corner, 100 flush with the right/bottom corner, 50 centered). */
  offset: number;
  /** Bite extent along the edge, % of the edge length. */
  width: number;
  /** How deep the bite cuts into the image, % of the other dimension. */
  depth: number;
  /** The image box's aspect ratio, e.g. "4 / 3". */
  aspect: string;
}

export function notchMaskDataUri({ edge, offset, width, depth, aspect }: NotchOptions): string {
  const [aw, ah] = parseAspect(aspect);
  const W = VIEW_W;
  const H = (W * ah) / aw;
  const vertical = edge === "left" || edge === "right";
  const edgeLen = vertical ? H : W;
  const bw = (Math.min(80, Math.max(5, width)) / 100) * edgeLen;
  const d = (Math.min(60, Math.max(5, depth)) / 100) * (vertical ? W : H);
  // The offset positions the bite within the room it has left on the edge,
  // so 0/100 are exactly flush and everything between slides linearly.
  const start = (Math.min(100, Math.max(0, offset)) / 100) * (edgeLen - bw);
  // All edges reuse the bottom-edge builder through coordinate swaps: build
  // in a space where the bitten edge IS the bottom, then map points back.
  const raw = vertical ? bottomBitten(H, W, start, start + bw, d) : bottomBitten(W, H, start, start + bw, d);
  const pts: Point[] = raw.map(([u, v]) => {
    if (edge === "bottom") return [u, v];
    if (edge === "top") return [u, H - v];
    if (edge === "right") return [v, u];
    return [W - v, u]; // left
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${roundedPath(pts)}" fill="#000"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
