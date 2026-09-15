import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // deploy.sh builds into a scratch directory and swaps it in, so a build
  // that fails halfway can never corrupt the .next the live server reads.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // Proxy the FastAPI backend under the site's own origin. This keeps every
  // browser request same-origin, so the backend needs no CORS middleware and
  // no separate public hostname.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/:path*",
      },
    ];
  },

  // Do not advertise the framework version to the internet.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
