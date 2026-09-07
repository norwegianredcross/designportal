import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { classifyToken, groupTokens } from "@/components/blocks/designTokens";
import { TokensBrowser } from "@/components/blocks/TokensBrowser";

// Storybook loads rk-designsystem/styles.css (see .storybook/preview.ts), so
// the browser reads the REAL theme here - the stories assert against tokens
// the library is known to define, not a fixture.
const storyMeta = {
  title: "Blocks/TokensBrowser",
  component: TokensBrowser,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
} satisfies Meta<typeof TokensBrowser>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

/** Colours open first: the brand red scope leads, and every swatch names
 * its token and offers a copy button. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByRole("heading", { level: 3, name: /Farger/ })).toBeVisible());
    const groupHeadings = canvas.getAllByRole("heading", { level: 4 });
    await expect(groupHeadings[0]).toHaveTextContent("Primary Color Red");
    await expect(canvas.getByTitle("--ds-color-primary-color-red-base-default")).toHaveTextContent("base-default");
    await expect(
      canvas.getByRole("button", { name: "Kopier --ds-color-primary-color-red-base-default" }),
    ).toBeVisible();
  },
};

/** Switching category swaps the list: sizes render as bars, naturally
 * sorted so size-2 comes before size-10. The toggle items are labels
 * around visually hidden radios, so the click goes to the visible text. */
export const Sizes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => expect(canvas.getByText("Størrelser og avstand")).toBeVisible());
    await userEvent.click(canvas.getByText("Størrelser og avstand"));
    await expect(canvas.getByRole("heading", { level: 3, name: /Størrelser og avstand/ })).toBeVisible();
    const names = canvas.getAllByText(/^--ds-size-\d+$/).map((el) => el.textContent ?? "");
    await expect(names.indexOf("--ds-size-2")).toBeLessThan(names.indexOf("--ds-size-10"));
  },
};

/** The pure classifier, checked on names the theme is known to use. */
export const Classification: Story = {
  play: async () => {
    const red = classifyToken("--ds-color-primary-color-red-base-default", "#d52b1e");
    await expect(red).toMatchObject({ category: "colors", group: "primary-color-red", subGroup: "base" });
    const size = classifyToken("--ds-size-4", "1rem");
    await expect(size).toMatchObject({ category: "sizes", group: "spacing" });
    const font = classifyToken("--ds-font-size-2", "0.875rem");
    await expect(font).toMatchObject({ category: "typography", group: "font", subGroup: "size" });
    const grouped = groupTokens([red, size, font, classifyToken("--ds-color-neutral-text-default", "#222")]);
    await expect(grouped.colors?.map((g) => g.name)).toEqual(["primary-color-red", "neutral"]);
  },
};
