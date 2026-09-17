import { readFile } from "node:fs/promises";
import { ImageResponse } from "next/og";

// Browser-tab icon and the mark search engines show next to the site: a
// blackboard-bold T (U+1D54B, \mathbb{T}) in white on ink, so it reads on
// light and dark tab bars alike. 96px because Google wants a multiple of 48.
// Generated at build like the share card.

export const size = { width: 96, height: 96 };
export const contentType = "image/png";

export default async function Icon() {
  const math = await readFile(
    `${process.cwd()}/node_modules/@fontsource/noto-sans-math/files/noto-sans-math-latin-400-normal.woff`,
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
          borderRadius: 18,
          fontFamily: "Noto Sans Math",
          fontSize: 78,
        }}
      >
        {"\u{1D54B}"}
      </div>
    ),
    { ...size, fonts: [{ name: "Noto Sans Math", data: math, weight: 400, style: "normal" }] },
  );
}
