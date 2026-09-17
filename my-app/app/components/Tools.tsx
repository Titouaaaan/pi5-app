import { skills } from "@/content/skills";
import LabelledList from "./LabelledList";
import SectionHeading from "./SectionHeading";

export default function Tools() {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeading id="tools">familiar tools</SectionHeading>
      <LabelledList groups={skills} />
    </section>
  );
}
