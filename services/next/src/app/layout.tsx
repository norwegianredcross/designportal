import { PORTAL_COMPONENT_ATTRIBUTE } from "@enonic/nextjs-adapter";
import { Source_Sans_3 } from "next/font/google";
import { cookies } from "next/headers";
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
 * The choice lives in a cookie so the SERVER can render the next page in
 * the right scheme from the first byte (see RootLayout); this inline
 * script, run before first paint, only keeps the cookie in step with the
 * toggle by watching the attribute. A cookie rather than localStorage
 * because storage is invisible to the server, and a server-rendered light
 * page that turns dark after hydration is the flash we are removing.
 * No secret in it, no need for HttpOnly; a year is long enough.
 */
const COLOR_SCHEME_COOKIE = "rk-color-scheme";
const REMEMBER_COLOR_SCHEME = `(function(){var h=document.documentElement;new MutationObserver(function(){var v=h.getAttribute("data-color-scheme");if(v==="dark"||v==="light")document.cookie="${COLOR_SCHEME_COOKIE}="+v+"; path=/; max-age=31536000; SameSite=Lax"}).observe(h,{attributes:true,attributeFilter:["data-color-scheme"]})})();`;

/** The reader's stored choice, or undefined for "follow the OS". */
export async function storedColorScheme(): Promise<"light" | "dark" | undefined> {
  const value = (await cookies()).get(COLOR_SCHEME_COOKIE)?.value;
  return value === "dark" || value === "light" ? value : undefined;
}

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const colorScheme = await storedColorScheme();
  const bodyAttrs: Record<string, string> = {
    [PORTAL_COMPONENT_ATTRIBUTE]: "page",
  };

  return (
    // data-color sets the default color scope for the whole page: without
    // it, components fall back to the neutral scope (dark buttons instead
    // of RK red). Blocks with their own theme choice override it locally.
    // data-color-scheme from the cookie: the page arrives already dark (or
    // light) instead of switching after hydration. Absent cookie = no
    // attribute, so the library's OS-preference fallback applies.
    <html
      lang="no"
      className={sourceSans3.className}
      data-color="primary-color-red"
      data-color-scheme={colorScheme}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static, first-party script; see REMEMBER_COLOR_SCHEME */}
        <script dangerouslySetInnerHTML={{ __html: REMEMBER_COLOR_SCHEME }} />
      </head>
      <body {...bodyAttrs}>{children}</body>
    </html>
  );
}
