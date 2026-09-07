import { parseChangelog, type Release } from "@/components/blocks/parseChangelog";
import { designsystemContextUrl } from "./designsystem-context";

/**
 * The library publishes CHANGELOG.md next to Storybook together with the
 * other artifacts (DesignSystem/scripts/copy-ai-artifacts.mjs), so the
 * release notes are read from the same base URL as the manifest and cached
 * the same way: one request an hour, not one per page view. Returns null
 * when the file is unreachable so the page still renders its other blocks.
 */
export async function fetchReleases(): Promise<Release[] | null> {
  const url = `${designsystemContextUrl}/CHANGELOG.md`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.error(`changelog: ${url} answered ${res.status}`);
      return null;
    }
    return parseChangelog(await res.text());
  } catch (error) {
    console.error(`changelog: could not fetch ${url}`, error);
    return null;
  }
}
