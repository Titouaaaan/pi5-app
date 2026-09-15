import { skills } from "@/content/skills";
import SectionHeading from "./SectionHeading";

export default function Tools() {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>familiar tools</SectionHeading>
      <div className="font-mono text-[14px] leading-[1.9] text-muted">
        {skills.map((row) => (
          <p key={row.join()}>{row.join("  ")}</p>
        ))}
      </div>
    </section>
  );
}
