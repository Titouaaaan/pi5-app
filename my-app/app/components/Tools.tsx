import { skills } from "@/content/skills";
import SectionHeading from "./SectionHeading";

export default function Tools() {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading id="tools">familiar tools</SectionHeading>
      <dl translate="no" className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-[18px] gap-y-2.5 font-mono text-[14px] leading-[1.8] sm:grid-cols-[132px_minmax(0,1fr)]">
        {skills.map((group) => (
          <div key={group.label} className="contents">
            <dt className="text-faint">{group.label}</dt>
            <dd className="text-muted">{group.items.join(" · ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
