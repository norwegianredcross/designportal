import { Heading, Link, Paragraph } from "rk-designsystem";
import { fetchReleases } from "@/server/changelog";
import { designsystemContextUrl } from "@/server/designsystem-context";
import { ChangelogList } from "./ChangelogList";
import styles from "./ChangelogSection.module.css";
import type { GeneratedSectionSettings } from "./types";

/** Fixed generated section; the page owns its placement and editorial regions. */
export async function ChangelogSection({ data }: { data: GeneratedSectionSettings }) {
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
