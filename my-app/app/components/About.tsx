import { profile } from "@/content/profile";
import { coursework, knowledge } from "@/content/knowledge";
import LabelledList from "./LabelledList";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading id="about">about</SectionHeading>
      {profile.about.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="text-[1rem] leading-[1.7] text-body">
          {paragraph}
        </p>
      ))}

      <p className="pt-2 font-mono text-[0.8125rem] text-faint">things i know my way around</p>
      <LabelledList groups={knowledge} />

      <p className="text-[0.9375rem] leading-[1.7] text-body">
        Most of my M2 coursework is on GitHub, in{" "}
        <a href={coursework.repo} target="_blank" rel="noopener noreferrer" className="font-mono text-[0.875rem]">
          {coursework.name}
        </a>
        : homeworks, notes and small projects. Maybe it can help future students {" "}
        <span className="font-mono text-[0.875rem] text-faint">(it does not include most of the big projects, those I kept for myself ;)</span>
      </p>
    </section>
  );
}
