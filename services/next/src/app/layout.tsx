import { PORTAL_COMPONENT_ATTRIBUTE } from "@enonic/nextjs-adapter";
import { Source_Sans_3 } from "next/font/google";
import "rk-designsystem/styles.css";
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
    <html lang="no" className={sourceSans3.className}>
      <body {...bodyAttrs}>{children}</body>
    </html>
  );
}
