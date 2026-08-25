import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import ContentHeader from "@/components/parts/ContentHeader";

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
  title: "Parts/ContentHeader",
  component: ContentHeader,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    meta: { table: { disable: true } },
    part: { table: { disable: true } },
    path: { table: { disable: true } },
    common: { table: { disable: true } },
  },
  args: {
    meta,
    part: { descriptor: "no.rodekors.docs:content-header", config: {} },
    path: "om-oss",
  },
} satisfies Meta<typeof ContentHeader>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Default: Story = {
  args: {
    data: {
      title: "Bli frivillig i Røde Kors",
      intro: {
        processedHtml: "<p>Som frivillig i Røde Kors blir du en del av verdens største humanitære nettverk.</p>",
        links: [],
      },
    },
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("heading", {
        level: 1,
        name: /bli frivillig i røde kors/i,
      }),
    ).toBeVisible();
  },
};

export const TitleOnly: Story = {
  args: {
    data: {
      title: "Kontakt oss",
      intro: null,
    },
  },
};
