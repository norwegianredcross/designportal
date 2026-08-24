import { type Content, get as getOne } from "/lib/xp/content";
import { forceArray } from "/lib/rodekors/arrays";
import { buildRichText, type ProcessHtmlArgs } from "/lib/rodekors/rich-text";
import { type DataFetchingEnvironment, type Extensions, type GraphQL, ObjectTypeName } from "@enonic-types/guillotine";
import type { Blocks } from "/site/mixins/blocks";
import type { LocalContextRecord } from "@enonic-types/guillotine/graphQL/LocalContext";

type BlockRaw = NonNullable<Blocks["blocks"]>[number];

const OBJECT_TYPE_BLOCK = "no_rodekors_docs_Block";
const OBJECT_TYPE_BLOCK_TEXT = "no_rodekors_docs_BlockText";
const OBJECT_TYPE_BLOCK_ACCORDION = "no_rodekors_docs_BlockAccordion";
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
    },
    unions: {
      [OBJECT_TYPE_BLOCK]: {
        description: "Your page content is build by a sequence of blocks.",
        types: [graphQL.reference(OBJECT_TYPE_BLOCK_TEXT), graphQL.reference(OBJECT_TYPE_BLOCK_ACCORDION)],
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

type ResolvedAccordionBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_ACCORDION;
  title?: string;
  theme?: string;
  items: ResolvedTextBlock[];
};

function resolveBlocks(block: BlockRaw): ResolvedTextBlock | ResolvedAccordionBlock | null {
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
  }

  return null;
}
