import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
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
      intro: null,
      linkText: null,
      url: null,
      contentPath: null,
      columns: 3,
      imagePlacement: "top",
      items: [
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          image: {
            _id: "story-card-1",
            imageUrl: "https://placehold.co/384x216/D52B1E/fff?text=Kort",
            imageUrl2x: "https://placehold.co/768x432/D52B1E/fff?text=Kort",
            data: { altText: null },
          },
          theme: null,
          url: "https://www.rodekors.no",
          contentPath: null,
        },
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          image: {
            _id: "story-card-2",
            imageUrl: "https://placehold.co/384x216/1E1E1E/fff?text=Kort",
            imageUrl2x: "https://placehold.co/768x432/1E1E1E/fff?text=Kort",
            data: { altText: null },
          },
          theme: null,
          url: null,
          contentPath: "/docs/test",
        },
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          image: {
            _id: "story-card-3",
            imageUrl: "https://placehold.co/384x216/78909C/fff?text=Kort",
            imageUrl2x: "https://placehold.co/768x432/78909C/fff?text=Kort",
            data: { altText: null },
          },
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
      intro: null,
      linkText: null,
      url: null,
      contentPath: null,
      columns: 2,
      imagePlacement: "left",
      items: [
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          image: {
            _id: "story-card-4",
            imageUrl: "https://placehold.co/384x288/D52B1E/fff?text=Kort",
            imageUrl2x: "https://placehold.co/768x576/D52B1E/fff?text=Kort",
            data: { altText: null },
          },
          theme: null,
          url: "https://www.rodekors.no",
          contentPath: null,
        },
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          image: {
            _id: "story-card-5",
            imageUrl: "https://placehold.co/384x288/1E1E1E/fff?text=Kort",
            imageUrl2x: "https://placehold.co/768x576/1E1E1E/fff?text=Kort",
            data: { altText: null },
          },
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
      intro: null,
      linkText: null,
      url: null,
      contentPath: null,
      columns: 1,
      imagePlacement: "left",
      items: [
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          image: {
            _id: "story-card-6",
            imageUrl: "https://placehold.co/384x216/D52B1E/fff?text=Kort",
            imageUrl2x: "https://placehold.co/768x432/D52B1E/fff?text=Kort",
            data: { altText: null },
          },
          theme: null,
          url: "https://www.rodekors.no",
          contentPath: null,
        },
        {
          title: "Dette er overskriften",
          kicker: "Stikktittel",
          cardText: "Dette er beskrivelsen",
          image: {
            _id: "story-card-7",
            imageUrl: "https://placehold.co/384x216/1E1E1E/fff?text=Kort",
            imageUrl2x: "https://placehold.co/768x432/1E1E1E/fff?text=Kort",
            data: { altText: null },
          },
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
      intro: null,
      linkText: null,
      url: null,
      contentPath: null,
      columns: 3,
      imagePlacement: null,
      items: [
        {
          title: "For designere",
          kicker: "Design",
          cardText: "Figma-oppsett, farger og tokens.",
          image: null,
          theme: "primary-color-red",
          url: null,
          contentPath: "/docs/test",
        },
        {
          title: "For utviklere",
          kicker: "Kode",
          cardText: "Installasjon og komponentbruk.",
          image: null,
          theme: "additional-color-ocean",
          url: "https://github.com/norwegianredcross/DesignSystem",
          contentPath: null,
        },
        {
          // No link ("none" in the editor): renders as a plain card.
          title: "Uten lenke",
          kicker: null,
          cardText: "Kort kan også stå uten lenke.",
          image: null,
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
      intro: null,
      linkText: null,
      url: null,
      contentPath: null,
      columns: 2,
      imagePlacement: "right",
      items: [
        {
          title: "Bilde til høyre",
          kicker: "Stikktittel",
          cardText: "imagePlacement: right speiler den horisontale layouten.",
          image: {
            _id: "story-card-8",
            imageUrl: "https://placehold.co/384x288/2E7D32/fff?text=Kort",
            imageUrl2x: "https://placehold.co/768x576/2E7D32/fff?text=Kort",
            data: { altText: null },
          },
          theme: "additional-color-jungle",
          url: "https://www.rodekors.no",
          contentPath: null,
        },
        {
          // No title: the kicker and text still stack correctly.
          title: null,
          kicker: "Uten tittel",
          cardText: "Kort uten tittel skal ikke etterlate tomrom.",
          image: {
            _id: "story-card-9",
            imageUrl: "https://placehold.co/384x288/1E1E1E/fff?text=Kort",
            imageUrl2x: "https://placehold.co/768x576/1E1E1E/fff?text=Kort",
            data: { altText: null },
          },
          theme: null,
          url: null,
          contentPath: null,
        },
      ],
    },
  },
};

/** The section shape the "forside generisk" block template repeats: title,
 * ingress, content, and a "see more" link parked bottom right. The link needs
 * BOTH a text and a target — the story below it proves the half-filled case
 * renders nothing rather than an empty link. */
export const MedIngressOgLenke: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Slik kommer du i gang med designsystemet.")).toBeVisible();
    const link = canvas.getByRole("link", { name: /Se alle snarveier/ });
    await expect(link).toHaveAttribute("href", "/kom-i-gang");
  },
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCards",
      title: "Snarveier",
      intro: "Slik kommer du i gang med designsystemet.",
      linkText: "Se alle snarveier",
      url: null,
      contentPath: "/docs/kom-i-gang",
      columns: 3,
      imagePlacement: null,
      items: [
        {
          title: "Komponenter",
          kicker: null,
          cardText: "Alle komponentene med kode og retningslinjer.",
          image: null,
          theme: null,
          url: null,
          contentPath: "/docs/komponenter",
        },
        {
          title: "Design tokens",
          kicker: null,
          cardText: "Farger, typografi og avstander som verdier.",
          image: null,
          theme: null,
          url: null,
          contentPath: "/docs/tokens",
        },
        {
          title: "Design retning",
          kicker: null,
          cardText: "Formspråket bak systemet.",
          image: null,
          theme: null,
          url: null,
          contentPath: "/docs/designretning",
        },
      ],
    },
  },
};

/** Half a link is no link: a linkText without a target (or the other way
 * round) must not render an empty affordance. */
export const LenkeUtenMal: Story = {
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("link", { name: /Se alle/ })).toBeNull();
  },
  args: {
    data: {
      ...(MedIngressOgLenke.args?.data as NonNullable<Story["args"]>["data"]),
      contentPath: null,
    },
  },
};
