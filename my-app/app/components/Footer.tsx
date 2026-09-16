import Link from "next/link";
import PiStats from "./PiStats";
import Visits from "./Visits";

// Baked in at build time by deploy.sh, so the line is always true for the
// build that is serving it. Both are unset in development.
const commit = process.env.NEXT_PUBLIC_DEPLOY_COMMIT;
const deployedAt = process.env.NEXT_PUBLIC_DEPLOY_AT;

export default function Footer({ colophonLink = true }: { colophonLink?: boolean }) {
  return (
    <footer className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1.5">
        <PiStats />
        <Visits />
        <p className="font-mono text-[13px] leading-[1.7] text-fainter">
          raspberry pi 5
          {commit ? ` · ${commit}` : ""}
          {deployedAt ? ` · deployed ${deployedAt}` : ""}
        </p>
      </div>
      {colophonLink ? (
        <Link href="/colophon" className="font-mono text-[13px] text-fainter no-underline hover:text-ink">
          how this site runs →
        </Link>
      ) : null}
    </footer>
  );
}
