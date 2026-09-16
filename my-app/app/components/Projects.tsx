"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { projects } from "@/content/projects";
import SectionHeading from "./SectionHeading";

type RepoActivity = { pushed_at: string; stars: number };
type Activity = Record<string, RepoActivity>;

const GITHUB_PREFIX = "https://github.com/Titouaaaan/";

function repoName(links: { href: string }[]): string | null {
  const link = links.find((l) => l.href.startsWith(GITHUB_PREFIX));
  return link ? link.href.slice(GITHUB_PREFIX.length).split("/")[0] : null;
}

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  const years = Math.floor(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export default function Projects() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/github/activity", { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => data && setActivity(data.repos))
      .catch(() => {
        // Leave the rows without the activity line; the section works without it.
      });
    return () => controller.abort();
  }, []);

  return (
    <section className="flex flex-col gap-3.5">
      <div className="relative">
        <SectionHeading id="work">selected work</SectionHeading>
        <p aria-hidden="true" className="absolute bottom-0 right-0 hidden font-mono text-[12px] text-fainter sm:block">
          click to expand
        </p>
      </div>

      <Link
        href="/PhINODE"
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border border-rule px-4 py-3 no-underline hover:border-accent"
      >
        <span className="font-mono text-[13px] text-fainter">most recent work</span>
        <span translate="no" className="font-mono text-[16px] font-medium text-accent">PhINODE</span>
        <span className="text-[14px] text-muted">model-based RL for fixed-wing UAV attitude control, my Master&apos;s thesis at ISIR and ONERA</span>
        <span className="ml-auto font-mono text-[13px] text-faint">project page →</span>
      </Link>

      <div className="flex flex-col gap-0.5">
        {projects.map((project) => {
          const isOpen = project.id === openId;
          const panelId = `project-panel-${project.id}`;
          const repo = repoName(project.links);
          const repoActivity = repo && activity ? activity[repo] : null;
          // The activity feed lists every public repo, so a linked repo that is
          // absent from a successfully loaded feed is private.
          const repoIsPrivate = Boolean(repo && activity && !repoActivity);

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
                    className="w-3 shrink-0 font-mono text-[15px] text-fainter group-hover:text-accent"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                  <span translate="no" className="font-mono text-[16px] font-medium text-accent group-hover:text-accent-hover">
                    {project.slug}
                  </span>
                  <span className="grow text-[14px] text-faint">{project.tag}</span>
                  <span className="shrink-0 font-mono text-[13px] text-fainter">
                    {project.year}
                  </span>
                </button>
              </h3>

              {isOpen ? (
                <div id={panelId} className="flex flex-col gap-2.5 pb-[18px] pl-[22px] pt-0.5">
                  {project.callout ? (
                    <Link
                      href={project.callout.href}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border border-rule px-4 py-3 no-underline hover:border-accent"
                    >
                      <span className="text-[14px] text-muted">{project.callout.text}</span>
                      <span className="ml-auto font-mono text-[13px] text-faint">{project.callout.label}</span>
                    </Link>
                  ) : null}
                  {project.title ? (
                    <p translate="no" className="text-[16px] font-medium leading-snug text-body">{project.title}</p>
                  ) : null}
                  <p className="text-[15px] leading-[1.7] text-muted">{project.body}</p>
                  {project.video ? (
                    // Mounted only while open, so it starts on expand and is torn
                    // down (playback stops) on collapse. No-cookie domain; CSP
                    // frame-src allows only this origin.
                    <iframe
                      className="aspect-video w-full rounded-md border border-rule-light"
                      src={`https://www.youtube-nocookie.com/embed/${project.video}?autoplay=1&rel=0`}
                      title={`${project.slug} video`}
                      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : null}
                  {project.quote ? (
                    <blockquote className="border-l border-rule pl-4 text-[15px] leading-[1.7] text-muted">
                      {project.quote}
                    </blockquote>
                  ) : null}
                  {project.stack ? (
                    <p className="font-mono text-[13px] text-faint">{project.stack}</p>
                  ) : null}
                  {repoActivity ? (
                    <p className="font-mono text-[13px] text-fainter">
                      last push {timeAgo(repoActivity.pushed_at)}
                      {repoActivity.stars > 0
                        ? ` · ${repoActivity.stars} star${repoActivity.stars === 1 ? "" : "s"}`
                        : ""}
                    </p>
                  ) : repoIsPrivate ? (
                    <p className="font-mono text-[13px] text-fainter">repository currently private</p>
                  ) : null}
                  <div className="flex flex-wrap gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="font-mono text-[14px]"
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
