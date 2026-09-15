/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** Media intent type. */
export type MediaIntentType = "download" | "inline";

export type CommonQueryVariables = Exact<{
  path: string | number;
}>;

export type CommonQuery = {
  guillotine: {
    get:
      | { displayName: string | null; type: string | null }
      | { displayName: string | null; type: string | null }
      | null;
    menu:
      | {
          children: Array<
            | { displayName: string | null; _path: string; type: string | null }
            | { displayName: string | null; _path: string; type: string | null }
            | {
                displayName: string | null;
                _path: string;
                type: string | null;
                data: { showInMenu: boolean | null } | null;
              }
            | null
          > | null;
        }
      | {
          children: Array<
            | { displayName: string | null; _path: string; type: string | null }
            | { displayName: string | null; _path: string; type: string | null }
            | {
                displayName: string | null;
                _path: string;
                type: string | null;
                data: { showInMenu: boolean | null } | null;
              }
            | null
          > | null;
        }
      | null;
  } | null;
};

export type GetBlocksQueryVariables = Exact<{
  path: string | number;
}>;

export type GetBlocksQuery = {
  guillotine: {
    blocks: Array<
      | ({
          title: string | null;
          theme: string | null;
          items: Array<{
            title: string | null;
            text: {
              processedHtml: string | null;
              links: Array<{
                ref: string | null;
                uri: string | null;
                content: { _id: string } | { _id: string } | null;
                media: {
                  intent: MediaIntentType | null;
                  content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
                } | null;
              } | null> | null;
              images: Array<{
                ref: string | null;
                image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
                style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
              } | null> | null;
            } | null;
          } | null> | null;
        } & { __typename: "no_rodekors_docs_BlockAccordion" })
      | ({
          title: string | null;
          intro: string | null;
          linkText: string | null;
          url: string | null;
          contentPath: string | null;
          columns: number | null;
          imagePlacement: string | null;
          width: string | null;
          items: Array<{
            title: string | null;
            kicker: string | null;
            theme: string | null;
            url: string | null;
            contentPath: string | null;
            cardText: string | null;
            image:
              | { _id: string }
              | { _id: string }
              | {
                  imageUrl: string | null;
                  _id: string;
                  imageUrl2x: string | null;
                  data: { altText: string | null } | null;
                }
              | null;
          } | null> | null;
        } & { __typename: "no_rodekors_docs_BlockCards" })
      | ({ code: string | null; language: string | null; label: string | null } & {
          __typename: "no_rodekors_docs_BlockCode";
        })
      | ({ demo: string | null; title: string | null } & { __typename: "no_rodekors_docs_BlockDemo" })
      | ({
          title: string | null;
          theme: string | null;
          text: {
            processedHtml: string | null;
            links: Array<{
              ref: string | null;
              uri: string | null;
              content: { _id: string } | { _id: string } | null;
              media: {
                intent: MediaIntentType | null;
                content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
              } | null;
            } | null> | null;
            images: Array<{
              ref: string | null;
              image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
              style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
            } | null> | null;
          } | null;
        } & { __typename: "no_rodekors_docs_BlockFactbox" })
      | ({
          badge: string | null;
          badgeMeta: string | null;
          kicker: string | null;
          title: string | null;
          lead: string | null;
          image:
            | { _id: string }
            | { _id: string }
            | {
                imageUrl: string | null;
                _id: string;
                imageUrl2x: string | null;
                data: { altText: string | null } | null;
              }
            | null;
          actions: Array<{ linkText: string | null; url: string | null; contentPath: string | null } | null> | null;
        } & { __typename: "no_rodekors_docs_BlockHero" })
      | ({
          size: string | null;
          alignment: string | null;
          form: string | null;
          notchCorner: string | null;
          notchWidth: number | null;
          notchDepth: number | null;
          width: string | null;
          items: Array<{
            altText: string | null;
            caption: string | null;
            image:
              | { _id: string }
              | { _id: string }
              | {
                  imageUrl: string | null;
                  _id: string;
                  imageUrl2x: string | null;
                  x: {
                    media: { imageInfo: { imageWidth: string | null; imageHeight: string | null } | null } | null;
                  } | null;
                }
              | null;
          } | null> | null;
        } & { __typename: "no_rodekors_docs_BlockImages" })
      | ({
          author: string | null;
          publicationTitle: string | null;
          publicationUrl: string | null;
          text: {
            processedHtml: string | null;
            links: Array<{
              ref: string | null;
              uri: string | null;
              content: { _id: string } | { _id: string } | null;
              media: {
                intent: MediaIntentType | null;
                content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
              } | null;
            } | null> | null;
            images: Array<{
              ref: string | null;
              image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
              style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
            } | null> | null;
          } | null;
          image:
            | { _id: string }
            | { _id: string }
            | { imageUrl: string | null; _id: string; imageUrl2x: string | null }
            | null;
        } & { __typename: "no_rodekors_docs_BlockQuote" })
      | ({
          title: string | null;
          intro: string | null;
          alignment: string | null;
          width: string | null;
          linkText: string | null;
          url: string | null;
          contentPath: string | null;
          items: Array<{ label: string | null; value: string | null; description: string | null } | null> | null;
        } & { __typename: "no_rodekors_docs_BlockSummary" })
      | ({
          title: string | null;
          table: {
            processedHtml: string | null;
            links: Array<{
              ref: string | null;
              uri: string | null;
              content: { _id: string } | { _id: string } | null;
              media: {
                intent: MediaIntentType | null;
                content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
              } | null;
            } | null> | null;
            images: Array<{
              ref: string | null;
              image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
              style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
            } | null> | null;
          } | null;
        } & { __typename: "no_rodekors_docs_BlockTable" })
      | ({
          title: string | null;
          text: {
            processedHtml: string | null;
            links: Array<{
              ref: string | null;
              uri: string | null;
              content: { _id: string } | { _id: string } | null;
              media: {
                intent: MediaIntentType | null;
                content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
              } | null;
            } | null> | null;
            images: Array<{
              ref: string | null;
              image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
              style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
            } | null> | null;
          } | null;
        } & { __typename: "no_rodekors_docs_BlockText" })
      | null
    > | null;
  } | null;
};

