import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/system-stats",
        destination: "http://api.titouanguerin.com/system-stats", // Replace with your actual backend URL
      },
    ];
  },
};

export default nextConfig;
