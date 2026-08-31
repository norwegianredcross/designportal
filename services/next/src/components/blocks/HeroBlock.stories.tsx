import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
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

/** The docs front page as seeded: notch with a version stamp, kicker,
 * display title, lead and two calls to action. */
export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockHero",
      badge: "1.3",
      badgeMeta: "Open Source",
      kicker: "Designsystem",
      title: "Ett system for Røde Kors sine digitale flater",
      lead: "Formspråket, retningslinjene, komponentbiblioteket og designtokens — samlet ett sted, slik at det som skal se likt ut faktisk gjør det.",
      actions: [
        { linkText: "Kom i gang", url: null, contentPath: "/docs/kode" },
        { linkText: "Se komponentene", url: null, contentPath: "/docs/komponenter" },
      ],
    },
  },
};

/** No badge, so the notch and the tall top padding it reserved both go —
 * the panel keeps an ordinary corner instead of a step with nothing in it. */
export const UtenHakk: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockHero",
      badge: null,
      badgeMeta: null,
      kicker: null,
      title: "Et enklere landingspanel",
      lead: "Uten merke i hjørnet faller hakket bort, og panelet får vanlig hjørne.",
      actions: [{ linkText: "Les mer", url: null, contentPath: "/docs/kode" }],
    },
  },
};

/** Title only — every other field is optional and nothing renders empty. */
export const BareTittel: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockHero",
      badge: null,
      badgeMeta: null,
      kicker: null,
      title: "Bare en tittel",
      lead: null,
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
      badge: "1.3",
      badgeMeta: null,
      kicker: "Designsystem",
      title: "Én knapp forsvinner",
      lead: "Den andre handlingen mangler lenkemål, så bare den første vises.",
      actions: [
        { linkText: "Har mål", url: "https://www.rodekors.no", contentPath: null },
        { linkText: "Mangler mål", url: null, contentPath: null },
      ],
    },
  },
};
