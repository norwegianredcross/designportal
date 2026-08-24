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
};

export default nextConfig;
