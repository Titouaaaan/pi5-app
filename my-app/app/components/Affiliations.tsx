import Image from "next/image";
import { profile } from "@/content/profile";

const LOGO_HEIGHT = 48;

export default function Affiliations() {
  return (
    <ul className="flex flex-wrap items-center gap-7" aria-label="Institutions">
      {profile.institutions.map((inst) => (
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
              priority
              className="rounded-sm"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
