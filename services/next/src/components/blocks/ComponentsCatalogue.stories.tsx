import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { ComponentsCatalogue } from "@/components/blocks/ComponentsCatalogue";
import { storybookDocsUrl } from "@/utils";

// A fixture in the exact shape fetchCatalogue() produces, so the stories
// exercise the grid without the network the server block needs.
const storybookUrl = "https://norwegianredcross.github.io/DesignSystem/storybook";
const names = ["Alert", "Button", "Card", "DatePicker", "Suggestion", "ToggleGroup", "ValidationMessage"];
const components = names.map((name) => ({ name, docsUrl: storybookDocsUrl(storybookUrl, name) }));

const storyMeta = {
  title: "Blocks/ComponentsCatalogue",
  component: ComponentsCatalogue,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { components, showSearch: true },
} satisfies Meta<typeof ComponentsCatalogue>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

/** Every tile links to the component's Storybook docs page; the id is the
 * lower-cased name, so ToggleGroup lands on components-togglegroup. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole("listitem")).toHaveLength(names.length);
    const toggleGroup = canvas.getByRole("link", { name: /ToggleGroup/ });
    await expect(toggleGroup).toHaveAttribute("href", `${storybookUrl}/?path=/docs/components-togglegroup--docs`);
    await expect(toggleGroup).toHaveAttribute("target", "_blank");
  },
};

/** Typing filters by name, case-insensitively; the count follows; the
 * clear button restores everything. */
export const Filtering: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("status")).toHaveTextContent(`${names.length} komponenter`);
    const search = canvas.getByRole("searchbox", { name: "Søk etter komponent" });
    await userEvent.type(search, "date");
    await expect(canvas.getAllByRole("listitem")).toHaveLength(1);
    await expect(canvas.getByRole("link", { name: /DatePicker/ })).toBeVisible();
    await expect(canvas.getByRole("status")).toHaveTextContent(`1 av ${names.length} komponenter`);
    await userEvent.click(canvas.getByRole("button", { name: /tøm/i }));
    await expect(canvas.getAllByRole("listitem")).toHaveLength(names.length);
  },
};

/** No match: a message instead of an empty grid, and the count says 0. */
export const NoMatch: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole("searchbox"), "xyz");
    await expect(canvas.queryByRole("list")).not.toBeInTheDocument();
    await expect(canvas.getByText("Ingen komponenter matcher «xyz».")).toBeVisible();
    await expect(canvas.getAllByRole("status")[0]).toHaveTextContent(`0 av ${names.length} komponenter`);
  },
};

/** Editors can hide the search field (short lists, or a curated page). */
export const WithoutSearch: Story = {
  args: { showSearch: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("searchbox")).not.toBeInTheDocument();
    await expect(canvas.getAllByRole("listitem")).toHaveLength(names.length);
  },
};

/** A name without a pictogram still renders, with a neutral placeholder. */
export const UnknownComponent: Story = {
  args: { components: [{ name: "NyKomponent", docsUrl: storybookDocsUrl(storybookUrl, "NyKomponent") }] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: /NyKomponent/ })).toBeVisible();
    await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
  },
};
