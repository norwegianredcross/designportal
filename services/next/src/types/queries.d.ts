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
          author: string | null;
          imageUrl: string | null;
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
        } & { __typename: "no_rodekors_docs_BlockQuote" })
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
        title: string | null;
        intro: {
          processedHtml: string | null;
          links: Array<{ ref: string | null; uri: string | null } | null> | null;
        } | null;
      } | null;
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

export type GetSidePageQueryVariables = Exact<{
  path: string | number;
}>;

export type GetSidePageQuery = {
  guillotine: {
    get: {
      data: {
        title: string | null;
        intro: {
          processedHtml: string | null;
          links: Array<{ ref: string | null; uri: string | null } | null> | null;
        } | null;
      } | null;
    } | null;
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
          author: string | null;
          imageUrl: string | null;
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
        } & { __typename: "no_rodekors_docs_BlockQuote" })
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
