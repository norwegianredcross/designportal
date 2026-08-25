import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import { Heading } from "rk-designsystem";
import type { GetBlocksQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import { demos } from "./demos";

type DemoData = Extract<
  NonNullable<Get<GetBlocksQuery, "guillotine.blocks">>,
  { __typename: "no_rodekors_docs_BlockDemo" }
>;

interface DemoProps {
  data: DemoData;
  meta: MetaData;
}

/**
 * Docs-specific block: renders one entry from the curated demo registry
 * inside a framed panel, so articles show LIVE design system components
 * instead of screenshots. An id with no registry entry renders nothing —
 * the safe failure when the XP options and the registry drift (the mixin
 * comment marks them as a pair).
 */
export function DemoBlock({ data }: DemoProps) {
  const demo = data.demo ? demos[data.demo] : null;
  if (!demo) return null;
  return (
    <section>
      {data.title ? (
        <Heading level={2} data-size="sm">
          {data.title}
        </Heading>
      ) : null}
      {/* Framed example panel: dashed border marks "this is a demo, not
          page content" — layout glue, not component styling. */}
      <div
        style={{
          border: "1px dashed var(--ds-color-neutral-border-default)",
          borderRadius: "var(--ds-border-radius-lg)",
          padding: "var(--ds-size-5)",
        }}
      >
        {demo}
      </div>
    </section>
  );
}
