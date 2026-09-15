import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: ["@storybook/addon-vitest", "@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-mcp"],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      // Keep the registry shared between the adapter's index and JSX views.
      optimizeDeps: {
        exclude: ["@enonic/nextjs-adapter"],
        include: ["next/dist/client/add-base-path", "next/dist/shared/lib/router/utils/parse-url", "html-react-parser"],
      },
      resolve: {
        alias: [
          {
            find: /^@enonic\/nextjs-adapter$/,
            replacement: fileURLToPath(new URL("./adapter-browser.ts", import.meta.url)),
          },
          {
            find: /^(?:@enonic\/nextjs-adapter\/views\/RichTextView|\.\/RichTextView)$/,
            replacement: fileURLToPath(new URL("./mocks/RichTextView.tsx", import.meta.url)),
          },
        ],
      },
    });
  },
};
export default config;
