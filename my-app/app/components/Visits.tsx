"use client";

import { useEffect, useState } from "react";

type Visitors = { today: number; yesterday: number; last_30_days: number; source: string };

/**
 * Shows unique visitors as Cloudflare counts them (every distinct address
 * that touched the site, crawlers included). Also records this visit in the
 * site's own privacy-preserving counter, which only sees browsers that run
 * the page; that number is not shown but is readable at /api/visits.
 */
export default function Visits() {
  const [counts, setCounts] = useState<Visitors | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/visit", { method: "POST", signal: controller.signal }).catch(() => {});
    fetch("/api/visitors", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setCounts(data))
      .catch(() => {
        // Counter unavailable; the footer keeps the line but leaves it blank.
      });
    return () => controller.abort();
  }, []);

  // Reserve the line so the footer does not shift when the count arrives.
  if (!counts) return <p className="font-mono text-[0.8125rem] leading-[1.7] text-fainter">&nbsp;</p>;

  return (
    <p className="font-mono text-[0.8125rem] leading-[1.7] text-fainter">
      {counts.today} unique visitors today · {counts.last_30_days.toLocaleString("en")} in the
      last 30 days ({counts.source.toLowerCase()})
    </p>
  );
}
