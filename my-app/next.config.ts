import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // deploy.sh builds into a scratch directory and swaps it in, so a build
  // that fails halfway can never corrupt the .next the live server reads.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // Proxy the FastAPI backend under the site's own origin. This keeps every
  // browser request same-origin, so the backend needs no CORS middleware and
  // no separate public hostname. BACKEND_URL overrides the target for local
  // development, where port 8000 may already be taken by the live service.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL ?? "http://127.0.0.1:8000"}/:path*`,
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
          // Two years, subdomains included: browsers that have seen this once
          // will refuse plain http afterwards (the redirect itself is a
          // Cloudflare setting, "Always Use HTTPS").
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          // Everything the page needs is same-origin: next/font self-hosts the
          // fonts, images are local, the API is proxied under /api. 'unsafe-inline'
          // on script and style is the price of Next's hydration and Tailwind
          // without a nonce (which would make every page dynamic); the other
          // directives still stop external script/style/frame/connect injection.
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
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
