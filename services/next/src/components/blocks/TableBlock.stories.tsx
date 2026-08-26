import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TableBlock } from "@/components/blocks/TableBlock";

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
  title: "Blocks/TableBlock",
  component: TableBlock,
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
} satisfies Meta<typeof TableBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

/** A typical docs table: header row + zebra body rows. */
export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockTable",
      title: "Tokens",
      table: {
        // The attributes mirror what Content Studio's table dialog writes
        // (inline fixed width included) — the CSS must win over them.
        processedHtml:
          '<table style="width:500px" border="1" cellpadding="1" cellspacing="1"><thead><tr><th>Token</th><th>Verdi</th><th>Bruk</th></tr></thead><tbody>' +
          "<tr><td>--ds-size-4</td><td>16px</td><td>Standard avstand</td></tr>" +
          "<tr><td>--ds-size-5</td><td>20px</td><td>Blokk-gap</td></tr>" +
          "<tr><td>--ds-border-radius-lg</td><td>20px</td><td>Paneler og bilder</td></tr>" +
          "</tbody></table>",
        links: [],
        images: [],
      },
    },
  },
};

/** Wide tables scroll horizontally inside the block instead of breaking
 * the page — resize the viewport to see it. */
export const BredTabell: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockTable",
      title: null,
      table: {
        processedHtml:
          "<table><thead><tr>" +
          Array.from({ length: 8 }, (_, i) => `<th>Kolonne ${i + 1}</th>`).join("") +
          "</tr></thead><tbody><tr>" +
          Array.from({ length: 8 }, () => "<td>Lang celleverdi som ikke brytes lett</td>").join("") +
          "</tr></tbody></table>",
        links: [],
        images: [],
      },
    },
  },
};
