import type { PageProps } from "@enonic/nextjs-adapter";
import RegionsView from "@enonic/nextjs-adapter/views/Region";

const DefaultPage = (props: PageProps) => {
  const page = props.page;

  const regions =
    !page.regions || !Object.keys(page.regions).length
      ? {
          main: {
            name: "main",
            components: [],
          },
        }
      : page.regions;

  return (
    <>
      <div className={"header-region"}>
        <RegionsView {...props} page={{ ...page, regions }} name="header" />
      </div>
      <div className={"main-region"}>
        <RegionsView {...props} page={{ ...page, regions }} name="main" />
      </div>
    </>
  );
};

export default DefaultPage;
