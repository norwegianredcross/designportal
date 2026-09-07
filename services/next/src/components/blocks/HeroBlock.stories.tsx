import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { HeroBlock } from "@/components/blocks/HeroBlock";

const meta: MetaData = {
  apiUrl: "http://localhost:8080/site/designsystem-docs/master",
  baseUrl: "/",
  canRender: true,
  catchAll: false,
  defaultLocale: "no",
  locale: "no",
  id: "130dd4c1-5e99-4164-800e-356b027754f8",
  path: "forside",
  renderMode: RENDER_MODE.NEXT,
  requestType: XP_REQUEST_TYPE.PAGE,
  type: "no.rodekors.docs:page",
};

const storyMeta = {
  title: "Blocks/HeroBlock",
  component: HeroBlock,
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
} satisfies Meta<typeof HeroBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

const photo = {
  _id: "photo",
  imageUrl: `data:image/svg+xml;utf8,${encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 540"><rect width="720" height="540" fill="#c9cfd6"/><circle cx="520" cy="200" r="90" fill="#e6e9ec"/><path d="M0 540 L260 300 L420 430 L560 340 L720 480 V540 Z" fill="#8a949e"/></svg>',
  )}`,
  imageUrl2x: null,
  data: { altText: "Frivillige i arbeid" },
};

/** The docs front page as seeded: stamp above the kicker, display title,
 * lead and two calls to action, with the cross in the bottom-right cut. */
export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockHero",
      badge: "1.4",
      badgeMeta: "Open Source",
      kicker: "Designsystem",
      title: "Ett system for Røde Kors sine digitale flater",
      lead: "Formspråket, retningslinjene, komponentbiblioteket og designtokens — samlet ett sted, slik at det som skal se likt ut faktisk gjør det.",
      image: null,
      actions: [
        { linkText: "Kom i gang", url: null, contentPath: "/docs/kode" },
        { linkText: "Se komponentene", url: null, contentPath: "/docs/komponenter" },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Ett system for");
    await expect(canvas.getAllByRole("link")).toHaveLength(2);
    await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
  },
};

/** With a photo the panel splits, the picture to the right of the text. */
export const MedBilde: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockHero",
      badge: null,
      badgeMeta: null,
      kicker: "Gi livreddende nødhjelp",
      title: "Støtt arbeidet vårt",
      lead: null,
      image: photo,
      actions: [{ linkText: "Lær mer om støtte", url: "https://www.rodekors.no", contentPath: null }],
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("img", { name: "Frivillige i arbeid" })).toBeVisible();
  },
};

/** Without a stamp the text starts at the kicker; the cut stays. */
export const UtenMerke: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockHero",
      badge: null,
      badgeMeta: null,
      kicker: null,
      title: "Et enklere landingspanel",
      lead: "Uten merke starter panelet rett på tittelen.",
      image: null,
      actions: [{ linkText: "Les mer", url: null, contentPath: "/docs/kode" }],
    },
  },
};

/** Title only: every other field is optional and nothing renders empty. */
export const BareTittel: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockHero",
      badge: null,
      badgeMeta: null,
      kicker: null,
      title: "Bare en tittel",
      lead: null,
      image: null,
      actions: [],
    },
  },
};

/** An action with neither an internal nor an external target is dropped
 * rather than rendered as a button that goes nowhere. */
export const HandlingUtenMal: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockHero",
      badge: "1.4",
      badgeMeta: null,
      kicker: "Designsystem",
      title: "Én knapp forsvinner",
      lead: "Den andre handlingen mangler lenkemål, så bare den første vises.",
      image: null,
      actions: [
        { linkText: "Har mål", url: "https://www.rodekors.no", contentPath: null },
        { linkText: "Mangler mål", url: null, contentPath: null },
      ],
    },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole("link")).toHaveLength(1);
  },
};
