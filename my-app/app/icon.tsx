import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

// Browser-tab icon: the site's '#' on ink, so it reads on light and dark
// tab bars alike. Generated at build like the share card.

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default async function Icon() {
  const mono = await readFile(
    `${process.cwd()}/node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff`,
  );
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16191C",
          color: "#F9FAFA",
          borderRadius: 12,
          fontFamily: "Plex Mono",
          fontSize: 46,
          fontWeight: 500,
        }}
      >
        #
      </div>
    ),
    { ...size, fonts: [{ name: "Plex Mono", data: mono, weight: 500, style: "normal" }] },
  );
}
