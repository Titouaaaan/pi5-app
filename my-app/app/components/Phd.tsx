import Image from "next/image";
import { phd } from "@/content/phd";
import SectionHeading from "./SectionHeading";

const LOGO_HEIGHT = 36;

export default function Phd() {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeading>phd</SectionHeading>
      <p className="text-[16px] font-medium leading-snug text-body">{phd.title}</p>
      {phd.text.map((paragraph) => (
        <p key={paragraph.slice(0, 32)} className="text-[16px] leading-[1.7] text-body">
          {paragraph}
        </p>
      ))}
      <ul className="flex flex-wrap items-center gap-6 pt-2" aria-label="Institutions">
        {phd.institutions.map((inst) => (
          <li key={inst.name}>
            <a
              href={inst.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block no-underline opacity-90 hover:opacity-100"
            >
              <Image
                src={inst.src}
                alt={inst.name}
                width={Math.round((inst.width * LOGO_HEIGHT) / inst.height)}
                height={LOGO_HEIGHT}
                className="rounded-sm"
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
