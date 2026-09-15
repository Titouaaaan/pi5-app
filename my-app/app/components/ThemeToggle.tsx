"use client";

const STORAGE_KEY = "theme";

/**
 * Flips between light and dark. Choosing the theme the OS already uses
 * clears the override, so the site goes back to following the system.
 * Which icon shows is decided in CSS (--show-in-light / --show-in-dark), so
 * the server-rendered button is never briefly wrong.
 */
function toggleTheme() {
  const root = document.documentElement;
  const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const explicit = root.dataset.theme;
  const current = explicit === "dark" || explicit === "light" ? explicit : system;
  const next = current === "dark" ? "light" : "dark";

  try {
    if (next === system) {
      delete root.dataset.theme;
      localStorage.removeItem(STORAGE_KEY);
    } else {
      root.dataset.theme = next;
      localStorage.setItem(STORAGE_KEY, next);
    }
  } catch {
    root.dataset.theme = next;
  }
}

export default function ThemeToggle() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className="flex h-8 w-8 items-center justify-center rounded-md text-faint hover:text-ink"
    >
      {/* moon: shown in light mode, meaning "switch to dark" */}
      <svg
        style={{ display: "var(--show-in-light)" }}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
      {/* sun: shown in dark mode, meaning "switch to light" */}
      <svg
        style={{ display: "var(--show-in-dark)" }}
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    </button>
  );
}
