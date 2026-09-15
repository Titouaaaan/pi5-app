"use client";

import { useEffect, useState } from "react";

type Stats = {
  cpu: string;
  memory: string;
  disk: string;
  uptime: string;
};

const REFRESH_MS = 30_000;

export default function PiStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchStats = async () => {
      try {
        const response = await fetch("/api/system-stats", {
          signal: controller.signal,
        });
        if (response.ok) {
          setStats(await response.json());
        }
      } catch {
        // The Pi may be busy or the backend restarting; keep the last good
        // reading rather than flashing an error into the footer.
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, REFRESH_MS);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  // Reserve the line's height so the footer does not shift when stats land.
  if (!stats) {
    return <p className="font-mono text-xs leading-[1.7] text-faint">&nbsp;</p>;
  }

  return (
    <p className="font-mono text-xs leading-[1.7] text-faint">
      cpu {stats.cpu}&nbsp; mem {stats.memory}&nbsp; disk {stats.disk}&nbsp; up{" "}
      {stats.uptime}
    </p>
  );
}
