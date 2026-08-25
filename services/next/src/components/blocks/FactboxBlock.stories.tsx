import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FactboxBlock } from "@/components/blocks/FactboxBlock";

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
  title: "Blocks/FactboxBlock",
  component: FactboxBlock,
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
} satisfies Meta<typeof FactboxBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockFactbox",
      title: "Viktig",
      text: {
        processedHtml:
          "<p>Disse formene skal brukes som grafiske, dekorative eller strukturerende elementer. De skal ikke brukes som knapper eller navigasjon.</p>",
        links: [],
        images: [],
      },
      theme: "primary-color-red",
    },
  },
};

/** No theme chosen: falls back to the neutral scope. */
export const NoTheme: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockFactbox",
      title: null,
      text: {
        processedHtml: "<p>En faktaboks uten valgt tema og uten tittel.</p>",
        links: [],
        images: [],
      },
      theme: null,
    },
  },
};
