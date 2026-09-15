import type { PageData } from "@enonic/nextjs-adapter";
import { ComponentRegistry, RENDER_MODE, XP_COMPONENT_TYPE, XP_REQUEST_TYPE } from "@enonic/nextjs-adapter";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { Block } from "@/types/blocks";
import type { GetContentHeaderQuery } from "@/types/queries";
import type { Get } from "@/types/utils";
import DefaultPage from "./Default";
import "../_mappings";

function composedPage(header: Get<GetContentHeaderQuery, "guillotine.get.data">, blocks: Block[]): PageData {
  return {
    descriptor: "no.rodekors.docs:default",
    config: { variant: "narrow" },
    regions: {
      header: {
        name: "header",
        components: [
          {
            type: XP_COMPONENT_TYPE.PART,
            path: "/header/0",
            part: { descriptor: "no.rodekors.docs:content-header", config: {} },
            data: header,
          },
        ],
      },
      main: {
        name: "main",
        components: [
          {
            type: XP_COMPONENT_TYPE.PART,
            path: "/main/0",
            part: { descriptor: "no.rodekors.docs:blocks-view", config: {} },
            data: blocks,
          },
        ],
      },
    },
  };
}

const storyMeta = {
  title: "Pages/Default",
  component: DefaultPage,
  args: {
    path: "/",
    page: composedPage({ title: "Design-tokens", kicker: null, intro: null }, [
      { __typename: "no_rodekors_docs_BlockText", title: "Før listen", text: null },
    ]),
    meta: {
      apiUrl: "http://localhost:8081/site/designsystem-docs/master",
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
      get: { _path: "/docs/tokens" },
      nav: null,
      layout: {
        kind: "tokens",
        intro: null,
        showSearch: null,
        maxReleases: null,
        title: "Tokenoversikt",
        after: [{ __typename: "no_rodekors_docs_BlockText", title: "Etter listen", text: null }],
      },
    },
  },
} satisfies Meta<typeof DefaultPage>;

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
    page: composedPage(
      {
        title: "Vanlig artikkel",
        kicker: null,
        intro: { processedHtml: "<p>Innledning med riktekst.</p><p>Et nytt avsnitt.</p>", links: [] },
      },
      [{ __typename: "no_rodekors_docs_BlockText", title: "Artikkelinnhold", text: null }],
    ),
    data: {
      get: { _path: "/docs/design/new-page" },
      nav: null,
      layout: {
        kind: "article",
        title: null,
        intro: null,
        showSearch: null,
        maxReleases: null,
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

export const EmptyEditableRegions: Story = {
  // Empty regions must remain targetable while composing a template. Populated
  // edit-mode views are server-rendered in XP; the adapter's browser-only empty
  // output probe hydrates a detached empty div and is unsuitable for Storybook.
  args: {
    meta: { ...storyMeta.args.meta, renderMode: RENDER_MODE.EDIT },
    page: {
      descriptor: "no.rodekors.docs:default",
      regions: { header: { name: "header", components: [] }, main: { name: "main", components: [] } },
    },
    data: { get: null, nav: null, layout: null },
  },
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector('[data-portal-region="header"]')).not.toBeNull();
    expect(canvasElement.querySelector('[data-portal-region="main"]')).not.toBeNull();
    expect(ComponentRegistry.getContentType("no.rodekors.docs:page")).toBeUndefined();
    expect(ComponentRegistry.getPage("no.rodekors.docs:default")?.view).toBeDefined();
  },
};
