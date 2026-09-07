import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { Heading, Paragraph } from "rk-designsystem";
import type { BlockByTypename } from "@/types/blocks";
import styles from "./TokensBlock.module.css";
import { TokensBrowser } from "./TokensBrowser";

type TokensData = BlockByTypename<"no_rodekors_docs_BlockTokens">;

interface TokensProps {
  data: TokensData;
  meta: MetaData;
}

/**
 * Docs-specific block: the design-token browser. Editors own the title and
 * intro; the tokens are read from the theme in the reader's browser by
 * TokensBrowser (see components/blocks/designTokens for why nothing is stored).
 */
export function TokensBlock({ data }: TokensProps) {
  return (
    <section className={styles.section}>
      {data.title ? (
        <Heading level={2} data-size="md">
          {data.title}
        </Heading>
      ) : null}
      {data.intro ? <Paragraph>{data.intro}</Paragraph> : null}
      <TokensBrowser />
    </section>
  );
}
