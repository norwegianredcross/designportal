/**
 * Guillotine schema extension — the bridge between how editors STORE blocks
 * and how the frontend wants to READ them.
 *
 * Editors fill an option-set (site/mixins/blocks/blocks.xml): each entry is
 * one chosen block type with its fields nested under the option name and a
 * `_selected` discriminator. That raw shape is awkward to consume, so this
 * file exposes a flattened `blocks(key)` field on the API instead: a list of
 * a GraphQL UNION, one member type per block, each tagged with __typename.
 * The frontend then dispatches on __typename (see the Next side's
 * components/blocks/registry.ts).
 *
 * Adding a block always touches the union member type and the
 * `resolveBlocks` switch that maps `_selected` -> typed object — plus field
 * resolvers when a field needs a server-side lookup (rich text, or an image
 * id turned into its media content); plain string fields resolve on their own.
 *
 * `resolveBlocks` itself only reshapes what the editor stored — it never
 * reads other content. Anything that costs a lookup belongs in a field
 * resolver, so a query that does not ask for it does not pay for it.
 */
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
const OBJECT_TYPE_BLOCK_QUOTE = "no_rodekors_docs_BlockQuote";
const OBJECT_TYPE_BLOCK_FACTBOX = "no_rodekors_docs_BlockFactbox";
const OBJECT_TYPE_BLOCK_IMAGES = "no_rodekors_docs_BlockImages";
// Not a union member: the nested item type inside BlockImages.
const OBJECT_TYPE_BLOCK_IMAGE = "no_rodekors_docs_BlockImage";
const OBJECT_TYPE_BLOCK_CARDS = "no_rodekors_docs_BlockCards";
const OBJECT_TYPE_BLOCK_CODE = "no_rodekors_docs_BlockCode";
const OBJECT_TYPE_BLOCK_DEMO = "no_rodekors_docs_BlockDemo";
const OBJECT_TYPE_BLOCK_COMPONENTS = "no_rodekors_docs_BlockComponents";
const OBJECT_TYPE_BLOCK_TOKENS = "no_rodekors_docs_BlockTokens";
const OBJECT_TYPE_BLOCK_TABLE = "no_rodekors_docs_BlockTable";
const OBJECT_TYPE_BLOCK_HERO = "no_rodekors_docs_BlockHero";
// Not a union member: one call-to-action nested inside BlockHero.
const OBJECT_TYPE_BLOCK_HERO_ACTION = "no_rodekors_docs_BlockHeroAction";
const OBJECT_TYPE_BLOCK_SUMMARY = "no_rodekors_docs_BlockSummary";
// Not a union member: the nested key-figure type inside BlockSummary.
const OBJECT_TYPE_BLOCK_SUMMARY_ITEM = "no_rodekors_docs_BlockSummaryItem";
// Not a union member: the nested item type inside BlockCards.
const OBJECT_TYPE_BLOCK_CARD = "no_rodekors_docs_BlockCard";
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
          // The mixin stores the picked image as an id. Exposing it as the
          // Content interface rather than media_Image lets the client narrow
          // with `... on media_Image` and ask Guillotine's own imageUrl field
          // for whatever scales it wants — the same way images in a RichText
          // work. Nothing about presentation is decided here any more.
          image: {
            type: graphQL.reference(ObjectTypeName.Content),
          },
          publicationTitle: {
            type: graphQL.GraphQLString,
          },
          publicationUrl: {
            type: graphQL.GraphQLString,
          },
        },
      },
      // Every field declared here must be mirrored by the resolveBlocks
      // switch below AND by the fragments in the Next side's query files —
      // GraphQL only serves what the type declares, and the frontend only
      // receives what the fragment selects.
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
          // The mixin stores the picked image as an id. Exposing it as the
          // Content interface rather than media_Image lets the client narrow
          // with `... on media_Image` and ask Guillotine's own imageUrl field
          // for whatever scales it wants — the same way images in a RichText
          // work. Nothing about presentation is decided here any more.
          image: {
            type: graphQL.reference(ObjectTypeName.Content),
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
          // Editor choices from the app's shadowed mixin (see
          // site/mixins/blocks-images): single-image size/alignment plus
          // the corner-based notch silhouette, flattened out of the form
          // option-set like the tekst-og-bilde block's.
          size: {
            type: graphQL.GraphQLString,
          },
          alignment: {
            type: graphQL.GraphQLString,
          },
          form: {
            type: graphQL.GraphQLString,
          },
          notchCorner: {
            type: graphQL.GraphQLString,
          },
          notchWidth: {
            type: graphQL.GraphQLInt,
          },
          notchDepth: {
            type: graphQL.GraphQLInt,
          },
          // From the composed blocks-width mixin: "column" (the default) or
          // "wide". The frontend decides how much wider; see BlocksView.
          width: {
            type: graphQL.GraphQLString,
          },
        },
      },
      // One card in a cards block. Lives outside the Block union — it only
      // appears nested under BlockCards.items.
      [OBJECT_TYPE_BLOCK_CARD]: {
        description: "One card in a cards block",
        fields: {
          title: {
            type: graphQL.GraphQLString,
          },
          kicker: {
            type: graphQL.GraphQLString,
          },
          // Plain string, not RichText: the editor field is a TextArea.
          text: {
            type: graphQL.GraphQLString,
          },
          // The mixin stores the picked image as an id. Exposing it as the
          // Content interface rather than media_Image lets the client narrow
          // with `... on media_Image` and ask Guillotine's own imageUrl field
          // for whatever scales it wants — the same way images in a RichText
          // work. Nothing about presentation is decided here any more.
          image: {
            type: graphQL.reference(ObjectTypeName.Content),
          },
          theme: {
            type: graphQL.GraphQLString,
          },
          // Exactly one of these is set, mirroring the editor's
          // internal/external/none choice: url carries an external address
          // verbatim, contentPath carries the internal target's content
          // path for the frontend to map into its own URL space (the
          // adapter's getUrl strips the site prefix).
          url: {
            type: graphQL.GraphQLString,
          },
          contentPath: {
            type: graphQL.GraphQLString,
          },
        },
      },
      [OBJECT_TYPE_BLOCK_CARDS]: {
        description: "Cards can have a title, text, image and can link to content",
        fields: {
          title: {
            type: graphQL.GraphQLString,
          },
          // App additions to the lib's form (see the shadowing mixin): the
          // section ingress, and the "see more" link parked bottom right.
          intro: {
            type: graphQL.GraphQLString,
          },
          linkText: {
            type: graphQL.GraphQLString,
          },
          // Derived from the stored CSS-class radio values
          // (blocks-card--cols-3 -> 3, blocks-card--image-left -> "left"):
          // the frontend gets intent, not the lib's class names.
          columns: {
            type: graphQL.GraphQLInt,
          },
          imagePlacement: {
            type: graphQL.GraphQLString,
          },
          // From the composed blocks-width mixin: "column" (the default) or
          // "wide". The frontend decides how much wider; see BlocksView.
          width: {
            type: graphQL.GraphQLString,
          },
          items: {
            type: graphQL.list(graphQL.reference(OBJECT_TYPE_BLOCK_CARD)),
          },
          // The section link's target, resolved the same way a card's own is:
          // url XOR contentPath.
          url: {
            type: graphQL.GraphQLString,
          },
          contentPath: {
            type: graphQL.GraphQLString,
          },
        },
      },
      // All plain strings — no field resolvers needed; the code text is
      // rendered verbatim (never processed as HTML).
      [OBJECT_TYPE_BLOCK_CODE]: {
        description: "A copyable block of code with a language label",
        fields: {
          code: {
            type: graphQL.GraphQLString,
          },
          language: {
            type: graphQL.GraphQLString,
          },
          label: {
            type: graphQL.GraphQLString,
          },
        },
      },
      // Only the wording around the grid. The component list itself is
      // NOT content: the Next side fetches it from the library's published
      // manifest when rendering (services/next/src/server/designsystem-context.ts),
      // so nothing here needs a resolver.
      [OBJECT_TYPE_BLOCK_COMPONENTS]: {
        description: "The component catalogue, generated from the library's published manifest",
        fields: {
          title: {
            type: graphQL.GraphQLString,
          },
          intro: {
            type: graphQL.GraphQLString,
          },
          showSearch: {
            type: graphQL.GraphQLBoolean,
          },
        },
      },
      // Wording only: the tokens themselves are read from the theme's CSS
      // in the reader's browser (see the Next side's TokensBrowser), never
      // stored as content, so nothing here needs a resolver.
      [OBJECT_TYPE_BLOCK_TOKENS]: {
        description: "The design-token browser, read from the theme in the reader's browser",
        fields: {
          title: {
            type: graphQL.GraphQLString,
          },
          intro: {
            type: graphQL.GraphQLString,
          },
        },
      },
      // Plain strings; the demo id is only meaningful to the frontend's
      // curated demo registry.
      [OBJECT_TYPE_BLOCK_DEMO]: {
        description: "A live example of a design system component",
        fields: {
          demo: {
            type: graphQL.GraphQLString,
          },
          title: {
            type: graphQL.GraphQLString,
          },
        },
      },
      // The table's markup comes from a table-only HtmlArea; RichText (not
      // a plain string) so links inside cells resolve like everywhere else.
      [OBJECT_TYPE_BLOCK_TABLE]: {
        description: "A table with an optional title",
        fields: {
          title: {
            type: graphQL.GraphQLString,
          },
          table: {
            type: graphQL.reference(ObjectTypeName.RichText),
            args: {
              processHtml: graphQL.reference("ProcessHtmlInput"),
            },
          },
        },
      },
      // One call to action in a hero. Lives outside the Block union —
      // it only appears nested under BlockHero.actions. The link arrives
      // pre-resolved (url XOR contentPath), same contract as the cards.
      [OBJECT_TYPE_BLOCK_HERO_ACTION]: {
        description: "One call to action in a hero block",
        fields: {
          linkText: {
            type: graphQL.GraphQLString,
          },
          url: {
            type: graphQL.GraphQLString,
          },
          contentPath: {
            type: graphQL.GraphQLString,
          },
        },
      },
      // The landing panel. Plain strings throughout: the lead is a
      // TextArea rather than an HtmlArea, so nothing here needs the
      // rich-text processing the text and factbox blocks go through.
      [OBJECT_TYPE_BLOCK_HERO]: {
        description: "Landing panel with a notched corner, title and calls to action",
        fields: {
          badge: {
            type: graphQL.GraphQLString,
          },
          badgeMeta: {
            type: graphQL.GraphQLString,
          },
          kicker: {
            type: graphQL.GraphQLString,
          },
          title: {
            type: graphQL.GraphQLString,
          },
          lead: {
            type: graphQL.GraphQLString,
          },
          actions: {
            type: graphQL.list(graphQL.reference(OBJECT_TYPE_BLOCK_HERO_ACTION)),
          },
        },
      },
      // One key figure inside a summary block. Lives outside the Block
      // union — it only appears nested under BlockSummary.items.
      [OBJECT_TYPE_BLOCK_SUMMARY_ITEM]: {
        description: "One key figure in a summary block",
        fields: {
          label: {
            type: graphQL.GraphQLString,
          },
          value: {
            type: graphQL.GraphQLString,
          },
          description: {
            type: graphQL.GraphQLString,
          },
        },
      },
      // Key figures with an optional link; the link arrives pre-resolved
      // like the cards' (url XOR contentPath).
      [OBJECT_TYPE_BLOCK_SUMMARY]: {
        description: "Key figures with an optional link",
        fields: {
          title: {
            type: graphQL.GraphQLString,
          },
          intro: {
            type: graphQL.GraphQLString,
          },
          items: {
            type: graphQL.list(graphQL.reference(OBJECT_TYPE_BLOCK_SUMMARY_ITEM)),
          },
          alignment: {
            type: graphQL.GraphQLString,
          },
          // From the composed blocks-width mixin: "column" (the default) or
          // "wide". The frontend decides how much wider; see BlocksView.
          width: {
            type: graphQL.GraphQLString,
          },
          linkText: {
            type: graphQL.GraphQLString,
          },
          url: {
            type: graphQL.GraphQLString,
          },
          contentPath: {
            type: graphQL.GraphQLString,
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
          graphQL.reference(OBJECT_TYPE_BLOCK_CARDS),
          graphQL.reference(OBJECT_TYPE_BLOCK_CODE),
          graphQL.reference(OBJECT_TYPE_BLOCK_DEMO),
          graphQL.reference(OBJECT_TYPE_BLOCK_COMPONENTS),
          graphQL.reference(OBJECT_TYPE_BLOCK_TOKENS),
          graphQL.reference(OBJECT_TYPE_BLOCK_TABLE),
          graphQL.reference(OBJECT_TYPE_BLOCK_SUMMARY),
          graphQL.reference(OBJECT_TYPE_BLOCK_HERO),
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
        // Look the image up lazily, so a query that skips it costs nothing
        image: (env: DataFetchingEnvironment<Record<string, unknown>, LocalContextRecord, ResolvedQuoteBlock>) =>
          env.source.imageId ? getOne({ key: env.source.imageId }) : null,
      },
      [OBJECT_TYPE_BLOCK_TABLE]: {
        table: (env: DataFetchingEnvironment<ProcessHtmlArgs, LocalContextRecord, ResolvedTableBlock>) =>
          buildRichText(env.source.table, env.args),
      },
      [OBJECT_TYPE_BLOCK_FACTBOX]: {
        text: (env: DataFetchingEnvironment<ProcessHtmlArgs, LocalContextRecord, ResolvedFactboxBlock>) =>
          buildRichText(env.source.text, env.args),
      },
      [OBJECT_TYPE_BLOCK_IMAGE]: {
        // Look the image up lazily, so a query that skips it costs nothing
        image: (env: DataFetchingEnvironment<Record<string, unknown>, LocalContextRecord, ResolvedImageItem>) =>
          env.source.imageId ? getOne({ key: env.source.imageId }) : null,
      },
      [OBJECT_TYPE_BLOCK_CARD]: {
        // Look the image up lazily, so a query that skips it costs nothing
        image: (env: DataFetchingEnvironment<Record<string, unknown>, LocalContextRecord, ResolvedCardItem>) =>
          env.source.imageId ? getOne({ key: env.source.imageId }) : null,
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
  // Kept as the raw media id; the image field resolver looks the content up.
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
  // Raw media id from the ImageSelector; the image field resolver above
  // turns it into the media content itself.
  imageId?: string;
  altText?: string;
  caption?: string;
};

type ResolvedImagesBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_IMAGES;
  items: ResolvedImageItem[];
  size?: string;
  alignment?: string;
  form?: string;
  notchCorner?: string;
  notchWidth?: number;
  notchDepth?: number;
  width?: string;
};

type ResolvedCardItem = {
  title?: string;
  kicker?: string;
  text?: string;
  imageId?: string;
  theme?: string;
  url?: string;
  contentPath?: string;
};

type ResolvedCardsBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_CARDS;
  title?: string;
  intro?: string;
  columns?: number;
  imagePlacement?: string;
  width?: string;
  items: ResolvedCardItem[];
  linkText?: string;
  url?: string;
  contentPath?: string;
};

type ResolvedCodeBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_CODE;
  code?: string;
  language?: string;
  label?: string;
};

type ResolvedTableBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_TABLE;
  title?: string;
  // Raw HtmlArea string; becomes RichText via the field resolver.
  table?: string;
};

type ResolvedHeroAction = {
  linkText?: string;
  url?: string;
  contentPath?: string;
};

type ResolvedHeroBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_HERO;
  badge?: string;
  badgeMeta?: string;
  kicker?: string;
  title?: string;
  lead?: string;
  actions: ResolvedHeroAction[];
};

type ResolvedSummaryItem = {
  label?: string;
  value?: string;
  description?: string;
};

type ResolvedSummaryBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_SUMMARY;
  title?: string;
  intro?: string;
  items: ResolvedSummaryItem[];
  alignment?: string;
  width?: string;
  linkText?: string;
  url?: string;
  contentPath?: string;
};

type ResolvedDemoBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_DEMO;
  demo?: string;
  title?: string;
};

type ResolvedComponentsBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_COMPONENTS;
  title?: string;
  intro?: string;
  showSearch?: boolean;
};
type ResolvedTokensBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_TOKENS;
  title?: string;
  intro?: string;
};

type ResolvedAccordionBlock = {
  __typename: typeof OBJECT_TYPE_BLOCK_ACCORDION;
  title?: string;
  theme?: string;
  items: ResolvedTextBlock[];
};

