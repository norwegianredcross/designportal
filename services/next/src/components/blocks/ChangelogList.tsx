import { Heading, Link, Tag } from "rk-designsystem";
import styles from "./ChangelogList.module.css";
import type { Release } from "./parseChangelog";

const REPO_URL = "https://github.com/norwegianredcross/DesignSystem";

interface ChangelogListProps {
  releases: Release[];
}

/**
 * The presentational half of the release-notes block: one section per
 * release with its version, date and a link to the GitHub release, and a
 * list of changes tagged by kind. No data fetching and no state, so it
 * renders on the server and the stories can hand it a parsed fixture.
 */
export function ChangelogList({ releases }: ChangelogListProps) {
  return (
    <div className={styles.releases}>
      {releases.map((release) => {
        const headingId = `release-${release.version.replace(/\./g, "-")}`;
        return (
          <section key={release.version} aria-labelledby={headingId} className={styles.release}>
            <div className={styles.header}>
              <Heading level={3} data-size="sm" id={headingId} className={styles.version}>
                v{release.version}
              </Heading>
              <time dateTime={release.date} className={styles.date}>
                {release.date}
              </time>
              <Link href={`${REPO_URL}/releases/tag/v${release.version}`} target="_blank" rel="noreferrer">
                Se utgivelsen på GitHub
              </Link>
            </div>
            {release.items.length > 0 ? (
              // Explicit role: Safari/VoiceOver drop list semantics from a
              // list styled without markers, so the item count would not be
              // announced without it.
              // biome-ignore lint/a11y/noRedundantRoles: needed for WebKit
              <ul className={styles.items} role="list">
                {release.items.map((item, index) => (
                  // Items have no stable id; a release's list never reorders.
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  <li key={index} className={styles.item}>
                    <Tag data-size="sm" data-color="neutral" className={styles.kind}>
                      {item.kind}
                    </Tag>
                    <span>
                      {item.text}
                      {item.prNumber ? (
                        <>
                          {" "}
                          <Link href={`${REPO_URL}/pull/${item.prNumber}`} target="_blank" rel="noreferrer">
                            #{item.prNumber}
                          </Link>
                        </>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
