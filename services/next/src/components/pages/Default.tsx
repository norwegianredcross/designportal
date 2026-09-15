import RegionsView from "@enonic/nextjs-adapter/views/Region";
import { Footer } from "@/components/partials/Footer";
import { Header } from "@/components/partials/Header";
import { Sidebar } from "@/components/partials/Sidebar";
import { renderBlocks } from "@/components/parts/BlocksView";
import blockStyles from "@/components/parts/BlocksView.module.css";
import type { GetPageDefaultQuery } from "@/types/queries";
import type { PageProps } from "@/types/utils";
import { forceArray, notNullOrUndefined } from "@/utils";
import styles from "./Default.module.css";
import { GeneratedPageSection } from "./generated/GeneratedPageSection";

// The template owns the regions; documentation adds a sidebar and fixed list.
// Preserve renderMode so Content Studio receives editable region markers.
const DefaultPage = ({ page, data, common, meta }: PageProps<GetPageDefaultQuery["guillotine"]>) => {
  const layout = data?.layout;
  const hasGeneratedSection = ["components", "changelog", "tokens"].includes(layout?.kind ?? "");

  return (
    <>
      <Header common={common} meta={meta} />
      <main className={page.config?.variant === "wide" ? styles.wide : undefined}>
        <div className={styles.layout}>
          <Sidebar currentPath={data?.get?._path} nav={data?.nav} meta={meta} />
          <article className={styles.article}>
            <RegionsView page={page} name="header" common={common} meta={meta} />
            <div className={blockStyles.blocks}>
              <div className={blockStyles.region}>
                <RegionsView page={page} name="main" common={common} meta={meta} />
              </div>
              {hasGeneratedSection && layout ? (
                <div className={blockStyles.block} data-page-view={layout.kind}>
                  <GeneratedPageSection layout={layout} />
                </div>
              ) : null}
              {renderBlocks({ data: forceArray(layout?.after).filter(notNullOrUndefined), meta })}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DefaultPage;
