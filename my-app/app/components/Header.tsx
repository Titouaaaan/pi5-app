import Link from "next/link";
import { TRANSLATE_ENABLED } from "@/content/languages";
import LanguageSelect from "./LanguageSelect";
import MobileMenu from "./MobileMenu";
import ThemeToggle from "./ThemeToggle";

const sections = [
  { id: "about", label: "about" },
  { id: "phd", label: "phd" },
  { id: "work", label: "work" },
  { id: "publications", label: "publications" },
  { id: "timeline", label: "timeline" },
  { id: "tools", label: "tools" },
];

export default function Header() {
  return (
    <header translate="no" className="sticky top-0 z-10 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-column items-center justify-between gap-4 px-8 py-2.5">
        <div className="flex items-center gap-4 font-mono text-[0.8125rem]">
          <Link
            href="/"
            className="flex items-center gap-2 text-faint no-underline hover:text-ink"
          >
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded-sm bg-ink text-paper"
            >
              {/* Blackboard-bold T (U+1D54B), the favicon's glyph, as an outline
                  from Noto Sans Math so no font is loaded for one character. */}
              <svg viewBox="5 0 579 714" height="12" fill="currentColor" fillRule="evenodd">
                <path d="M208 714V53H5V0H584V53H381V714ZM261 661H328V53H261Z" />
              </svg>
            </span>
            welcome
          </Link>
          <nav aria-label="Sections" className="hidden items-center gap-4 sm:flex">
            {sections.map((s) => (
              <a key={s.id} href={`/#${s.id}`} className="text-faint no-underline hover:text-ink">
                <span className="text-fainter">## </span>
                {s.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <ThemeToggle />
          {TRANSLATE_ENABLED ? <LanguageSelect /> : null}
        </div>
        <MobileMenu sections={sections} />
      </div>
    </header>
  );
}
