import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeBlock } from "@/components/blocks/CodeBlock";

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
  title: "Blocks/CodeBlock",
  component: CodeBlock,
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
} satisfies Meta<typeof CodeBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCode",
      code: "npm install rk-designsystem @digdir/designsystemet-react@1.13.3 @digdir/designsystemet-css@1.13.3",
      language: "bash",
      label: "npm-kommando",
    },
  },
};

/** Markup in samples renders as text (React escapes it) — never executes. */
export const Markup: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockCode",
      code: '<Button data-color="primary-color-red">Bidra i dag</Button>',
      language: "tsx",
      label: null,
    },
  },
};
