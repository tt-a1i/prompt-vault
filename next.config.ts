import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack is enabled by default in dev via --turbopack flag
  // These are additional optimizations
  reactStrictMode: true,

  // Experimental features
  experimental: {
    // Enable React 19 features
    reactCompiler: false, // Enable when stable

    // Optimize package imports
    optimizePackageImports: [
      "@tanstack/react-query",
      "lucide-react",
    ],
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
