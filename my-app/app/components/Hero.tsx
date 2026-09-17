import { profile } from "@/content/profile";
import { newTab } from "./newTab";

export default function Hero() {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2.5">
        <span aria-hidden="true" className="font-mono text-[1.75rem] text-fainter">
          #
        </span>
        <h1 className="text-[2.375rem] font-semibold leading-tight tracking-tight">
          {profile.name}
        </h1>
      </div>
      <p className="pl-[26px] text-[1.0625rem] leading-relaxed text-muted">
        {profile.tagline}
      </p>
      <nav translate="no" className="flex flex-wrap gap-x-[18px] gap-y-1 pl-[26px] pt-1 font-mono text-[0.875rem]">
        {profile.links.map((link) => (
          <a key={link.label} href={link.href} {...newTab(link.href)}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
