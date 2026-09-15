import Image from "next/image";
import { profile } from "@/content/profile";

const LOGO_HEIGHT = 64;

/**
 * Host lab and co-directing universities. Always one line: logo height and
 * gap scale with the viewport, from 40px/20px on a phone to 64px/48px on
 * desktop, so the row never wraps.
 */
export default function Affiliations() {
  return (
    <ul
      className="flex flex-nowrap items-center justify-center gap-[clamp(20px,6vw,48px)]"
      aria-label="Institutions"
    >
      {profile.institutions.map((inst) => (
        <li key={inst.name}>
          <a
            href={inst.href}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md bg-[var(--logo-tile)] p-1.5 no-underline opacity-90 hover:opacity-100"
          >
            <Image
              src={inst.src}
              alt={inst.name}
              width={Math.round((inst.width * LOGO_HEIGHT) / inst.height)}
              height={LOGO_HEIGHT}
              priority
              className="h-[clamp(40px,12vw,64px)] w-auto rounded-sm"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
