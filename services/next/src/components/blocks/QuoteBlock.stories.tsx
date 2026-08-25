import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuoteBlock } from "@/components/blocks/QuoteBlock";

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
  title: "Blocks/QuoteBlock",
  component: QuoteBlock,
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
} satisfies Meta<typeof QuoteBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockQuote",
      text: {
        processedHtml: "<p>«Det er fint å vite at noen kommer. Da blir ikke uken så stille.»</p>",
        links: [],
        images: [],
      },
      author: "Kari Nordmann, Røde Kors",
      imageUrl: null,
      publicationTitle: null,
      publicationUrl: null,
    },
  },
};

/** All optional caption fields empty: the figcaption is skipped entirely. */
export const TextOnly: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockQuote",
      text: {
        processedHtml: "<p>«Som frivillig kan du gjøre en viktig innsats.»</p>",
        links: [],
        images: [],
      },
      author: null,
      imageUrl: null,
      publicationTitle: null,
      publicationUrl: null,
    },
  },
};
