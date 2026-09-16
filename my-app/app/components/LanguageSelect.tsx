"use client";

import { others, pinned } from "@/content/languages";

// Google's site-translation proxy renders the whole page in the chosen
// language with no script on our side and no change to our CSP. The theme
// choice is saved per origin, so it is carried across in the URL.
const PROXY = "https://titouanguerin-com.translate.goog/";

function go(code: string) {
  // Carried in both the query and the fragment: the fragment never reaches
  // any server or proxy, so it survives whatever the proxy does to the query.
  const theme = document.documentElement.dataset.theme;
  const tail = theme ? `theme=${theme}` : "";
  const base =
    code === "en" ? "/" : `${PROXY}?_x_tr_sl=en&_x_tr_tl=${code}&_x_tr_hl=${code}`;
  location.href = tail
    ? `${base}${code === "en" ? "?" : "&"}${tail}#${tail}`
    : base;
}

export default function LanguageSelect() {
  return (
    <span className="relative flex h-8 w-8 items-center justify-center rounded-md text-faint hover:text-ink">
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
      </svg>
      <select
        aria-label="Translate this page"
        title="Translate this page"
        defaultValue=""
        onChange={(e) => e.target.value && go(e.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <option value="" disabled>
          translate
        </option>
        {pinned.map(([code, name]) => (
          <option key={code} value={code}>{name}</option>
        ))}
        <option disabled>──</option>
        {others.map(([code, name]) => (
          <option key={code} value={code}>{name}</option>
        ))}
      </select>
    </span>
  );
}
