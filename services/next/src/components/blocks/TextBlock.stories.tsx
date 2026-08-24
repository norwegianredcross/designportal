import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextBlock } from "@/components/blocks/TextBlock";

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
  title: "Blocks/TextBlock",
  component: TextBlock,
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
} satisfies Meta<typeof TextBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockText",
      title: "Mange muligheter for deg som vil bidra:",
      text: {
        processedHtml: `
          <p>Som frivillig i Røde Kors kan du engasjere deg på mange måter, for eksempel som besøksvenn, i
          hjelpekorpset, en turgruppe, på språkkafé eller i aktiviteter for barn og ungdom. Du kan også bli
          kursholder eller tilrettelegger for en aktivitet. <a href="#">Les mer om mulighetene for frivillige</a>.</p>

          <p><strong>
            Din lokale Røde Kors-forening kan fortelle mer om tilbudet der du bor og behovet for nye frivillige.
          </strong></p>

          <p><a title="Lokalforeninger i Røde Kors" href="#">Finn din lokalforening</a></p>`,
        links: [],
        images: [],
      },
    },
  },
};
