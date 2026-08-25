import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DemoBlock } from "@/components/blocks/DemoBlock";

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
  title: "Blocks/DemoBlock",
  component: DemoBlock,
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
} satisfies Meta<typeof DemoBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const ButtonVariants: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockDemo",
      demo: "button-variants",
      title: "Knappevarianter",
    },
  },
};

/** No title: just the framed demo panel. */
export const NoTitle: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockDemo",
      demo: "card-scopes",
      title: null,
    },
  },
};

/** Unknown id (registry drift): renders nothing rather than crashing. */
export const UnknownDemo: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockDemo",
      demo: "does-not-exist",
      title: "Skal ikke vises",
    },
  },
};
