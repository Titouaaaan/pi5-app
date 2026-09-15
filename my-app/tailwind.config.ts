import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./content/**/*.{js,ts}"],
  theme: {
    extend: {
      colors: {
        paper: "#F9FAFA",
        ink: "#16191C",
        body: "#2A3036",
        muted: "#545C64",
        faint: "#9AA3AB",
        fainter: "#B6BDC4",
        rule: "#E3E7EA",
        "rule-light": "#EDF0F2",
        accent: "oklch(0.52 0.09 230)",
        "accent-hover": "oklch(0.40 0.08 230)",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        column: "680px",
      },
    },
  },
  plugins: [],
} satisfies Config;
