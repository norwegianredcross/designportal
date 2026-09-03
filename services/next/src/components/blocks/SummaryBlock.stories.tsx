import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { MetaData } from "@enonic/nextjs-adapter/types/componentProps";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SummaryBlock } from "@/components/blocks/SummaryBlock";

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
  title: "Blocks/SummaryBlock",
  component: SummaryBlock,
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
} satisfies Meta<typeof SummaryBlock>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

/** The wireframe's shape: three figures with labels and descriptions,
 * plus the bottom-right link. */
export const Default: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockSummary",
      width: null,
      title: "Designsystemet i tall",
      intro: "En rask oversikt over hva biblioteket inneholder i dag.",
      alignment: null,
      items: [
        { label: "Komponenter", value: "30+", description: "klare til bruk" },
        { label: "Tokens", value: "200+", description: "farger, avstander og typografi" },
        { label: "Vurdering", value: "4,2", description: "fra utviklerundersøkelsen" },
      ],
      linkText: "Se komponentene",
      url: null,
      contentPath: "/docs/kom-i-gang",
    },
  },
};

/** Minimal and centered: values only, no link — nothing renders empty. */
export const KunTall: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockSummary",
      width: null,
      title: null,
      intro: null,
      alignment: "center",
      items: [
        { label: null, value: "40 %", description: null },
        { label: null, value: "120", description: null },
      ],
      linkText: null,
      url: null,
      contentPath: null,
    },
  },
};

/** Max capacity spread across the width, with a wide value — pins wrap. */
export const SeksTall: Story = {
  args: {
    data: {
      __typename: "no_rodekors_docs_BlockSummary",
      width: null,
      title: "Full bredde",
      intro: null,
      alignment: "spread",
      items: [
        { label: "Én", value: "1 000 000+", description: "bred verdi" },
        { label: "To", value: "40 %", description: null },
        { label: "Tre", value: "4,2", description: null },
        { label: "Fire", value: "120", description: null },
        { label: "Fem", value: "99", description: null },
        { label: "Seks", value: "7", description: null },
      ],
      linkText: null,
      url: null,
      contentPath: null,
    },
  },
};
