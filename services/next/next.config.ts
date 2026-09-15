import path from "node:path";
import type { NextConfig } from "next";
import type { NextJsWebpackConfig } from "next/dist/server/config-shared";

const getEnonicWebpackConfig: NextJsWebpackConfig = (config) => {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    // client-side resolution for node modules
    fs: false,
  };
  config.resolve.alias = {
    ...config.resolve.alias,
    "@phrases": path.resolve(__dirname, "phrases"),
  };

  return config;
};

async function getEnonicHeaders() {
  return [
    {
      // Apply these headers to all routes in your application.
      source: "/:path*",
      headers: [
        {
          key: "Content-Security-Policy",
          value: `script-src 'self' 'unsafe-eval' 'unsafe-inline';`,
        },
      ],
    },
  ];
}

// Refuse a local override that would connect designportal to another CMS.
if (process.env.NODE_ENV === "development") {
  const api = new URL(process.env.ENONIC_API ?? "http://localhost:8081/site");
  if (!["localhost", "127.0.0.1"].includes(api.hostname) || api.port !== "8081" || api.pathname !== "/site") {
    throw new Error("Designportal development requires its own XP at http://localhost:8081/site");
  }
  if (
    process.env.ENONIC_APP_NAME !== "no.rodekors.docs" ||
    process.env.ENONIC_MAPPINGS !== "no:designsystem-docs/docs"
  ) {
    throw new Error("Designportal development requires the no.rodekors.docs app and designsystem-docs/docs mapping");
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  reactStrictMode: true,
  trailingSlash: false,
  transpilePackages: ["@enonic/nextjs-adapter"],
  webpack: getEnonicWebpackConfig,
  turbopack: {
    root: __dirname,
    resolveAlias: {
      "@phrases": path.resolve(__dirname, "src", "phrases"),
    },
  },
  headers: getEnonicHeaders,
  async redirects() {
    return [
      {
        // Preserve links to the article's path before the CMS migration.
        source: "/kom-i-gang",
        destination: "/kode/kom-i-gang",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
