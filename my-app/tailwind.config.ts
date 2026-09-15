import type { Config } from "tailwindcss";

// Colours are CSS variables so the same classes serve both themes; the
// values live in globals.css under :root and prefers-color-scheme: dark.
export default {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./content/**/*.{js,ts}"],
  theme: {
    extend: {
      colors: {
        paper: "var(--paper)",
        ink: "var(--ink)",
        body: "var(--body)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        fainter: "var(--fainter)",
        rule: "var(--rule)",
        "rule-light": "var(--rule-light)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
      },
      fontFamily: {
        sans: ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        column: "800px",
      },
    },
  },
  plugins: [],
} satisfies Config;
