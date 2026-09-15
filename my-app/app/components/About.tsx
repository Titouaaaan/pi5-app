import { profile } from "@/content/profile";
import SectionHeading from "./SectionHeading";

export default function About() {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>about</SectionHeading>
      {profile.about.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="text-[16px] leading-[1.7] text-body">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
