import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextImageBlock } from "@/components/blocks/TextImageBlock";

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
  title: "Blocks/TextImageBlock",
  component: TextImageBlock,
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
} satisfies Meta<typeof TextImageBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

/** The RØFF-style hero: notched image right, CTA button, no panel. */
export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockTextImage",
      kicker: "Friluftsliv og førstehjelp",
      title: "Bli med på laget",
      text: null,
      buttonText: "Meld deg på her",
      url: "https://www.rodekors.no",
      contentPath: null,
      imageUrl: "https://placehold.co/800x600/2E7D32/fff?text=Bilde",
      altText: "Telt i skogen",
      imagePlacement: "right",
      form: "notch",
      notchCorner: "bottom-right",
      notchWidth: 35,
      notchDepth: 28,
      theme: null,
    },
  },
};

/** Image left, tinted panel, rich text body — the sub-brand page layout. */
export const PanelVenstre: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockTextImage",
      kicker: "Stikktittel",
      title: "Hjelp oss å fylle blodlagrene",
      text: {
        processedHtml: "<p>Som frivillig i Røde Kors kan du engasjere deg i mange ulike aktiviteter.</p>",
        links: [],
        images: [],
      },
      buttonText: "Sjekk om du kan gi blod",
      url: null,
      contentPath: "/docs/kom-i-gang",
      imageUrl: "https://placehold.co/800x600/D52B1E/fff?text=Bilde",
      altText: "Blodgiver",
      imagePlacement: "left",
      form: "rounded",
      notchCorner: null,
      notchWidth: null,
      notchDepth: null,
      theme: "additional-color-ocean",
    },
  },
};

/** Top-left corner notch and no CTA — pins the corner mapping's top/left
 * paths and the button-less spacing. */
export const ToppVenstreUtenKnapp: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockTextImage",
      kicker: null,
      title: "Uten knapp",
      text: {
        processedHtml: "<p>Utsnittet kan også sitte i et av toppens hjørner.</p>",
        links: [],
        images: [],
      },
      buttonText: null,
      url: null,
      contentPath: null,
      imageUrl: "https://placehold.co/800x600/78909C/fff?text=Bilde",
      altText: "Illustrasjon",
      imagePlacement: "right",
      form: "notch",
      notchCorner: "top-left",
      notchWidth: 40,
      notchDepth: 22,
      theme: null,
    },
  },
};
