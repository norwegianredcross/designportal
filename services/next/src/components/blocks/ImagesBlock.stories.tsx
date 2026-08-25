import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ImagesBlock } from "@/components/blocks/ImagesBlock";

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
  title: "Blocks/ImagesBlock",
  component: ImagesBlock,
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
} satisfies Meta<typeof ImagesBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockImages",
      items: [
        {
          imageUrl: "https://placehold.co/768x432/D52B1E/fff?text=Bilde",
          altText: "Frivillige fra Røde Kors deler ut mat",
          caption: "Frivillige i aksjon under vinterberedskapen.",
        },
      ],
    },
  },
};

/** Several entries render as a stacked gallery; captions are optional. */
export const Gallery: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockImages",
      items: [
        {
          imageUrl: "https://placehold.co/768x432/D52B1E/fff?text=1",
          altText: "Første bilde",
          caption: "Med bildetekst.",
        },
        {
          imageUrl: "https://placehold.co/768x432/1E1E1E/fff?text=2",
          altText: "Andre bilde",
          caption: null,
        },
      ],
    },
  },
};
