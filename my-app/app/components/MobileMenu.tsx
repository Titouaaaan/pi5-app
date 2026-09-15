"use client";

import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

type Section = { id: string; label: string };

/** Burger for small screens: drops a panel with the sections and the theme switch. */
export default function MobileMenu({ sections }: { sections: Section[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-9 w-9 items-center justify-center rounded-md text-faint hover:text-ink sm:hidden"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open ? (
        <div
          id="mobile-menu"
          className="absolute inset-x-0 top-full border-b border-rule bg-paper sm:hidden"
        >
          <nav aria-label="Sections" className="flex flex-col px-8 py-2 font-mono text-[15px]">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className="py-2.5 text-faint no-underline hover:text-ink"
              >
                <span className="text-fainter">## </span>
                {s.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center justify-between border-t border-rule-light px-8 py-2 font-mono text-[15px] text-faint">
            <span>
              <span className="text-fainter">## </span>theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </>
  );
}
