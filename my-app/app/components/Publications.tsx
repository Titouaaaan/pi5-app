"use client";

import { useEffect, useState } from "react";
import { publications } from "@/content/publications";
import SectionHeading from "./SectionHeading";

type Paper = { doi: string; citations: number; source: string };

export default function Publications() {
  const [papers, setPapers] = useState<Record<string, Paper>>({});

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/publications", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setPapers(Object.fromEntries((data.papers as Paper[]).map((p) => [p.doi, p])));
      })
      .catch(() => {
        // No count; the entry still renders in full.
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="flex flex-col gap-4">
      <SectionHeading id="publications">publications</SectionHeading>
      <ul className="flex flex-col gap-5">
        {publications.map((pub) => {
          const paper = papers[pub.doi];
          return (
            <li key={pub.doi} className="flex flex-col gap-1.5">
              <p translate="no" className="text-[1rem] font-medium leading-snug text-body">{pub.title}</p>
              <p translate="no" className="text-[0.9375rem] leading-relaxed text-muted">{pub.authors}</p>
              <p translate="no" className="font-mono text-[0.8125rem] leading-relaxed text-faint">
                {pub.venue} · {pub.year}
              </p>
              <div className="flex flex-wrap items-baseline gap-4 font-mono text-[0.875rem]">
                <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">
                  doi
                </a>
                <a href={pub.scholarUrl} target="_blank" rel="noopener noreferrer">
                  google scholar
                </a>
                {paper ? (
                  <span className="text-[0.8125rem] text-fainter">
                    cited {paper.citations} time{paper.citations === 1 ? "" : "s"} (
                    {paper.source.toLowerCase()})
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
