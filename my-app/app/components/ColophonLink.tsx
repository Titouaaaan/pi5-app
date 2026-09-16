import Link from "next/link";

/** The box above the footer pointing at /colophon, in the "most recent work" style. */
export default function ColophonLink() {
  return (
    <Link
      href="/colophon"
      className="flex flex-wrap items-baseline gap-x-3 gap-y-1 rounded-md border border-rule px-4 py-3 no-underline hover:border-accent"
    >
      <span className="font-mono text-[13px] text-fainter">how this site runs</span>
      <span className="text-[14px] text-muted">a Raspberry Pi 5 on a shelf in my flat, a Cloudflare tunnel, and no server bill</span>
      <span className="ml-auto font-mono text-[13px] text-faint">colophon →</span>
    </Link>
  );
}
