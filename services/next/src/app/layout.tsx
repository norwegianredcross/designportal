import { PORTAL_COMPONENT_ATTRIBUTE } from "@enonic/nextjs-adapter";
import { Source_Sans_3 } from "next/font/google";
// Import ORDER is the cascade order, so it is load bearing — same sequence
// as the CMS100002-web project:
//
//   reset      strips browser defaults (including every margin)
//   library    design tokens (--ds-* variables, color scopes), the Digdir
//              base component CSS and the RK theme, in one import. Block
//              views never write visual CSS — they render design system
//              components whose class names this stylesheet targets, and
//              colors come from data-color scopes swapping token values.
//   globals    the app frame: body layout and the centered main column
//   rk-prose   the CMS rich-text wrapper
//   flow       puts vertical rhythm back where the reset removed it, so it
//              has to come after everything that lays elements out
import "@/styles/reset.css";
import "rk-designsystem/styles.css";
import "@/styles/globals.css";
import "@/styles/rk-prose.css";
import "@/styles/flow.css";

/**
 * Remembers the reader's light/dark choice across pages.
 *
 * The Header's toggle only sets data-color-scheme on the current document;
 * every link here is a full page load, so the next page came back light.
 * This runs before first paint (inline, in <head>) and does two things:
 * re-applies the stored choice so there is no flash of the wrong scheme,
 * and watches the attribute so the Header's toggle keeps storing it. No
 * change in the library: the Header already reads the attribute on mount.
 * localStorage is per origin, i.e. per environment, which is what we want.
 */
const REMEMBER_COLOR_SCHEME = `(function(){var k="rk-color-scheme",h=document.documentElement;try{var s=localStorage.getItem(k);if(s==="dark"||s==="light")h.setAttribute("data-color-scheme",s)}catch(e){}new MutationObserver(function(){var v=h.getAttribute("data-color-scheme");try{if(v==="dark"||v==="light")localStorage.setItem(k,v)}catch(e){}}).observe(h,{attributes:true,attributeFilter:["data-color-scheme"]})})();`;

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bodyAttrs: Record<string, string> = {
    [PORTAL_COMPONENT_ATTRIBUTE]: "page",
  };

  return (
    // data-color sets the default color scope for the whole page: without
    // it, components fall back to the neutral scope (dark buttons instead
    // of RK red). Blocks with their own theme choice override it locally.
    // suppressHydrationWarning: the inline script below may add
    // data-color-scheme before React hydrates, and that is intended.
    <html lang="no" className={sourceSans3.className} data-color="primary-color-red" suppressHydrationWarning>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, first-party script; see REMEMBER_COLOR_SCHEME */}
        <script dangerouslySetInnerHTML={{ __html: REMEMBER_COLOR_SCHEME }} />
      </head>
      <body {...bodyAttrs}>{children}</body>
    </html>
  );
}
