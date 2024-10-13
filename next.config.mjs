import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    externalDir: true,
  },
  webpack(config) {
    config.resolve.extensionAlias = {
      ".js": [".js", ".ts"],
    };
    return config;
  },
  reactStrictMode: true,
  productionBrowserSourceMaps: true, // To get source maps in production
  devIndicators: {
    buildActivity: true,
  },
};

export default withBundleAnalyzer(nextConfig);
