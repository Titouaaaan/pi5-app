import { timeline } from "@/content/timeline";
import SectionHeading from "./SectionHeading";

export default function Timeline() {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading>education &amp; experience</SectionHeading>
      <dl className="grid grid-cols-[88px_minmax(0,1fr)] gap-x-[18px] gap-y-3.5 text-sm leading-snug sm:grid-cols-[132px_minmax(0,1fr)]">
        {timeline.map((entry) => (
          <div key={`${entry.date}-${entry.role}`} className="contents">
            <dt className="font-mono text-[13px] text-faint">{entry.date}</dt>
            <dd className="text-body">
              {entry.role}, <span className="text-muted">{entry.org}</span>
              {entry.detail ? <span className="text-muted"> — {entry.detail}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
