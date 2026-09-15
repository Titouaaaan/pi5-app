"use client";

import { useState } from "react";
import { projects } from "@/content/projects";
import SectionHeading from "./SectionHeading";

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <SectionHeading>selected work</SectionHeading>
        <p aria-hidden="true" className="font-mono text-[11px] text-fainter">
          click to expand
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        {projects.map((project) => {
          const isOpen = project.id === openId;
          const panelId = `project-panel-${project.id}`;

          return (
            <div key={project.id} className="flex flex-col border-b border-rule-light">
              <h3>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : project.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="group flex w-full items-baseline gap-2.5 py-[11px] text-left"
                >
                  <span
                    aria-hidden="true"
                    className="w-3 shrink-0 font-mono text-sm text-fainter group-hover:text-accent"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                  <span className="font-mono text-[15px] font-medium text-accent group-hover:text-accent-hover">
                    {project.slug}
                  </span>
                  <span className="grow text-[13px] text-faint">{project.tag}</span>
                  <span className="shrink-0 font-mono text-xs text-fainter">
                    {project.year}
                  </span>
                </button>
              </h3>

              {isOpen ? (
                <div id={panelId} className="flex flex-col gap-2.5 pb-[18px] pl-[22px] pt-0.5">
                  {project.title ? (
                    <p className="text-[15px] font-medium leading-snug text-body">{project.title}</p>
                  ) : null}
                  <p className="text-sm leading-[1.7] text-muted">{project.body}</p>
                  {project.quote ? (
                    <blockquote className="border-l border-rule pl-4 text-sm leading-[1.7] text-muted">
                      {project.quote}
                    </blockquote>
                  ) : null}
                  {project.stack ? (
                    <p className="font-mono text-xs text-faint">{project.stack}</p>
                  ) : null}
                  <div className="flex flex-wrap gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-mono text-[13px]"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
