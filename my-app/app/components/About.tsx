import { profile } from "@/content/profile";
import { coursework, knowledge } from "@/content/knowledge";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading id="about">about</SectionHeading>
      {profile.about.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="text-[16px] leading-[1.7] text-body">
          {paragraph}
        </p>
      ))}

      <p className="pt-2 font-mono text-[13px] text-faint">things i know my way around</p>
      <dl translate="no" className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-[18px] gap-y-2.5 font-mono text-[14px] leading-[1.8] sm:grid-cols-[132px_minmax(0,1fr)]">
        {knowledge.map((group) => (
          <div key={group.label} className="contents">
            <dt className="text-faint">{group.label}</dt>
            <dd className="text-muted">{group.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>

      <p className="text-[15px] leading-[1.7] text-body">
        Most of my M2 coursework is on GitHub, in{" "}
        <a href={coursework.repo} target="_blank" rel="noopener noreferrer" className="font-mono text-[14px]">
          {coursework.name}
        </a>
        : homeworks, notes and small projects. If it helps a student somewhere, good{" "}
        <span className="font-mono text-[14px] text-faint">(it does not include most of the big projects, those I kept for myself ;)</span>
      </p>
    </section>
  );
}
