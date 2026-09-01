import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { BlockByTypename } from "@/types/blocks";
import styles from "./CodeBlock.module.css";
import { CopyButton } from "./CopyButton";

type CodeData = BlockByTypename<"no_rodekors_docs_BlockCode">;

interface CodeProps {
  data: CodeData;
  meta: MetaData;
}

/**
 * Docs-specific block (local mixin, not from lib-xp-item-blocks): a
 * copyable code snippet with an optional language tag, the same treatment
 * as the docs SPA's GuideCodeBlock. Rendered verbatim in a pre/code pair —
 * React escapes the text, so markup in code samples displays instead of
 * executing. No syntax highlighting yet; the language value only feeds the
 * small tag (a future highlighter can use it as-is).
 */
export function CodeBlock({ data }: CodeProps) {
  if (!data.code) return null;
  return (
    <div>
      <div className={styles.header}>
        <span className={styles.label}>{data.label}</span>
        <div className={styles.controls}>
          {data.language ? <span className={styles.language}>{data.language}</span> : null}
          <CopyButton code={data.code} label={data.label} />
        </div>
      </div>
      <pre className={styles.code}>
        <code>{data.code}</code>
      </pre>
    </div>
  );
}
