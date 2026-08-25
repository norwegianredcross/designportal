import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import BlocksView from "@/components/parts/BlocksView";

const meta: MetaData = {
  apiUrl: "http://localhost:8080/site/rodekors/master",
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
  title: "Parts/BlocksView",
  component: BlocksView,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    meta: { table: { disable: true } },
    part: { table: { disable: true } },
    path: { table: { disable: true } },
  },
  args: {
    meta,
    part: {
      descriptor: "no.rodekors.docs:blocks-view",
      config: {},
    },
    path: "om-oss",
  },
} satisfies Meta<typeof BlocksView>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Mixed: Story = {
  args: {
    data: [
      {
        __typename: "no_rodekors_docs_BlockText",
        title: "Om Røde Kors",
        text: {
          processedHtml: "<p>Røde Kors er en humanitær organisasjon som arbeider for å beskytte liv og helse.</p>",
          links: [],
          images: [],
        },
      },
      {
        __typename: "no_rodekors_docs_BlockAccordion",
        title: "Spørsmål og svar",
        theme: "accent",
        items: [
          {
            title: "Hvordan blir jeg frivillig?",
            text: {
              processedHtml: "<p>Du kan registrere deg via vårt skjema.</p>",
              links: [],
              images: [],
            },
          },
        ],
      },
    ],
  },
  play: async ({ canvas }) => {
    // Proves the typename → component registry routed both block types.
    await expect(canvas.getByRole("heading", { level: 2, name: /om røde kors/i })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 2, name: /spørsmål og svar/i })).toBeVisible();
    await expect(canvas.getByText(/hvordan blir jeg frivillig\?/i)).toBeVisible();
  },
};
