import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { Heading, Link, Paragraph } from "rk-designsystem";
import { fetchReleases } from "@/server/changelog";
import { designsystemContextUrl } from "@/server/designsystem-context";
import type { BlockByTypename } from "@/types/blocks";
import styles from "./ChangelogBlock.module.css";
import { ChangelogList } from "./ChangelogList";

type ChangelogData = BlockByTypename<"no_rodekors_docs_BlockChangelog">;

interface ChangelogProps {
  data: ChangelogData;
  meta: MetaData;
}

/**
 * Docs-specific block: "what's new" in the component library. An async
 * server component: it fetches the published CHANGELOG.md (see
 * server/changelog) and renders the parsed releases. Editors own the
 * wording and how many releases to show; the notes are never content.
 * When the changelog can't be fetched the block degrades to a sentence with
 * a link, so the rest of the page still renders.
 */
export async function ChangelogBlock({ data }: ChangelogProps) {
  const releases = await fetchReleases();
  // A Long stored as 0 or a missing value both mean "everything".
  const shown = releases && data.maxReleases ? releases.slice(0, data.maxReleases) : releases;

  return (
    <section className={styles.section}>
      {data.title ? (
        <Heading level={2} data-size="md">
          {data.title}
        </Heading>
      ) : null}
      {data.intro ? <Paragraph>{data.intro}</Paragraph> : null}
      {shown ? (
        <ChangelogList releases={shown} />
      ) : (
        <Paragraph>
          Utgivelsesnotatene kunne ikke hentes akkurat nå. Historikken finnes i{" "}
          <Link href={`${designsystemContextUrl}/CHANGELOG.md`} target="_blank" rel="noreferrer">
            bibliotekets endringslogg
          </Link>
          .
        </Paragraph>
      )}
    </section>
  );
}
