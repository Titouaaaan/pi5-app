import Link from "next/link";
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
    <header className="sticky top-0 z-10 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-column items-center justify-between gap-4 px-8 py-2.5">
        <div className="flex items-center gap-4 font-mono text-[13px]">
          <Link
            href="/"
            className="flex items-center gap-2 text-faint no-underline hover:text-ink"
          >
            <span
              aria-hidden="true"
              className="flex h-5 w-5 items-center justify-center rounded bg-ink text-[13px] font-medium text-paper"
            >
              #
            </span>
            welcome
          </Link>
          <nav aria-label="Sections" className="hidden items-center gap-4 sm:flex">
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-faint no-underline hover:text-ink">
                <span className="text-fainter">## </span>
                {s.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <LanguageSelect />
          <ThemeToggle />
        </div>
        <MobileMenu sections={sections} />
      </div>
    </header>
  );
}