export type GetContentHeaderQueryVariables = Exact<{
  path: string | number;
}>;

export type GetContentHeaderQuery = {
  guillotine: {
    get: {
      data: {
        kicker: string | null;
        title: string | null;
        intro: {
          processedHtml: string | null;
          links: Array<{ ref: string | null; uri: string | null } | null> | null;
        } | null;
      } | null;
    } | null;
    layout: {
      before: Array<{
        __typename:
          | "no_rodekors_docs_BlockAccordion"
          | "no_rodekors_docs_BlockCards"
          | "no_rodekors_docs_BlockCode"
          | "no_rodekors_docs_BlockDemo"
          | "no_rodekors_docs_BlockFactbox"
          | "no_rodekors_docs_BlockHero"
          | "no_rodekors_docs_BlockImages"
          | "no_rodekors_docs_BlockQuote"
          | "no_rodekors_docs_BlockSummary"
          | "no_rodekors_docs_BlockTable"
          | "no_rodekors_docs_BlockText";
      } | null> | null;
    } | null;
  } | null;
};

type EditorialBlocks_No_Rodekors_Docs_BlockAccordion_Fragment = {
  title: string | null;
  theme: string | null;
  items: Array<{
    title: string | null;
    text: {
      processedHtml: string | null;
      links: Array<{
        ref: string | null;
        uri: string | null;
        content: { _id: string } | { _id: string } | null;
        media: {
          intent: MediaIntentType | null;
          content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
        } | null;
      } | null> | null;
      images: Array<{
        ref: string | null;
        image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
        style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
      } | null> | null;
    } | null;
  } | null> | null;
} & { __typename: "no_rodekors_docs_BlockAccordion" };

type EditorialBlocks_No_Rodekors_Docs_BlockCards_Fragment = {
  title: string | null;
  intro: string | null;
  linkText: string | null;
  url: string | null;
  contentPath: string | null;
  columns: number | null;
  imagePlacement: string | null;
  width: string | null;
  items: Array<{
    title: string | null;
    kicker: string | null;
    theme: string | null;
    url: string | null;
    contentPath: string | null;
    cardText: string | null;
    image:
      | { _id: string }
      | { _id: string }
      | { imageUrl: string | null; _id: string; imageUrl2x: string | null; data: { altText: string | null } | null }
      | null;
  } | null> | null;
} & { __typename: "no_rodekors_docs_BlockCards" };

