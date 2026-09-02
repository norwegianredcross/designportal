// Same stylesheets in the same order as the app's layout.tsx. Storybook that
// loads a different set renders a different page than production, which is how
// a defect hides in a green story.
import "../src/styles/reset.css";
import "rk-designsystem/styles.css";
import "../src/styles/globals.css";
import "../src/styles/rk-prose.css";
import "../src/styles/flow.css";

import type { Preview } from "@storybook/nextjs-vite";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
};

export default preview;
