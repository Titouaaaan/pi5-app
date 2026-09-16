import { phd } from "@/content/phd";
import SectionHeading from "./SectionHeading";

export default function Phd() {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading id="phd">phd</SectionHeading>
      <p translate="no" className="text-[16px] font-medium leading-snug text-body">{phd.title}</p>
      {phd.text.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="text-[16px] leading-[1.7] text-body">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