type EditorialBlocks_No_Rodekors_Docs_BlockCode_Fragment = {
  code: string | null;
  language: string | null;
  label: string | null;
} & { __typename: "no_rodekors_docs_BlockCode" };

type EditorialBlocks_No_Rodekors_Docs_BlockDemo_Fragment = { demo: string | null; title: string | null } & {
  __typename: "no_rodekors_docs_BlockDemo";
};

type EditorialBlocks_No_Rodekors_Docs_BlockFactbox_Fragment = {
  title: string | null;
  theme: string | null;
  text: {
    processedHtml: string | null;
    links: Array<{
      ref: string | null;
      uri: string | null;
      content: { _id: string } | { _id: string } | null;
      media: {
        intent: MediaIntentType | null;
        content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
      } | null;
    } | null> | null;
    images: Array<{
      ref: string | null;
      image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
      style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
    } | null> | null;
  } | null;
} & { __typename: "no_rodekors_docs_BlockFactbox" };

type EditorialBlocks_No_Rodekors_Docs_BlockHero_Fragment = {
  badge: string | null;
  badgeMeta: string | null;
  kicker: string | null;
  title: string | null;
  lead: string | null;
  image:
    | { _id: string }
    | { _id: string }
    | { imageUrl: string | null; _id: string; imageUrl2x: string | null; data: { altText: string | null } | null }
    | null;
  actions: Array<{ linkText: string | null; url: string | null; contentPath: string | null } | null> | null;
} & { __typename: "no_rodekors_docs_BlockHero" };

type EditorialBlocks_No_Rodekors_Docs_BlockImages_Fragment = {
  size: string | null;
  alignment: string | null;
  form: string | null;
  notchCorner: string | null;
  notchWidth: number | null;
  notchDepth: number | null;
  width: string | null;
  items: Array<{
    altText: string | null;
    caption: string | null;
    image:
      | { _id: string }
      | { _id: string }
      | {
          imageUrl: string | null;
          _id: string;
          imageUrl2x: string | null;
          x: { media: { imageInfo: { imageWidth: string | null; imageHeight: string | null } | null } | null } | null;
        }
      | null;
  } | null> | null;
} & { __typename: "no_rodekors_docs_BlockImages" };

type EditorialBlocks_No_Rodekors_Docs_BlockQuote_Fragment = {
  author: string | null;
  publicationTitle: string | null;
  publicationUrl: string | null;
  text: {
    processedHtml: string | null;
    links: Array<{
      ref: string | null;
      uri: string | null;
      content: { _id: string } | { _id: string } | null;
      media: {
        intent: MediaIntentType | null;
        content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
      } | null;
    } | null> | null;
    images: Array<{
      ref: string | null;
      image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
      style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
    } | null> | null;
  } | null;
  image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string; imageUrl2x: string | null } | null;
} & { __typename: "no_rodekors_docs_BlockQuote" };

type EditorialBlocks_No_Rodekors_Docs_BlockSummary_Fragment = {
  title: string | null;
  intro: string | null;
  alignment: string | null;
  width: string | null;
  linkText: string | null;
  url: string | null;
  contentPath: string | null;
  items: Array<{ label: string | null; value: string | null; description: string | null } | null> | null;
} & { __typename: "no_rodekors_docs_BlockSummary" };

type EditorialBlocks_No_Rodekors_Docs_BlockTable_Fragment = {
  title: string | null;
  table: {
    processedHtml: string | null;
    links: Array<{
      ref: string | null;
      uri: string | null;
      content: { _id: string } | { _id: string } | null;
      media: {
        intent: MediaIntentType | null;
        content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
      } | null;
    } | null> | null;
    images: Array<{
      ref: string | null;
      image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
      style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
    } | null> | null;
  } | null;
} & { __typename: "no_rodekors_docs_BlockTable" };

type EditorialBlocks_No_Rodekors_Docs_BlockText_Fragment = {
  title: string | null;
  text: {
    processedHtml: string | null;
    links: Array<{
      ref: string | null;
      uri: string | null;
      content: { _id: string } | { _id: string } | null;
      media: {
        intent: MediaIntentType | null;
        content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
      } | null;
    } | null> | null;
    images: Array<{
      ref: string | null;
      image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
      style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
    } | null> | null;
  } | null;
} & { __typename: "no_rodekors_docs_BlockText" };

