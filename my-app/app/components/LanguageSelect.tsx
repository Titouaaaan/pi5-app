"use client";

import { others, pinned } from "@/content/languages";

// Google's site-translation proxy renders the whole page in the chosen
// language with no script on our side and no change to our CSP.
const PROXY = "https://titouanguerin-com.translate.goog/";

function go(code: string) {
  location.href =
    code === "en" ? "/" : `${PROXY}?_x_tr_sl=en&_x_tr_tl=${code}&_x_tr_hl=${code}`;
}

export default function LanguageSelect() {
  return (
    <label className="flex items-center gap-1.5 font-mono text-[13px] text-faint hover:text-ink">
      <svg
        width="16"
        height="16"
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
      <span className="sr-only">Translate this page</span>
      <select
        defaultValue=""
        onChange={(e) => e.target.value && go(e.target.value)}
        className="cursor-pointer appearance-none bg-transparent text-inherit"
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
    </label>
  );
}
