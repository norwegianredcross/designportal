import { RENDER_MODE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import SidePage from "./SidePage";

const storyMeta = {
  title: "Pages/SidePage",
  component: SidePage,
  args: {
    meta: {
      apiUrl: "http://localhost:8080/site/designsystem-docs/master",
      baseUrl: "/",
      canRender: true,
      catchAll: false,
      defaultLocale: "no",
      locale: "no",
      id: "example",
      path: "tokens",
      renderMode: RENDER_MODE.NEXT,
      requestType: XP_REQUEST_TYPE.PAGE,
      type: "no.rodekors.docs:page",
    },
    data: {
      get: { _path: "/docs/tokens", data: { title: "Design-tokens" } },
      layout: {
        kind: "tokens",
        intro: null,
        showSearch: null,
        maxReleases: null,
        title: "Tokenoversikt",
        before: [{ __typename: "no_rodekors_docs_BlockText", title: "Før listen", text: null }],
        after: [{ __typename: "no_rodekors_docs_BlockText", title: "Etter listen", text: null }],
      },
    },
  },
} satisfies Meta<typeof SidePage>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

export const ContentAroundTokens: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const before = canvas.getByRole("heading", { name: "Før listen" });
    const generated = canvas.getByRole("heading", { name: "Tokenoversikt" });
    const after = canvas.getByRole("heading", { name: "Etter listen" });
    expect(before.compareDocumentPosition(generated) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(generated.compareDocumentPosition(after) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  },
};

export const OrdinaryArticle: Story = {
  args: {
    data: {
      get: {
        data: {
          title: "Vanlig artikkel",
          intro: { processedHtml: "<p>Innledning med riktekst.</p><p>Et nytt avsnitt.</p>", links: [], images: [] },
        },
      },
      layout: {
        kind: "article",
        title: null,
        intro: null,
        showSearch: null,
        maxReleases: null,
        before: [{ __typename: "no_rodekors_docs_BlockText", title: "Artikkelinnhold", text: null }],
        after: [],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { name: "Artikkelinnhold" })).toBeVisible();
    expect(canvas.getByText("Innledning med riktekst.")).toBeVisible();
    expect(canvas.getByText("Et nytt avsnitt.")).toBeVisible();
    expect(canvasElement.querySelector("[data-page-view]")).toBeNull();
  },
};
