import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import GameFrame from "../components/GameFrame";
import Rule from "../components/Rule";
import SectionHeading from "../components/SectionHeading";
import Sprite from "../components/Sprite";
import { newTab } from "../components/newTab";
import { rlbrawl } from "@/content/rlbrawl";

export const metadata: Metadata = {
  title: "RL-BRAWL",
  description: rlbrawl.title,
  alternates: { canonical: "https://titouanguerin.com/rl-brawl" },
  openGraph: { images: "/opengraph-image", title: "RL-BRAWL", description: rlbrawl.title, url: "https://titouanguerin.com/rl-brawl" },
};

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[1rem] font-semibold text-ink">{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[1rem] leading-[1.7] text-body">{children}</p>
);
const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[0.8125rem] leading-relaxed text-faint">{children}</p>
);

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
          The game runs directly in browsers (about 17 MB to load). Click on the window to play or watch bots, and you can play with either a keyboard or a controller!
          Unfortunately, on phones and tablets you can only spectate (Bot vs Bot or replays) but not play because I did not make touch screen controls...
        </Note>
        {/* Wider than the text column on large screens, centred on it. */}
        <div className="relative left-1/2 w-[min(1120px,calc(100vw-2rem))] -translate-x-1/2">
          <GameFrame src={rlbrawl.game} title="RL-BRAWL, playable in the browser" />
        </div>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="the-game">the game</SectionHeading>
        <P>The game has three main components: the core gameplay which is a relatively lightweight C++ engine, then we have the Godot engine used for visual rendering, and finally the 
          Python layer that handles the training of the agents. The game is designed to be fast and efficient, allowing for rapid self-play and training of reinforcement learning agents.
        </P>
        <P>
          The core mechanics are not original, and for the game to be balanced I used the mechanics, and specifically the physics and “timings” of Super Smash Bros as a reference.
          It was important for the game to be balanced otherwise my RL agents would abuse broken unbalanced mechanics and the game would not be fun to watch or play.
        </P>
        <P>
          The game is quite easy to pick up, but the hard bots are actually hard so good luck :)
        </P>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="the-agents">the agents</SectionHeading>
        <P>All the bots that you can spectate or play against are agents that were trained using only reinforcement learning. This means I never explained the rules of the game to them,
          they don’t rely on heuristics or reading your input to play. They only learn to play using a reward signal which tells them whether or not what they are doing is good or bad. 
          At first, I made the learning signal quite rich: reward for combos with different moves, for hitting after dodging etc... They also learn the opposite of that: getting hit is bad, 
          getting hit after dodging is worse etc... Over time, the reward signal slowly fades out to leave only this signal: kill good, get killed bad. That’s it. 
        </P>
        <P>
          Another interesting gimmick of the training is that the agents are trained in a self-play manner.
          As training progresses and the agent gets better against itself, it is forced to learn new strategies to counter itself. Implicitly, what this means is 
          that the agent cannot really learn an abusive strategy because it will eventually be countered by itself. Another interesting property of the training, 
          is thatthe agent also plays against previous copies of itself, in order to make sure that it doesn’t forget
          how to play against old strategies that were “solved”. The mechanics is called “league training”, and is used in many successful RL projects such as AlphaStar and OpenAI Five.
          This mechanic is very important, because how embarrassing would it be to have a bot that is good against a high Elo bot but struggles or even loses
          against a low Elo bot...
        </P>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="in-the-browser">in the browser</SectionHeading>
        <P>The whole game, bots included, is compiled to WebAssembly and runs directly on your machine!
          The bots are neural networks, but they are so small that they can run in the browser without any problems, and no GPU required. 
          The game is also small, which means it’s quick to load unless all of a sudden thousands of people want to check out this page and then my Raspberry Pi server 
          will struggle to keep up with the upload.
        </P>
        <P>
          The game is served by my backend, and it is a snapshot of the actual game repo’s game export. 
          This means that the window is not a recording of the game, it is the game itself running in your browser. 
        </P>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="next">what’s next</SectionHeading>

        <H3>the mechanics and art</H3>
        <P>The main next steps for this little project are to add more mechanics to be closer to Smash in spirit, and also to improve the art. 
          What shouldn’t take time is adding moves like up+B for more recovery options, more diversity in smash attacks (individual ones for individual characters), and improving 
          the physics because I know the feeling is not crazy good yet. 
        </P>
        <P>
          What will take time is improving the art. I am not an artist, and I am not a pixel artist. I can do some pixel art, but it’s not my forte.
          Secondly, some of the art comes from royalty free assets websites, some of it made by us. I do intend to work on that, but who would have thought that
          pixel art animation takes forever... As you can see below, we’re far from done or looking good but it’s a start! 
        </P>

        <div className="grid grid-cols-2 gap-6 pt-2">
          {rlbrawl.animations.map((a) => <Sprite key={a.src} {...a} />)}
        </div>

        <H3>the real thing: REA</H3>
        <P>
          I started working on this before the GitHub repo <a href="https://github.com/morluto/rea" {...newTab("https://github.com/morluto/rea")}>REA</a> came out. For those who don’t know,
          REA is a repo that can reverse engineer anything. And this means that SSB can be reverse engineered, and by the time I am writing this I think it already
          has been (yes it has been done <a href="https://github.com/Denkishi/ssbu-recomp" {...newTab("https://github.com/Denkishi/ssbu-recomp")}>here</a>). 
          This also means that I could actually use the recompiled PC version of Smash Ultimate as my RL training environment! 
          One of the next steps once I am bored of making this little game would be to apply it to a richer environment like the actual SSB game. 
        </P>
        
      </section>

      <Rule />
      <Footer />
    </main>
  );
}
