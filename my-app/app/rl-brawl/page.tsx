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
        <P>The game has three main components: the core gameplay which is a relatively lightweight C++ engine, then we have the Godot engine used for visual rendering inputs and menus, and finally the 
          Python layer that handles the training of the agents. The game is designed to be fast and efficient, allowing for rapid self-play and training of reinforcement learning agents.
        </P>
        <P>
          The core mechanics are not original, and are based on the frame data (amount of frames each action takes like how long recovery lasts for instance). And specifically it’s the data
          from Mario in Smash. The stage is also the same as the classic Battlefield stage. 
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
          they don’t rely on heuristics or reading your input to play. To make it even more fair, the bot operates with a 0.1 second delay (so it cannot react to your inputs instantly).
          It also has the exact same input delay as a human player, so it is quite a fair fight mechanically speaking.
        </P>
        <P>
          Since the agents are trained using reinforcement learning (more on that below), they learn to play through a reward signal. During the early stages of training,
          the reward signal is rich. Here are some events that contribute to the signal: damage dealt minus damage taken, a multiplier for consecutive hits without getting hit back,
          getting close to the opponent... Each event has a different weight and contributes differently, but overall helps the agent understand what is good and what is bad.
          The reward is also a zero-sum game: whatever a bot wins, the other bot loses, which leads to this implicit idea of “getting countered is bad” (i.e. if you get hit,
          you lose points, but I win points, which isn’t the case if we trade hits for instance). 
          Finally, over time this reward signal is made sparser and sparser, and all those small reward components fade to only max 20% of the reward signal. The main reward then
          becomes winning or losing the game, since it is all that matters in the end.
        </P>
        <P>
          Another interesting gimmick of the training is that the agents are trained in a self-play manner.
          As training progresses and the agent gets better against itself, it is forced to learn new strategies to counter itself. Implicitly, what this means is 
          that the agent learns to counter abusive strategies that it has come up with. This is because it will eventually (hopefully) be countered by itself. Another interesting property of the training, 
          is that the agent also plays against previous copies of itself, in order to make sure that it doesn’t forget
          how to play against old strategies that were “solved”. This mechanic is heavily inspired by the concept of “league training”, and is used in many successful RL projects such as AlphaStar and OpenAI Five.
          This mechanic is very important, because how embarrassing would it be to have a bot that is good against a high Elo bot but struggles or even loses
          against a low Elo bot...
        </P>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="the-training">Under the hood (PPO)</SectionHeading>
        <P>
          Each bot is a small neural network called the <b>policy</b>, <i>π<sub>θ</sub>(a | s)</i>. It reads 173
          numbers describing the game (positions, speeds, damage, active hitboxes...) from its own point of view, and
          outputs a probability for each of <b>45 actions</b>: every controller combination (stick x and y in
          {"{−1, 0, 1}"} × nothing, jump, light, heavy or dodge). It has two hidden layers of 256 neurons, about 120k
          parameters. Each output of the network is then mapped to an action in the game. A second network, the{" "}
          <b>critic</b> <i>V(s)</i>, learns to predict how well things are going from a given state. That critic is not the bot you are fighting however,
          the one you fight is the policy.
        </P>
        <P>
          <b>The reward.</b> At every decision:
        </P>
        <div className="overflow-x-auto rounded-md border border-rule px-4 py-3 text-center font-mono text-[0.875rem] text-body">
          <i>r<sub>t</sub></i> = ΔKO<sub>t</sub> + <i>α(t)</i> · [ 0.02 · dmg<sub>t</sub> · <i>m<sub>t</sub></i> + 0.1 ·
          counter<sub>t</sub> + <i>F<sub>t</sub></i> ]
        </div>
        <P>
          A KO is worth ±1. <i>m<sub>t</sub></i> goes from 1 to 1.5 as consecutive hits pile up, and counter rewards
          counterattacks and whiff punishes. <i>F<sub>t</sub></i> = <i>γΦ(s<sub>t+1</sub>) − Φ(s<sub>t</sub>)</i> rewards getting closer to the opponent. 
          By shaping the reward function in this way, we make sure that it does not change which strategy is best (does not specify the optimal behavior). 
          The KO, damage and counter terms are zero-sum: what one bot wins, the other loses. 
          On top of that, the extra reward terms fade to 20% of their starting strength over the first half of training, controlled with the parameter <i>α(t)</i>, so that in the end what matters is winning.
        </P>
        <P>
          <b>PPO.</b> Training repeats a loop. First, play 256 games in parallel for 128 decisions each (about 33k
          samples). Then score each decision by its <b>advantage</b>: how much better it went than the critic expected
          (GAE):
        </P>
        <div className="overflow-x-auto rounded-md border border-rule px-4 py-3 text-center font-mono text-[0.875rem] text-body">
          <i>δ<sub>t</sub></i> = <i>r<sub>t</sub></i> + <i>γV(s<sub>t+1</sub>) − V(s<sub>t</sub>)</i>
          <br />
          <i>Â<sub>t</sub></i> = Σ<sub>l≥0</sub> <i>(γλ)<sup>l</sup> δ<sub>t+l</sub></i>
        </div>
        <P>
          with <i>γ</i> = 0.995 and <i>λ</i> = 0.95. At 15 decisions per second, that <i>γ</i> means the bot plans about 13
          seconds ahead. Finally, update the policy to make better-than-expected actions more likely, but never by too
          much in one step. This <b>clipping</b> is what makes PPO stable:
        </P>
        <div className="overflow-x-auto rounded-md border border-rule px-4 py-3 text-center font-mono text-[0.875rem] text-body">
          <i>L(θ)</i> = 𝔼<sub>t</sub> [ min( <i>ρ<sub>t</sub>Â<sub>t</sub></i>, clip(<i>ρ<sub>t</sub></i>, 1−ε, 1+ε)
          <i>Â<sub>t</sub></i> ) ]
          <br />
          <i>ρ<sub>t</sub></i> = <i>π<sub>θ</sub>(a<sub>t</sub> | s<sub>t</sub>) / π<sub>old</sub>(a<sub>t</sub> | s<sub>t</sub>)</i>,
          ε = 0.2
        </div>
        <P>
          An entropy bonus (0.03, lowered to 0.01) pushes the bot to keep trying new things early on.
        </P>
        <P>
          <b>Self-play.</b> The opponent is a <b>frozen copy</b> of the bot. Once the bot beats that copy in at least 55%
          of 200+ games, it becomes the new copy, a slightly stronger rung on the ladder. So that it doesn’t forget
          how to beat older styles, its games are split between: 55% against the current copy, 15% against retired
          copies, 20% against checkpoints of a previous run (mostly the ones it beats about half the time), and 10%
          against hand-coded bots (these are the easiest and most predictable).
        </P>
        <P>
          <b>Numbers.</b> The best bot trained for 480 million decisions on a single gaming PC (RTX 3070),
          roughly a year of non-stop game time at 60 fps. Ranked against its own past versions, its Elo climbed steadily
          to <b>2251</b>, and the difficulty levels in the menu are checkpoints saved during training.
        </P>
      </section>

      
      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="in-the-browser">in the browser</SectionHeading>
        <P>The whole game, bots included, is compiled to WebAssembly and runs directly on your machine!
          The bots are neural networks, but they are so small that they can run in the browser without any problems, and no fancy GPU required. 
          The game is also relatively small, 17 MB (the Godot engine takes up most of this size), which means it’s quick to load unless all of a sudden thousands of people want to check out this page and then my Raspberry Pi server 
          will struggle to keep up with the upload.
        </P>
        <P>
          The game is served by my backend, and it is a build of the game repo that I export to the website. 
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
