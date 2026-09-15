import { forceArray } from "/lib/rodekors/arrays";

/** Stored XP node components, as consumed by Guillotine's components field. */
export function standardPageComponents() {
  return [
    { type: "page", path: "/", page: { descriptor: "no.rodekors.docs:default", config: {} } },
    { type: "part", path: "/header/0", part: { descriptor: "no.rodekors.docs:content-header", config: {} } },
    { type: "part", path: "/main/0", part: { descriptor: "no.rodekors.docs:blocks-view", config: {} } },
  ];
}

/** Only initialize the empty template shipped with the original preview.
 * An editor's existing composition always wins, including a single stored component.
 */
export function initializePageTemplate<T extends { components?: unknown }>(node: T): T {
  if (forceArray(node.components).length > 0) return node;
  return { ...node, components: standardPageComponents() };
}
