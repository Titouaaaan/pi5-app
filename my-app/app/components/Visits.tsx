"use client";

import { useEffect, useState } from "react";

type Counts = { today: number; last_30_days: number; all_time: number };

/**
 * Records this visit and shows the counts. What gets stored is a hash of
 * address + day + a secret held on the Pi, so nothing here can identify or
 * follow anyone; see backend/app/visits.py.
 */
export default function Visits() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/visit", { method: "POST", signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setCounts(data))
      .catch(() => {
        // Counter unavailable; the footer simply omits the line.
      });
    return () => controller.abort();
  }, []);

  if (!counts) return null;

  const plural = (n: number) => (n === 1 ? "visitor" : "visitors");
  return (
    <p className="font-mono text-xs leading-[1.7] text-fainter">
      {counts.today} {plural(counts.today)} today · {counts.last_30_days} in the last 30 days
    </p>
  );
}
