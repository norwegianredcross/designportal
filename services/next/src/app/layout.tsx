import { PORTAL_COMPONENT_ATTRIBUTE } from "@enonic/nextjs-adapter";
import { Source_Sans_3 } from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
// Keep reset, library, frame, prose and flow styles in cascade order.
import "@/styles/reset.css";
import "rk-designsystem/styles.css";
import "@/styles/globals.css";
import "@/styles/rk-prose.css";
import "@/styles/flow.css";

// Persist the Header toggle in a cookie so SSR uses the selected theme.
// The observer keeps the cookie in sync after hydration.
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
    // Set the RK color scope and restore the theme before hydration.
    <html
      lang="no"
      className={sourceSans3.className}
      data-color="primary-color-red"
      data-color-scheme={colorScheme}
      suppressHydrationWarning
    >
      <body {...bodyAttrs}>
        {children}
        {/* Next loads this once, including when a 404 renders on the client. */}
        <Script id="remember-color-scheme" strategy="afterInteractive">
          {REMEMBER_COLOR_SCHEME}
        </Script>
      </body>
    </html>
  );
}
