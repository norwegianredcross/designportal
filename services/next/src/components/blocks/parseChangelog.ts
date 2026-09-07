/**
 * Parses the component library's CHANGELOG.md into releases. Ported from
 * the old docs site's "Hva er nytt" page; pure and colocated with the block
 * so the stories can feed it a fixture without any network.
 *
 * The file is written by the library's release workflow only, in a fixed
 * shape:
 *
 *   ## 1.4.1 (2026-09-03)
 *
 *   - chore(lint): fjern fire døde tilordninger (#164) (4e9cd3ad)
 *
 * Most bullets are conventional commits, `type(scope)!: message (#PR) (sha)`:
 * the type becomes a small tag, the PR number a link, and the commit hash is
 * dropped as noise. Older releases have plain messages without a type; those
 * are tagged "annet" and shown as they are.
 */

export interface ReleaseItem {
  /** Conventional-commit type: feat, fix, chore, docs, ci, ... */
  kind: string;
  text: string;
  prNumber?: string;
}

export interface Release {
  version: string;
  /** ISO date as written in the heading, e.g. "2026-09-03". */
  date: string;
  items: ReleaseItem[];
}

const HEADING = /^## (\d+\.\d+\.\d+) \(([^)]+)\)/;
const BULLET = /^- (.+)$/;
const TRAILING_SHA = /\s*\([0-9a-f]{7,40}\)\s*$/;
const TRAILING_PR = /\s*\(#(\d+)\)\s*$/;
const KIND = /^([a-z]+)(?:\([^)]*\))?!?:\s*/;

export function parseChangelog(raw: string): Release[] {
  const releases: Release[] = [];
  let current: Release | null = null;
  for (const line of raw.split("\n")) {
    const heading = line.match(HEADING);
    if (heading) {
      current = { version: heading[1] ?? "", date: heading[2] ?? "", items: [] };
      releases.push(current);
      continue;
    }
    const bullet = line.match(BULLET);
    if (!bullet || !current) continue;
    let text = (bullet[1] ?? "").replace(TRAILING_SHA, "");
    const pr = text.match(TRAILING_PR);
    if (pr?.index !== undefined) text = text.slice(0, pr.index);
    const kindMatch = text.match(KIND);
    const kind = kindMatch?.[1] ?? "annet";
    if (kindMatch) text = text.slice(kindMatch[0].length);
    current.items.push({ kind, text, prNumber: pr?.[1] });
  }
  return releases;
}
