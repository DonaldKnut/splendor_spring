import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: ["@splendor/shared", "@splendor/ui", "@splendor/payments"],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
