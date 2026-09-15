import { ChangelogSection } from "./ChangelogSection";
import { ComponentsSection } from "./ComponentsSection";
import { TokensSection } from "./TokensSection";
import type { PageLayout } from "./types";

export function GeneratedPageSection({ layout }: { layout: PageLayout }) {
  switch (layout.kind) {
    case "components":
      return <ComponentsSection data={layout} />;
    case "changelog":
      return <ChangelogSection data={layout} />;
    case "tokens":
      return <TokensSection data={layout} />;
    default:
      return null;
  }
}