function resolveBlocks(
  block: BlockRaw,
):
  | ResolvedTextBlock
  | ResolvedAccordionBlock
  | ResolvedQuoteBlock
  | ResolvedFactboxBlock
  | ResolvedImagesBlock
  | ResolvedCardsBlock
  | ResolvedCodeBlock
  | ResolvedDemoBlock
  | ResolvedComponentsBlock
  | ResolvedTokensBlock
  | ResolvedTableBlock
  | ResolvedSummaryBlock
  | ResolvedHeroBlock
  | null {
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
    case "blocks-images": {
      const imagesForm = block["blocks-images"].form;
      const imagesNotch = imagesForm?._selected === "notch" ? imagesForm.notch : undefined;
      return {
        __typename: OBJECT_TYPE_BLOCK_IMAGES,
        // forceArray: XP stores a single repeatable entry as a bare object.
        items: forceArray(block["blocks-images"].items).map((item) => ({
          imageId: item.imageId,
          altText: item.altText,
          caption: item.caption,
        })),
        // Editor choices from the app's shadowed mixin, passed through
        // verbatim — the frontend owns clamping and defaults. The notch
        // fields only exist when the editor picked that option.
        size: block["blocks-images"].size,
        alignment: block["blocks-images"].alignment,
        form: imagesForm?._selected,
        notchCorner: imagesNotch?.corner,
        notchWidth: imagesNotch?.width,
        notchDepth: imagesNotch?.depth,
        // From the composed blocks-width mixin; lands on the same option
        // object as the block's own fields, the way blocks-theme does.
        width: block["blocks-images"].width,
      };
    }
    case "blocks-cards": {
      const cards = block["blocks-cards"];
      // The block's own "see more" link, resolved once — the same shape the
      // summary uses. Per-card links are resolved inside the map below.
      const cardsTarget =
        cards.link?._selected === "internal" ? getOne({ key: cards.link.internal.internalLink }) : null;
      return {
        __typename: OBJECT_TYPE_BLOCK_CARDS,
        title: cards.title,
        intro: cards.intro,
        // The lib stores presentation choices as its own CSS class names;
        // parse out the intent so the frontend never sees them.
        columns: Number(cards.columnsClass?.replace("blocks-card--cols-", "")) || undefined,
        imagePlacement: cards.imageClass?.replace("blocks-card--image-", ""),
        // From the composed blocks-width mixin; lands on the same option
        // object as the block's own fields, the way blocks-theme does.
        width: cards.width,
        items: forceArray(cards.items).map((item) => {
          // The link option-set stores which choice the editor made in
          // _selected; internal targets are fetched once here, both for
          // their path and for the title fallback below.
          const target = item.link?._selected === "internal" ? getOne({ key: item.link.internal.internalLink }) : null;
          return {
            // Per the lib's form semantics the title field OVERRIDES the
            // linked content's own title — so an internal-link card without
            // an override inherits the target's display name.
            title: item.title ?? target?.displayName,
            kicker: item.kicker,
            text: item.text,
            imageId: item.imageId,
            theme: item.theme,
            url: item.link?._selected === "external" ? item.link.external.externalLink : undefined,
            contentPath: target?._path ?? undefined,
          };
        }),
        linkText: cards.linkText,
        url: cards.link?._selected === "external" ? cards.link.external.externalLink : undefined,
        contentPath: cardsTarget?._path ?? undefined,
      };
    }
    case "blocks-code":
      return {
        __typename: OBJECT_TYPE_BLOCK_CODE,
        code: block["blocks-code"].code,
        language: block["blocks-code"].language,
        label: block["blocks-code"].label,
      };
    case "blocks-table":
      return {
        __typename: OBJECT_TYPE_BLOCK_TABLE,
        title: block["blocks-table"].title,
        table: block["blocks-table"].table,
      };
    case "blocks-hero": {
      const hero = block["blocks-hero"];
      return {
        __typename: OBJECT_TYPE_BLOCK_HERO,
        badge: hero.badge,
        badgeMeta: hero.badgeMeta,
        kicker: hero.kicker,
        title: hero.title,
        lead: hero.lead,
        // forceArray: XP stores a single repeatable entry as a bare
        // object. Each action resolves its own link the way the cards
        // and the summary do — internal fetched once for its path,
        // external passed through verbatim.
        actions: forceArray(hero.actions).map((action) => {
          const target =
            action.link?._selected === "internal" ? getOne({ key: action.link.internal.internalLink }) : null;
          return {
            linkText: action.linkText,
            url: action.link?._selected === "external" ? action.link.external.externalLink : undefined,
            contentPath: target?._path ?? undefined,
          };
        }),
      };
    }
    case "blocks-summary": {
      const summary = block["blocks-summary"];
      // Same link resolution as the cards: internal targets fetched once
      // for their path; external urls pass through verbatim.
      const target =
        summary.link?._selected === "internal" ? getOne({ key: summary.link.internal.internalLink }) : null;
      return {
        __typename: OBJECT_TYPE_BLOCK_SUMMARY,
        title: summary.title,
        intro: summary.intro,
        // forceArray: XP stores a single repeatable entry as a bare object.
        items: forceArray(summary.items).map((item) => ({
          label: item.label,
          value: item.value,
          description: item.description,
        })),
        alignment: summary.alignment,
        // From the composed blocks-width mixin; lands on the same option
        // object as the block's own fields, the way blocks-theme does.
        width: summary.width,
        linkText: summary.linkText,
        url: summary.link?._selected === "external" ? summary.link.external.externalLink : undefined,
        contentPath: target?._path ?? undefined,
      };
    }
    case "blocks-demo":
      return {
        __typename: OBJECT_TYPE_BLOCK_DEMO,
        demo: block["blocks-demo"].demo,
        title: block["blocks-demo"].title,
      };
    case "blocks-components":
      return {
        __typename: OBJECT_TYPE_BLOCK_COMPONENTS,
        title: block["blocks-components"].title,
        intro: block["blocks-components"].intro,
        showSearch: block["blocks-components"].showSearch,
      };
    case "blocks-tokens":
      return {
        __typename: OBJECT_TYPE_BLOCK_TOKENS,
        title: block["blocks-tokens"].title,
        intro: block["blocks-tokens"].intro,
      };
  }

  return null;
}
