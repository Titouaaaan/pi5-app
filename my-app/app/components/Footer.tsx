import PiStats from "./PiStats";
import Visits from "./Visits";

// Baked in at build time by deploy.sh, so the line is always true for the
// build that is serving it. Both are unset in development.
const commit = process.env.NEXT_PUBLIC_DEPLOY_COMMIT;
const deployedAt = process.env.NEXT_PUBLIC_DEPLOY_AT;

export default function Footer() {
  return (
    <footer className="flex flex-col gap-1.5">
      <PiStats />
      <Visits />
      <p className="font-mono text-xs leading-[1.7] text-fainter">
        raspberry pi 5
        {commit ? ` · ${commit}` : ""}
        {deployedAt ? ` · deployed ${deployedAt}` : ""}
      </p>
    </footer>
  );
}
