/**
 * Reads and organises the design tokens the site is running on.
 *
 * rk-designsystem/styles.css (loaded in app/layout.tsx) defines every token
 * as a "--ds-*" custom property on :root. Instead of maintaining a copy of
 * that list as content, the token browser reads the computed values off the
 * document in the reader's browser, so the page always shows the token
 * package the site actually uses. Colocated with the block that uses it, the
 * way the CMS project keeps block helpers. This module holds that read (readThemeTokens,
 * browser-only) and the pure part - naming, categorising and ordering -
 * ported from the old docs SPA's Tokens page, kept free of React so the
 * stories can assert on it directly.
 */

export type TokenCategory = "colors" | "sizes" | "typography" | "borders" | "shadows" | "effects" | "other";

export interface DesignToken {
  /** Full custom property name, e.g. "--ds-color-neutral-text-default". */
  name: string;
  /** Computed value, e.g. "#1b1f24" or "0.5rem". */
  value: string;
  category: TokenCategory;
  /** Second level: the colour scope ("neutral"), "spacing", "font", ... */
  group: string;
  /** Third level inside colours: base / text / background / border / surface ... */
  subGroup: string;
}

export interface TokenGroup {
  name: string;
  tokens: DesignToken[];
}

/** Display order of the categories, and their Norwegian labels. */
export const CATEGORY_ORDER: TokenCategory[] = [
  "colors",
  "sizes",
  "typography",
  "borders",
  "shadows",
  "effects",
  "other",
];

export const CATEGORY_LABELS: Record<TokenCategory, string> = {
  colors: "Farger",
  sizes: "Størrelser og avstand",
  typography: "Typografi",
  borders: "Kantlinjer",
  shadows: "Skygger",
  effects: "Effekter",
  other: "Annet",
};

// Colour token names read "--ds-color-<scope>-<role>-<variant>", where the
// scope can itself contain dashes ("primary-color-red"). The role words are
// a closed set, so the first one found marks where the scope ends.
const COLOR_ROLES = new Set([
  "base",
  "text",
  "background",
  "border",
  "surface",
  "focus",
  "link",
  "hover",
  "active",
  "visited",
  "subtle",
  "default",
  "strong",
  "inner",
  "outer",
]);

/** Compares so embedded numbers sort numerically: size-2 before size-10. */
const naturalCompare = (a: string, b: string): number =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

/** Puts one custom property into its category/group/subGroup. */
export function classifyToken(name: string, value: string): DesignToken {
  const parts = name.replace("--ds-", "").split("-");
  const head = parts[0] ?? "";
  let category: TokenCategory = "other";
  let group = "";
  let subGroup = "";

  if (head === "color") {
    category = "colors";
    const roleIndex = parts.findIndex((part, index) => index > 0 && COLOR_ROLES.has(part));
    if (roleIndex > 0) {
      group = parts.slice(1, roleIndex).join("-");
      subGroup = parts[roleIndex] ?? "";
    } else {
      group = parts[1] ?? "";
      subGroup = parts[2] ?? "";
    }
  } else if (head === "size" || head === "spacing") {
    category = "sizes";
    group = head === "size" ? "spacing" : head;
  } else if (head === "font" || head === "body" || head === "heading") {
    category = "typography";
    group = head;
    subGroup = parts[1] ?? "";
  } else if (head === "border") {
    category = "borders";
    group = parts[1] ?? "";
  } else if (head === "shadow") {
    category = "shadows";
    group = "shadows";
  } else if (head === "opacity") {
    category = "effects";
    group = head;
  }

  return { name, value, category, group: group || "general", subGroup };
}

/**
 * Every "--ds-*" property with a value on the root element. Only runs in a
 * browser; the token browser calls it from an effect after hydration.
 */
export function readThemeTokens(root: Element = document.documentElement): DesignToken[] {
  const computed = getComputedStyle(root);
  const tokens: DesignToken[] = [];
  for (let i = 0; i < computed.length; i++) {
    const property = computed[i];
    if (!property?.startsWith("--ds-")) continue;
    const value = computed.getPropertyValue(property).trim();
    if (value) tokens.push(classifyToken(property, value));
  }
  return tokens;
}

// Reading order within a colour scope and within a role, so "base" comes
// before "text" and "default" before "hover", the way the theme is read.
const ROLE_ORDER: Record<string, number> = { base: 0, text: 1, background: 2, surface: 3, border: 4 };
const VARIANT_ORDER: Record<string, number> = { default: 0, hover: 1, focus: 2, active: 3 };

const variantOf = (token: DesignToken): string => {
  if (!token.subGroup) return "";
  const parts = token.name.replace("--ds-", "").split("-");
  const roleIndex = parts.findIndex((part, index) => index > 0 && part === token.subGroup);
  return roleIndex >= 0 ? parts.slice(roleIndex + 1).join("-") : "";
};

const compareTokens = (a: DesignToken, b: DesignToken): number => {
  const role = (ROLE_ORDER[a.subGroup] ?? 999) - (ROLE_ORDER[b.subGroup] ?? 999);
  if (role !== 0) return role;
  const variant = (VARIANT_ORDER[variantOf(a)] ?? 999) - (VARIANT_ORDER[variantOf(b)] ?? 999);
  if (variant !== 0) return variant;
  return naturalCompare(a.name, b.name);
};

// Groups the reader expects first: the brand red before the neutrals before
// the semantic colours; font before body before heading.
const GROUP_ORDER: Partial<Record<TokenCategory, string[]>> = {
  colors: [
    "primary-color-red",
    "neutral",
    "success",
    "danger",
    "warning",
    "info",
    "accent",
    "brand1",
    "brand2",
    "brand3",
  ],
  typography: ["font", "body", "heading"],
  sizes: ["spacing", "size"],
};

const compareGroups = (category: TokenCategory, a: TokenGroup, b: TokenGroup): number => {
  const order = GROUP_ORDER[category] ?? [];
  const ia = order.indexOf(a.name);
  const ib = order.indexOf(b.name);
  if (ia !== -1 || ib !== -1) {
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  }
  // Unlisted colour scopes: full palettes (those with a "base" role) before
  // the odd standalone tokens.
  if (category === "colors") {
    const aBase = a.tokens.some((t) => t.subGroup === "base");
    const bBase = b.tokens.some((t) => t.subGroup === "base");
    if (aBase !== bBase) return aBase ? -1 : 1;
  }
  return a.name.localeCompare(b.name);
};

/** "primary-color-red" -> "Primary Color Red", for group headings. */
export const formatGroupName = (name: string): string =>
  name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

/** Tokens bucketed by category, each category an ordered list of groups. */
export function groupTokens(tokens: DesignToken[]): Partial<Record<TokenCategory, TokenGroup[]>> {
  const byCategory: Partial<Record<TokenCategory, Map<string, TokenGroup>>> = {};
  for (const token of tokens) {
    let groups = byCategory[token.category];
    if (!groups) {
      groups = new Map();
      byCategory[token.category] = groups;
    }
    const group = groups.get(token.group) ?? { name: token.group, tokens: [] };
    group.tokens.push(token);
    groups.set(token.group, group);
  }
  const result: Partial<Record<TokenCategory, TokenGroup[]>> = {};
  for (const category of CATEGORY_ORDER) {
    const groups = byCategory[category];
    if (!groups) continue;
    const list = [...groups.values()];
    for (const group of list) group.tokens.sort(compareTokens);
    list.sort((a, b) => compareGroups(category, a, b));
    result[category] = list;
  }
  return result;
}
