import { type Content, get as getOne } from "/lib/xp/content";
import { imageUrl, type ImageUrlParams } from "/lib/xp/portal";
import { forceArray } from "/lib/rodekors/arrays";
import { buildRichText, type ProcessHtmlArgs } from "/lib/rodekors/rich-text";
import { type DataFetchingEnvironment, type Extensions, type GraphQL, ObjectTypeName } from "@enonic-types/guillotine";
import type { Blocks } from "/site/mixins/blocks";
import type { LocalContextRecord } from "@enonic-types/guillotine/graphQL/LocalContext";

type BlockRaw = NonNullable<Blocks["blocks"]>[number];

const OBJECT_TYPE_BLOCK = "no_rodekors_docs_Block";
const OBJECT_TYPE_BLOCK_TEXT = "no_rodekors_docs_BlockText";
const OBJECT_TYPE_BLOCK_ACCORDION = "no_rodekors_docs_BlockAccordion";
const OBJECT_TYPE_BLOCK_QUOTE = "no_rodekors_docs_BlockQuote";
const OBJECT_TYPE_BLOCK_FACTBOX = "no_rodekors_docs_BlockFactbox";
const OBJECT_TYPE_BLOCK_IMAGES = "no_rodekors_docs_BlockImages";
// Not a union member: the nested item type inside BlockImages.
const OBJECT_TYPE_BLOCK_IMAGE = "no_rodekors_docs_BlockImage";
const FIELD_BLOCKS = "blocks";

export function extensions(graphQL: GraphQL): Extensions {
  return {
    types: {
      [OBJECT_TYPE_BLOCK_TEXT]: {
        description: "Rich text field that can contain lists and tables",
        fields: {
          title: {
            type: graphQL.GraphQLString,
          },
          text: {
            type: graphQL.reference(ObjectTypeName.RichText),
            args: {
              processHtml: graphQL.reference("ProcessHtmlInput"),
            },
          },
        },
      },
      [OBJECT_TYPE_BLOCK_ACCORDION]: {
        description: "A list of expandable sections",
        fields: {
          title: {
            type: graphQL.GraphQLString,
          },
          items: {
            type: graphQL.list(graphQL.reference(OBJECT_TYPE_BLOCK_TEXT)),
          },
          theme: {
            type: graphQL.GraphQLString,
          },
        },
      },
      [OBJECT_TYPE_BLOCK_QUOTE]: {
        description: "A stylized quote with the image of the author",
        fields: {
          text: {
            type: graphQL.reference(ObjectTypeName.RichText),
            args: {
              processHtml: graphQL.reference("ProcessHtmlInput"),
            },
          },
          author: {
            type: graphQL.GraphQLString,
          },
          // The editor stores a media content id (ImageSelector); the API
          // exposes a ready-to-use URL instead so the frontend never needs
          // to resolve media content itself.
          imageUrl: {
            type: graphQL.GraphQLString,
            args: {
              scale: graphQL.nonNull(graphQL.GraphQLString),
            },
          },
          publicationTitle: {
            type: graphQL.GraphQLString,
          },
          publicationUrl: {
            type: graphQL.GraphQLString,
          },
        },
      },
      [OBJECT_TYPE_BLOCK_FACTBOX]: {
        description: "A box containing text that can have different background colors",
        fields: {
          title: {
            type: graphQL.GraphQLString,
          },
          text: {
            type: graphQL.reference(ObjectTypeName.RichText),
            args: {
              processHtml: graphQL.reference("ProcessHtmlInput"),
            },
          },
          theme: {
            type: graphQL.GraphQLString,
          },
        },
      },
      // A single gallery entry. Lives outside the Block union — it only
      // appears nested under BlockImages.items.
      [OBJECT_TYPE_BLOCK_IMAGE]: {
        description: "One image in an images block",
        fields: {
          // Same contract as the quote block: the editor stores a media id,
          // the API hands the frontend a finished URL at the requested scale.
          imageUrl: {
            type: graphQL.GraphQLString,
            args: {
              scale: graphQL.nonNull(graphQL.GraphQLString),
            },
          },
          altText: {
            type: graphQL.GraphQLString,
          },
          caption: {
            type: graphQL.GraphQLString,
          },
        },
      },
      [OBJECT_TYPE_BLOCK_IMAGES]: {
        description: "An image gallery or an image that can be expanded",
        fields: {
          items: {
            type: graphQL.list(graphQL.reference(OBJECT_TYPE_BLOCK_IMAGE)),
          },
        },
      },
    },
    unions: {
      [OBJECT_TYPE_BLOCK]: {
        description: "Your page content is build by a sequence of blocks.",
        types: [
          graphQL.reference(OBJECT_TYPE_BLOCK_TEXT),
          graphQL.reference(OBJECT_TYPE_BLOCK_ACCORDION),
          graphQL.reference(OBJECT_TYPE_BLOCK_QUOTE),
          graphQL.reference(OBJECT_TYPE_BLOCK_FACTBOX),
          graphQL.reference(OBJECT_TYPE_BLOCK_IMAGES),
        ],
      },
    },
    typeResolvers: {
      [OBJECT_TYPE_BLOCK]: (env) => {
        return env.__typename;
      },
    },
    creationCallbacks: {
      HeadlessCms: (params): void => {
        params.addFields({
          [FIELD_BLOCKS]: {
            type: graphQL.list(graphQL.reference(OBJECT_TYPE_BLOCK)),
            args: {
              key: graphQL.nonNull(graphQL.GraphQLID),
            },
          },
        });
      },
    },
    resolvers: {
      [OBJECT_TYPE_BLOCK_TEXT]: {
        // Resolve the text field for text block
        text: (env: DataFetchingEnvironment<ProcessHtmlArgs, LocalContextRecord, ResolvedTextBlock>) =>
          buildRichText(env.source.text, env.args),
      },
      [OBJECT_TYPE_BLOCK_QUOTE]: {
        text: (env: DataFetchingEnvironment<ProcessHtmlArgs, LocalContextRecord, ResolvedQuoteBlock>) =>
          buildRichText(env.source.text, env.args),
        imageUrl: (env: DataFetchingEnvironment<{ scale?: string }, LocalContextRecord, ResolvedQuoteBlock>) =>
          env.source.imageId
            ? imageUrl({
                id: env.source.imageId,
                // The schema declares scale as non-null, so it is always set at
                // runtime; the arg is typed optional only because Guillotine's
                // resolver interface requires it, and the cast bridges to the
                // portal lib's template-literal scale type ("square(96)" etc.).
                scale: env.args.scale as ImageUrlParams["scale"],
                type: "absolute",
              })
            : null,
      },
      [OBJECT_TYPE_BLOCK_FACTBOX]: {
        text: (env: DataFetchingEnvironment<ProcessHtmlArgs, LocalContextRecord, ResolvedFactboxBlock>) =>
          buildRichText(env.source.text, env.args),
      },
      [OBJECT_TYPE_BLOCK_IMAGE]: {
        imageUrl: (env: DataFetchingEnvironment<{ scale?: string }, LocalContextRecord, ResolvedImageItem>) =>
          env.source.imageId
            ? imageUrl({
                id: env.source.imageId,
                // Non-null in the schema, so always present at runtime; the
                // cast bridges to the portal lib's template-literal type.
                scale: env.args.scale as ImageUrlParams["scale"],
                type: "absolute",
              })
            : null,
      },
      HeadlessCms: {
        [FIELD_BLOCKS]: (env): unknown[] => {
          const content = getOne<Content<Blocks>>({
            key: env.args.key,
          });

          return forceArray(content?.data.blocks).map(resolveBlocks);
        },
      },
    },
  };
}

type ResolvedTextBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_TEXT;
  title?: string;
  text?: string;
};

type ResolvedQuoteBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_QUOTE;
  text?: string;
  author?: string;
  // Kept as the raw media id; the imageUrl field resolver turns it into a URL.
  imageId?: string;
  publicationTitle?: string;
  publicationUrl?: string;
};

type ResolvedFactboxBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_FACTBOX;
  title?: string;
  text?: string;
  theme?: string;
};

type ResolvedImageItem = {
  // Raw media id from the ImageSelector; turned into a URL by the field
  // resolver above so the frontend never touches media content.
  imageId?: string;
  altText?: string;
  caption?: string;
};

type ResolvedImagesBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_IMAGES;
  items: ResolvedImageItem[];
};

type ResolvedAccordionBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_ACCORDION;
  title?: string;
  theme?: string;
  items: ResolvedTextBlock[];
};

function resolveBlocks(
  block: BlockRaw,
): ResolvedTextBlock | ResolvedAccordionBlock | ResolvedQuoteBlock | ResolvedFactboxBlock | ResolvedImagesBlock | null {
  switch (block._selected) {
    case "blocks-text":
      return {
        __typename: OBJECT_TYPE_BLOCK_TEXT,
        title: block["blocks-text"].title,
        text: block["blocks-text"].text,
      };
    case "blocks-accordion":
      return {
        __typename: OBJECT_TYPE_BLOCK_ACCORDION,
        title: block["blocks-accordion"].title,
        theme: block["blocks-accordion"].theme,
        items: forceArray(block["blocks-accordion"].items).map((item) => ({
          __typename: OBJECT_TYPE_BLOCK_TEXT,
          title: item.title,
          text: item.text,
        })),
      };
    case "blocks-quote":
      return {
        __typename: OBJECT_TYPE_BLOCK_QUOTE,
        text: block["blocks-quote"].text,
        author: block["blocks-quote"].author,
        imageId: block["blocks-quote"].imageId,
        publicationTitle: block["blocks-quote"].publicationTitle,
        publicationUrl: block["blocks-quote"].publicationUrl,
      };
    case "blocks-factbox":
      return {
        __typename: OBJECT_TYPE_BLOCK_FACTBOX,
        title: block["blocks-factbox"].title,
        text: block["blocks-factbox"].text,
        // The theme comes from the composed blocks-theme mixin and lands on
        // the same option object as the factbox's own fields.
        theme: block["blocks-factbox"].theme,
      };
    case "blocks-images":
      return {
        __typename: OBJECT_TYPE_BLOCK_IMAGES,
        // forceArray: XP stores a single repeatable entry as a bare object.
        items: forceArray(block["blocks-images"].items).map((item) => ({
          imageId: item.imageId,
          altText: item.altText,
          caption: item.caption,
        })),
      };
  }

  return null;
}
