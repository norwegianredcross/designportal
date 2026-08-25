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

export const Liten: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCards",
      title: "Liten (3 kolonner, bilde over)",
      columns: 3,
      imagePlacement: "top",
      items: [
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          imageUrl: "https://placehold.co/384x216/D52B1E/fff?text=Kort",
          theme: null,
          url: "https://www.rodekors.no",
          contentPath: null,
        },
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          imageUrl: "https://placehold.co/384x216/1E1E1E/fff?text=Kort",
          theme: null,
          url: null,
          contentPath: "/docs/test",
        },
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          imageUrl: "https://placehold.co/384x216/78909C/fff?text=Kort",
          theme: null,
          url: null,
          contentPath: null,
        },
      ],
    },
  },
};

/** Medium: two horizontal cards per row, 4:3 image beside the text. */
export const Medium: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCards",
      title: "Medium (2 kolonner, bilde ved siden av)",
      columns: 2,
      imagePlacement: "left",
      items: [
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          imageUrl: "https://placehold.co/384x288/D52B1E/fff?text=Kort",
          theme: null,
          url: "https://www.rodekors.no",
          contentPath: null,
        },
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          imageUrl: "https://placehold.co/384x288/1E1E1E/fff?text=Kort",
          theme: null,
          url: null,
          contentPath: null,
        },
      ],
    },
  },
};

/** Stor: one full-width card per row with the roomier 40px padding. */
export const Stor: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCards",
      title: "Stor (1 kolonne)",
      columns: 1,
      imagePlacement: "left",
      items: [
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          imageUrl: "https://placehold.co/384x216/D52B1E/fff?text=Kort",
          theme: null,
          url: "https://www.rodekors.no",
          contentPath: null,
        },
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          imageUrl: "https://placehold.co/384x216/1E1E1E/fff?text=Kort",
          theme: null,
          url: null,
          contentPath: null,
        },
      ],
    },
  },
};

/** Uten bilde: plain tinted panels; also exercises per-card themes and the
 * three link states (internal contentPath, external url, none). */
export const UtenBilde: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCards",
      title: "Uten bilde",
      columns: 3,
      imagePlacement: null,
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

/** Mirrored placements (bottom/right) plus a theme on an image card and a
 * card without title — pins the reverse layout paths. */
export const Speilvendt: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCards",
      title: "Speilvendt (bilde under / til høyre)",
      columns: 2,
      imagePlacement: "right",
      items: [
        {
          title: "Bilde til høyre",
          kicker: "Stikktittel",
          cardText: "imagePlacement: right speiler den horisontale layouten.",
          imageUrl: "https://placehold.co/384x288/2E7D32/fff?text=Kort",
          theme: "additional-color-jungle",
          url: "https://www.rodekors.no",
          contentPath: null,
        },
        {
          // No title: the kicker and text still stack correctly.
          title: null,
          kicker: "Uten tittel",
          cardText: "Kort uten tittel skal ikke etterlate tomrom.",
          imageUrl: "https://placehold.co/384x288/1E1E1E/fff?text=Kort",
          theme: null,
          url: null,
          contentPath: null,
        },
      ],
    },
  },
};
