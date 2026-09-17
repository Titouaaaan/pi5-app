import { profile } from "@/content/profile";

export default function Hero() {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2.5">
        <span aria-hidden="true" className="font-mono text-[28px] text-fainter">
          #
        </span>
        <h1 className="text-[38px] font-semibold leading-tight tracking-tight">
          {profile.name}
        </h1>
      </div>
      <p className="pl-[26px] text-[17px] leading-relaxed text-muted">
        {profile.tagline}
      </p>
      <nav translate="no" className="flex flex-wrap gap-x-[18px] gap-y-1 pl-[26px] pt-1 font-mono text-[14px]">
        {profile.links.map((link) => {
          // Sites and the PDF open in a new tab so the page stays; mailto does not need one.
          const external = link.href.startsWith("http") || link.href.endsWith(".pdf");
          return (
            <a
              key={link.label}
              href={link.href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
            >
              {link.label}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
