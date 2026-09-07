import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ChangelogList } from "@/components/blocks/ChangelogList";
import { parseChangelog } from "@/components/blocks/parseChangelog";

// The exact shape the library's release workflow writes, so the parser is
// exercised on real lines rather than on an idealised fixture.
const changelog = `# Changelog

## 1.4.1 (2026-09-03)

- chore(lint): fjern fire døde tilordninger og slå på no-useless-assignment (#164) (4e9cd3ad)


## 1.4.0 (2026-09-02)

- chore(deps-dev): bump glob from 11.1.0 to 13.0.6 (#163) (28b583b9)
- chore(digdir): track the newest Designsystemet 1.x - peer ^1.21.0 (#161) (82765fe7)
- fix(a11y)!: label the newsletter field (#143) (2a2ed0e3)
- Initial release without a type prefix
`;

const releases = parseChangelog(changelog);

const storyMeta = {
  title: "Blocks/ChangelogList",
  component: ChangelogList,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  args: { releases },
} satisfies Meta<typeof ChangelogList>;

export default storyMeta;
type Story = StoryObj<typeof storyMeta>;

/** One section per release, newest first as in the file, each with a
 * version heading, its date and a link to the GitHub release. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const headings = canvas.getAllByRole("heading", { level: 3 });
    await expect(headings.map((h) => h.textContent)).toEqual(["v1.4.1", "v1.4.0"]);
    await expect(canvas.getByRole("link", { name: "#164" })).toHaveAttribute(
      "href",
      "https://github.com/norwegianredcross/DesignSystem/pull/164",
    );
    await expect(canvas.getAllByRole("link", { name: "Se utgivelsen på GitHub" })[0]).toHaveAttribute(
      "href",
      "https://github.com/norwegianredcross/DesignSystem/releases/tag/v1.4.1",
    );
  },
};

/** The parser: type becomes the tag, scope and "!" are dropped from the
 * text, the PR number is split out, the commit hash disappears, and a line
 * without a type is tagged "annet". */
export const Parsing: Story = {
  play: async () => {
    await expect(releases).toHaveLength(2);
    await expect(releases[0]).toMatchObject({ version: "1.4.1", date: "2026-09-03" });
    await expect(releases[0]?.items[0]).toEqual({
      kind: "chore",
      text: "fjern fire døde tilordninger og slå på no-useless-assignment",
      prNumber: "164",
    });
    await expect(releases[1]?.items[2]).toMatchObject({
      kind: "fix",
      text: "label the newsletter field",
      prNumber: "143",
    });
    await expect(releases[1]?.items[3]).toEqual({
      kind: "annet",
      text: "Initial release without a type prefix",
      prNumber: undefined,
    });
  },
};

/** An empty file parses to no releases and renders nothing. */
export const Empty: Story = {
  args: { releases: parseChangelog("# Changelog\n") },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("heading")).not.toBeInTheDocument();
  },
};
