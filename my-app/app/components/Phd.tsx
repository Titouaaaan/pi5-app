import { phd } from "@/content/phd";
import SectionHeading from "./SectionHeading";

const facts = [
  ["where", phd.lab],
  ["when", phd.dates],
  ["with", phd.supervisors],
  ["project", phd.project],
] as const;

export default function Phd() {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>phd</SectionHeading>
      <p className="text-[15px] font-medium leading-snug text-body">{phd.title}</p>
      <dl className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-[18px] gap-y-1 font-mono text-[13px] sm:grid-cols-[132px_minmax(0,1fr)]">
        {facts.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-faint">{label}</dt>
            <dd className="text-muted">{value}</dd>
          </div>
        ))}
      </dl>
      {phd.summary.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="text-[15px] leading-[1.7] text-body">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
