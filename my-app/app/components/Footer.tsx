import PiStats from "./PiStats";

const COMMITS_URL =
  "https://api.github.com/repos/Titouaaaan/pi5-app/commits?per_page=1";

/**
 * Fetched on the server and cached for an hour, so visitors' browsers never
 * hit GitHub's unauthenticated 60-requests-per-hour-per-IP limit themselves.
 */
async function getLastDeploy(): Promise<string | null> {
  try {
    const response = await fetch(COMMITS_URL, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!response.ok) return null;

    const commits = await response.json();
    const date = commits?.[0]?.commit?.committer?.date;
    return typeof date === "string" ? date.slice(0, 10) : null;
  } catch {
    return null;
  }
}

export default async function Footer() {
  const lastDeploy = await getLastDeploy();

  return (
    <footer className="flex flex-col gap-1.5">
      <PiStats />
      <p className="font-mono text-xs leading-[1.7] text-fainter">
        raspberry pi 5{lastDeploy ? ` · last deploy ${lastDeploy}` : ""}
      </p>
    </footer>
  );
}