export type EditorialBlocksFragment =
  | EditorialBlocks_No_Rodekors_Docs_BlockAccordion_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockCards_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockCode_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockDemo_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockFactbox_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockHero_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockImages_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockQuote_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockSummary_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockTable_Fragment
  | EditorialBlocks_No_Rodekors_Docs_BlockText_Fragment;

export type GetPageDefaultQueryVariables = Exact<{
  path: string | number;
}>;

export type GetPageDefaultQuery = {
  guillotine: {
    get: { _path: string } | { _path: string } | null;
    nav:
      | {
          children: Array<
            | { displayName: string | null; _path: string; type: string | null }
            | { displayName: string | null; _path: string; type: string | null }
            | { displayName: string | null; _path: string; type: string | null; data: { kicker: string | null } | null }
            | null
          > | null;
          parent:
            | {
                _path: string;
                children: Array<
                  | { displayName: string | null; _path: string; type: string | null }
                  | { displayName: string | null; _path: string; type: string | null }
                  | {
                      displayName: string | null;
                      _path: string;
                      type: string | null;
                      data: { kicker: string | null } | null;
                    }
                  | null
                > | null;
              }
            | {
                _path: string;
                children: Array<
                  | { displayName: string | null; _path: string; type: string | null }
                  | { displayName: string | null; _path: string; type: string | null }
                  | {
                      displayName: string | null;
                      _path: string;
                      type: string | null;
                      data: { kicker: string | null } | null;
                    }
                  | null
                > | null;
              }
            | null;
        }
      | {
          children: Array<
            | { displayName: string | null; _path: string; type: string | null }
            | { displayName: string | null; _path: string; type: string | null }
            | { displayName: string | null; _path: string; type: string | null; data: { kicker: string | null } | null }
            | null
          > | null;
          parent:
            | {
                _path: string;
                children: Array<
                  | { displayName: string | null; _path: string; type: string | null }
                  | { displayName: string | null; _path: string; type: string | null }
                  | {
                      displayName: string | null;
                      _path: string;
                      type: string | null;
                      data: { kicker: string | null } | null;
                    }
                  | null
                > | null;
              }
            | {
                _path: string;
                children: Array<
                  | { displayName: string | null; _path: string; type: string | null }
                  | { displayName: string | null; _path: string; type: string | null }
                  | {
                      displayName: string | null;
                      _path: string;
                      type: string | null;
                      data: { kicker: string | null } | null;
                    }
                  | null
                > | null;
              }
            | null;
        }
      | null;
    layout: {
      kind: string | null;
      title: string | null;
      intro: string | null;
      showSearch: boolean | null;
      maxReleases: number | null;
      after: Array<
        | ({
            title: string | null;
            theme: string | null;
            items: Array<{
              title: string | null;
              text: {
                processedHtml: string | null;
                links: Array<{
                  ref: string | null;
                  uri: string | null;
                  content: { _id: string } | { _id: string } | null;
                  media: {
                    intent: MediaIntentType | null;
                    content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
                  } | null;
                } | null> | null;
                images: Array<{
                  ref: string | null;
                  image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
                  style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
                } | null> | null;
              } | null;
            } | null> | null;
          } & { __typename: "no_rodekors_docs_BlockAccordion" })
        | ({
            title: string | null;
            intro: string | null;
            linkText: string | null;
            url: string | null;
            contentPath: string | null;
            columns: number | null;
            imagePlacement: string | null;
            width: string | null;
            items: Array<{
              title: string | null;
              kicker: string | null;
              theme: string | null;
              url: string | null;
              contentPath: string | null;
              cardText: string | null;
              image:
                | { _id: string }
                | { _id: string }
                | {
                    imageUrl: string | null;
                    _id: string;
                    imageUrl2x: string | null;
                    data: { altText: string | null } | null;
                  }
                | null;
            } | null> | null;
          } & { __typename: "no_rodekors_docs_BlockCards" })
        | ({ code: string | null; language: string | null; label: string | null } & {
            __typename: "no_rodekors_docs_BlockCode";
          })
        | ({ demo: string | null; title: string | null } & { __typename: "no_rodekors_docs_BlockDemo" })
        | ({
            title: string | null;
            theme: string | null;
            text: {
              processedHtml: string | null;
              links: Array<{
                ref: string | null;
                uri: string | null;
                content: { _id: string } | { _id: string } | null;
                media: {
                  intent: MediaIntentType | null;
                  content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
                } | null;
              } | null> | null;
              images: Array<{
                ref: string | null;
                image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
                style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
              } | null> | null;
            } | null;
          } & { __typename: "no_rodekors_docs_BlockFactbox" })
        | ({
            badge: string | null;
            badgeMeta: string | null;
            kicker: string | null;
            title: string | null;
            lead: string | null;
            image:
              | { _id: string }
              | { _id: string }
              | {
                  imageUrl: string | null;
                  _id: string;
                  imageUrl2x: string | null;
                  data: { altText: string | null } | null;
                }
              | null;
            actions: Array<{ linkText: string | null; url: string | null; contentPath: string | null } | null> | null;
          } & { __typename: "no_rodekors_docs_BlockHero" })
        | ({
            size: string | null;
            alignment: string | null;
            form: string | null;
            notchCorner: string | null;
            notchWidth: number | null;
            notchDepth: number | null;
            width: string | null;
            items: Array<{
              altText: string | null;
              caption: string | null;
              image:
                | { _id: string }
                | { _id: string }
                | {
                    imageUrl: string | null;
                    _id: string;
                    imageUrl2x: string | null;
                    x: {
                      media: { imageInfo: { imageWidth: string | null; imageHeight: string | null } | null } | null;
                    } | null;
                  }
                | null;
            } | null> | null;
          } & { __typename: "no_rodekors_docs_BlockImages" })
        | ({
            author: string | null;
            publicationTitle: string | null;
            publicationUrl: string | null;
            text: {
              processedHtml: string | null;
              links: Array<{
                ref: string | null;
                uri: string | null;
                content: { _id: string } | { _id: string } | null;
                media: {
                  intent: MediaIntentType | null;
                  content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
                } | null;
              } | null> | null;
              images: Array<{
                ref: string | null;
                image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
                style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
              } | null> | null;
            } | null;
            image:
              | { _id: string }
              | { _id: string }
              | { imageUrl: string | null; _id: string; imageUrl2x: string | null }
              | null;
          } & { __typename: "no_rodekors_docs_BlockQuote" })
        | ({
            title: string | null;
            intro: string | null;
            alignment: string | null;
            width: string | null;
            linkText: string | null;
            url: string | null;
            contentPath: string | null;
            items: Array<{ label: string | null; value: string | null; description: string | null } | null> | null;
          } & { __typename: "no_rodekors_docs_BlockSummary" })
        | ({
            title: string | null;
            table: {
              processedHtml: string | null;
              links: Array<{
                ref: string | null;
                uri: string | null;
                content: { _id: string } | { _id: string } | null;
                media: {
                  intent: MediaIntentType | null;
                  content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
                } | null;
              } | null> | null;
              images: Array<{
                ref: string | null;
                image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
                style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
              } | null> | null;
            } | null;
          } & { __typename: "no_rodekors_docs_BlockTable" })
        | ({
            title: string | null;
            text: {
              processedHtml: string | null;
              links: Array<{
                ref: string | null;
                uri: string | null;
                content: { _id: string } | { _id: string } | null;
                media: {
                  intent: MediaIntentType | null;
                  content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
                } | null;
              } | null> | null;
              images: Array<{
                ref: string | null;
                image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
                style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
              } | null> | null;
            } | null;
          } & { __typename: "no_rodekors_docs_BlockText" })
        | null
      > | null;
    } | null;
  } | null;
};

export type RichTextFragmentFragment = {
  processedHtml: string | null;
  links: Array<{
    ref: string | null;
    uri: string | null;
    content: { _id: string } | { _id: string } | null;
    media: {
      intent: MediaIntentType | null;
      content: { _id: string } | { _id: string } | { mediaUrl: string | null; _id: string } | null;
    } | null;
  } | null> | null;
  images: Array<{
    ref: string | null;
    image: { _id: string } | { _id: string } | { imageUrl: string | null; _id: string } | null;
    style: { name: string | null; aspectRatio: string | null; filter: string | null } | null;
  } | null> | null;
};
