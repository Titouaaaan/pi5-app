import Link from "next/link";
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
    <header className="border-b border-rule bg-paper sm:sticky sm:top-0 sm:z-10">
      <div className="mx-auto flex max-w-column items-center justify-between gap-4 px-8 py-2.5">
        <nav
          aria-label="Sections"
          className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[13px]"
        >
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
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className="text-faint no-underline hover:text-ink">
              <span className="text-fainter">## </span>
              {s.label}
            </a>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
