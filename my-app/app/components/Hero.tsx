import { profile } from "@/content/profile";

export default function Hero() {
  return (
    <header className="flex flex-col gap-3">
      <div className="flex items-baseline gap-2.5">
        <span aria-hidden="true" className="font-mono text-[26px] text-fainter">
          #
        </span>
        <h1 className="text-[34px] font-semibold leading-tight tracking-tight">
          {profile.name}
        </h1>
      </div>
      <p className="pl-[26px] text-base leading-relaxed text-muted">
        {profile.tagline}
      </p>
      <nav className="flex gap-[18px] pl-[26px] pt-1 font-mono text-[13px]">
        {profile.links.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
