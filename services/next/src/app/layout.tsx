import { PORTAL_COMPONENT_ATTRIBUTE } from "@enonic/nextjs-adapter";
import { Source_Sans_3 } from "next/font/google";
// The ONLY visual stylesheet in the app: design tokens (--ds-* variables,
// color scopes), the Digdir base component CSS and the RK theme, in one
// import. Block views never write visual CSS — they render design system
// components whose class names this stylesheet targets, and colors come
// from data-color scopes swapping token values.
import "rk-designsystem/styles.css";
// App frame only: body layout and the centered main column. Anything about
// how things LOOK belongs to the design system import above (one
// exception: the maroon heading identity in globals.css).
import "./globals.css";

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
    <html lang="no" className={sourceSans3.className} data-color="primary-color-red">
      <body {...bodyAttrs}>{children}</body>
    </html>
  );
}
