"use client";

import { useState } from "react";
import { Button } from "rk-designsystem";

/**
 * The one interactive piece of the code block, isolated in its own client
 * component so the block itself stays a server component: only this button
 * ships JavaScript to the browser.
 *
 * Why 'use client' here when rk-designsystem is RSC-ready: the library's
 * banners let server components RENDER its components — but this file
 * defines its own state and event handler, and a server component cannot
 * pass a function across the boundary (props must be serializable). The
 * rule: render design system components -> server component; wire your own
 * behavior into them -> smallest possible client island, like this one.
 */
// TODO(i18n): "Kopier"/"Kopiert" are hardcoded Norwegian — the frontend has
// no UI-string i18n layer yet. When the EN content layer arrives, these
// belong in whatever mechanism it brings.
export function CopyButton({ code, label }: { code: string; label?: string | null }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="secondary"
      data-size="sm"
      aria-label={label ? `Kopier ${label}` : "Kopier koden"}
      onClick={() => {
        // Optional chaining: navigator.clipboard is undefined outside secure
        // contexts, and writeText can reject on denied permission — in both
        // cases the button just does nothing rather than throwing.
        navigator.clipboard?.writeText(code).then(
          () => {
            setCopied(true);
            // Revert the confirmation after a moment, like the docs SPA's
            // copy button.
            window.setTimeout(() => setCopied(false), 2000);
          },
          () => undefined,
        );
      }}
    >
      {copied ? "Kopiert" : "Kopier"}
    </Button>
  );
}
