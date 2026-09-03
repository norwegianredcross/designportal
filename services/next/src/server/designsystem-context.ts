import { storybookDocsUrl } from "@/utils";

/**
 * The component library publishes machine-readable context next to its
 * Storybook on GitHub Pages (DesignSystem/scripts/copy-ai-artifacts.mjs):
 * metadata.json, the AI guide, and ai-context.manifest.json. The manifest is
 * what this platform reads - it names the stand-alone components
 * (summary.primaryComponents), the package version and where Storybook
 * lives. This module is the only place that knows the URL and the caching
 * policy, so a block never hard-codes either.
 *
 * Why fetch at request time instead of copying the list into content?
 * A component released in rk-designsystem then appears in the catalogue on
 * its own, and one removed disappears; the docs can't drift from the npm
 * package. The hourly revalidation below keeps this to one request an hour,
 * not one per page view.
 */

const DEFAULT_CONTEXT_URL = "https://norwegianredcross.github.io/DesignSystem/storybook";

/** Base URL of the published artifacts, overridable per environment (a
 * preview deploy of the library, or a local storybook-build served on a
 * port) without touching code. Trailing slash tolerated. */
export const designsystemContextUrl = (process.env.DESIGNSYSTEM_CONTEXT_URL ?? DEFAULT_CONTEXT_URL).replace(/\/$/, "");

export type CatalogueEntry = {
  /** Exported component name, e.g. "ToggleGroup". */
  name: string;
  /** The component's docs page in Storybook. */
  docsUrl: string;
};

export type Catalogue = {
  /** rk-designsystem version the list was generated from. */
  version: string;
  storybookUrl: string;
  components: CatalogueEntry[];
};

/** The slice of ai-context.manifest.json this platform depends on. Everything
 * else in the file (rule hints, drift signals) is for coding agents. */
interface ManifestSlice {
  package?: { version?: string };
  resources?: { storybookUrl?: string };
  summary?: { primaryComponents?: string[] };
}

/**
 * Returns null instead of throwing when the manifest is unreachable or
 * malformed: a page must still render its other blocks when GitHub Pages
 * is down, and the block shows a plain fallback in that case.
 */
export async function fetchCatalogue(): Promise<Catalogue | null> {
  const url = `${designsystemContextUrl}/ai-context.manifest.json`;
  try {
    // `next.revalidate` puts the response in Next's data cache for an hour;
    // the page itself is force-dynamic, so without this every render would
    // hit GitHub Pages.
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`designsystem-context: ${url} answered ${res.status}`);
      return null;
    }
    const manifest = (await res.json()) as ManifestSlice;
    const names = manifest.summary?.primaryComponents;
    if (!Array.isArray(names) || names.length === 0) {
      console.error(`designsystem-context: ${url} has no summary.primaryComponents (library older than 1.4.1?)`);
      return null;
    }
    const storybookUrl = (manifest.resources?.storybookUrl ?? designsystemContextUrl).replace(/\/$/, "");
    return {
      version: manifest.package?.version ?? "",
      storybookUrl,
      components: names.map((name) => ({ name, docsUrl: storybookDocsUrl(storybookUrl, name) })),
    };
  } catch (error) {
    console.error(`designsystem-context: could not fetch ${url}`, error);
    return null;
  }
}
