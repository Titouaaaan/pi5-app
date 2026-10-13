import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import Footer from "../components/Footer";
import GameFrame from "../components/GameFrame";
import Rule from "../components/Rule";
import SectionHeading from "../components/SectionHeading";
import { newTab } from "../components/newTab";
import { rlbrawl } from "@/content/rlbrawl";

export const metadata: Metadata = {
  title: "RL-BRAWL",
  description: rlbrawl.title,
  alternates: { canonical: "https://titouanguerin.com/rl-brawl" },
  openGraph: { images: "/opengraph-image", title: "RL-BRAWL", description: rlbrawl.title, url: "https://titouanguerin.com/rl-brawl" },
};

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[1rem] leading-[1.7] text-body">{children}</p>
);
const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[0.8125rem] leading-relaxed text-faint">{children}</p>
);

// Placeholder sections: titles and one intro sentence each, to be written.
const sections = [
  ["the-game", "the game", "A small Smash-style fighting game: one deterministic C++ simulation, drawn and played in Godot."],
  ["the-agents", "the agents", "PPO self-play agents trained in PyTorch against a league of their own past checkpoints."],
  ["training", "training", "Millions of games per hour through a batched C++ environment."],
  ["in-the-browser", "in the browser", "The whole game, bots included, compiled to WebAssembly and running on your machine."],
  ["next", "what's next", "Where the project goes from here."],
] as const;

export default function RlBrawlPage() {
  return (
    <main id="main" className="mx-auto flex max-w-column flex-col gap-10 px-8 pb-16 pt-8">
      <p className="font-mono text-[0.875rem]">
        <Link href="/">← titouanguerin.com</Link>{" "}
        <span className="text-faint">/ work / {rlbrawl.name}</span>
      </p>

      <header className="flex flex-col gap-3">
        <h1 translate="no" className="flex items-baseline gap-2.5 text-[2.375rem] font-semibold leading-tight tracking-tight">
          <span aria-hidden="true" className="font-mono text-[1.75rem] font-normal text-fainter">#</span>
          {rlbrawl.name}
        </h1>
        <div className="flex flex-col gap-2.5 sm:pl-[38px]">
          <p className="text-[1.125rem] leading-relaxed text-body">{rlbrawl.title}</p>
          <p className="font-mono text-[0.8125rem] text-faint">{rlbrawl.meta}</p>
          <div className="flex flex-wrap gap-2.5 pt-1 font-mono text-[0.875rem]">
            {rlbrawl.links.map((l) => (
              <a key={l.href} href={l.href} {...newTab(l.href)}
                className="rounded-md border border-rule px-3 py-1.5 no-underline hover:border-accent">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <section className="flex flex-col gap-2.5">
        <Note>
          The game runs in your browser (about 17 MB to load). Click into it to give it the keyboard; controllers work too.
          On phones and tablets you can watch (Bot vs Bot, replays) but not play: there are no on-screen controls.
        </Note>
        {/* Wider than the text column on large screens, centred on it. */}
        <div className="relative left-1/2 w-[min(1120px,calc(100vw-2rem))] -translate-x-1/2">
          <GameFrame src={rlbrawl.game} title="RL-BRAWL, playable in the browser" />
        </div>
      </section>

      {sections.map(([id, heading, intro]) => (
        <Fragment key={id}>
          <Rule />
          <section className="flex flex-col gap-3.5">
            <SectionHeading id={id}>{heading}</SectionHeading>
            <P>{intro}</P>
          </section>
        </Fragment>
      ))}

      <Rule />
      <Footer />
    </main>
  );
}
