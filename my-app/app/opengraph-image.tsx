import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

// The card shown when the site's link is shared. Same type and colours as the
// page; generated at build time, so it follows content/profile.ts.

export const alt = "Titouan Guerin";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (pkg: string, file: string) =>
  readFile(`${process.cwd()}/node_modules/@fontsource/${pkg}/files/${file}`);

export default async function OpenGraphImage() {
  const [sans600, sans400, mono400] = await Promise.all([
    font("ibm-plex-sans", "ibm-plex-sans-latin-600-normal.woff"),
    font("ibm-plex-sans", "ibm-plex-sans-latin-400-normal.woff"),
    font("ibm-plex-mono", "ibm-plex-mono-latin-400-normal.woff"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 84px",
          background: "#F9FAFA",
          color: "#16191C",
          fontFamily: "Plex Sans",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontFamily: "Plex Mono", fontSize: 54, color: "#B6BDC4" }}>#</span>
            <span style={{ fontSize: 76, fontWeight: 600, letterSpacing: "-0.02em" }}>
              {profile.name}
            </span>
          </div>
          <div style={{ fontSize: 32, lineHeight: 1.45, color: "#545C64", maxWidth: 960 }}>
            {profile.tagline}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Plex Mono",
            fontSize: 24,
            color: "#9AA3AB",
          }}
        >
          <span>titouanguerin.com</span>
          <span>{profile.institutions.map((i) => i.name).join("  ·  ")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Plex Sans", data: sans600, weight: 600, style: "normal" },
        { name: "Plex Sans", data: sans400, weight: 400, style: "normal" },
        { name: "Plex Mono", data: mono400, weight: 400, style: "normal" },
      ],
    },
  );
}
