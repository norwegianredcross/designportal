import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CardsBlock } from "@/components/blocks/CardsBlock";

const meta: MetaData = {
  apiUrl: "http://localhost:8080/site/designsystem-docs/master",
  baseUrl: "/",
  canRender: true,
  catchAll: false,
  defaultLocale: "no",
  locale: "no",
  id: "130dd4c1-5e99-4164-800e-356b027754f8",
  path: "om-oss",
  renderMode: RENDER_MODE.NEXT,
  requestType: XP_REQUEST_TYPE.PAGE,
  type: "no.rodekors.docs:page",
};

const storyMeta = {
  title: "Blocks/CardsBlock",
  component: CardsBlock,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    meta: {
      table: { disable: true },
    },
  },
  args: {
    meta,
  },
} satisfies Meta<typeof CardsBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCards",
      title: "Kom i gang",
      columns: 3,
      imagePlacement: "top",
      items: [
        {
          title: "For designere",
          kicker: "Design",
          cardText: "Figma-oppsett, farger og tokens.",
          imageUrl: null,
          theme: "primary-color-red",
          url: null,
          contentPath: "/docs/test",
        },
        {
          title: "For utviklere",
          kicker: "Kode",
          cardText: "Installasjon og komponentbruk.",
          imageUrl: null,
          theme: "additional-color-ocean",
          url: "https://github.com/norwegianredcross/DesignSystem",
          contentPath: null,
        },
        {
          // No link ("none" in the editor): renders as a plain card.
          title: "Uten lenke",
          kicker: null,
          cardText: "Kort kan også stå uten lenke.",
          imageUrl: null,
          theme: null,
          url: null,
          contentPath: null,
        },
      ],
    },
  },
};

/** Image cards with the block-level placement applied to every card. */
export const WithImages: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCards",
      title: "Med bilder",
      columns: 2,
      imagePlacement: "top",
      items: [
        {
          title: "Bilde over teksten",
          kicker: null,
          cardText: "imagePlacement: top stabler bildet over teksten.",
          imageUrl: "https://placehold.co/384x216/D52B1E/fff?text=Kort",
          theme: null,
          url: null,
          contentPath: null,
        },
        {
          title: "Også med bilde",
          kicker: null,
          cardText: "Samme plassering gjelder alle kortene i blokken.",
          imageUrl: "https://placehold.co/384x216/1E1E1E/fff?text=Kort",
          theme: "additional-color-jungle",
          url: null,
          contentPath: null,
        },
      ],
    },
  },
};
