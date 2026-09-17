import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/Footer";
import Rule from "../components/Rule";
import SectionHeading from "../components/SectionHeading";
import { newTab } from "../components/newTab";
import { phinode } from "@/content/phinode";

export const metadata: Metadata = {
  title: "PhINODE",
  description: phinode.title,
  alternates: { canonical: "https://titouanguerin.com/PhINODE" },
  openGraph: { images: "/opengraph-image", title: "PhINODE", description: phinode.title, url: "https://titouanguerin.com/PhINODE" },
};

// Figures come from the thesis, re-extracted onto white; they keep a white
// tile in dark mode rather than being inverted.
function Fig({
  src, w, h, alt, children, narrow,
}: { src: string; w: number; h: number; alt: string; children: React.ReactNode; narrow?: boolean }) {
  return (
    <figure className="flex flex-col gap-2">
      <Image src={src} width={w} height={h} alt={alt}
        className={`h-auto w-full rounded-md border border-rule bg-white p-2.5 ${narrow ? "mx-auto max-w-[560px]" : ""}`} />
      <figcaption className="font-mono text-[0.8125rem] leading-relaxed text-faint">{children}</figcaption>
    </figure>
  );
}

const H3 = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-[1rem] font-semibold text-ink">{children}</h3>
);
const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[1rem] leading-[1.7] text-body">{children}</p>
);
const Note = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[0.8125rem] leading-relaxed text-faint">{children}</p>
);
const Eq = ({ children }: { children: React.ReactNode }) => (
  <div className="border-l border-rule pl-4 font-mono text-[0.9375rem] leading-[1.9] text-body">{children}</div>
);
const Q = ({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-3 pt-1.5">
    <H3><span className="mr-2.5 font-mono text-[0.8125rem] font-normal text-fainter">{tag}</span>{title}</H3>
    {children}
  </div>
);

export default function PhinodePage() {
  return (
    <main id="main" className="mx-auto flex max-w-column flex-col gap-10 px-8 pb-16 pt-8">
      <p className="font-mono text-[0.875rem]">
        <Link href="/">← titouanguerin.com</Link>{" "}
        <span className="text-faint">/ work / {phinode.name}</span>
      </p>

      <header className="flex flex-col gap-3">
        <h1 translate="no" className="flex items-baseline gap-2.5 text-[2.375rem] font-semibold leading-tight tracking-tight">
          <span aria-hidden="true" className="font-mono text-[1.75rem] font-normal text-fainter">#</span>
          {phinode.name}
        </h1>
        <div className="flex flex-col gap-2.5 sm:pl-[38px]">
          <p translate="no" className="text-[1.125rem] leading-relaxed text-body">{phinode.title}</p>
          <p translate="no" className="text-[1rem] text-muted">
            {phinode.authors.map((a, i) => (
              <span key={a.name}>{i > 0 ? ", " : ""}{a.name}<sup className="text-faint">{a.aff}</sup></span>
            ))}
            {"  "}
            <span className="font-mono text-[0.8125rem] text-faint">
              {phinode.affiliations.map((a) => (<span key={a.n} className="mr-2"><sup>{a.n}</sup>{a.name}</span>))}
            </span>
          </p>
          <p className="font-mono text-[0.8125rem] text-faint">{phinode.meta}</p>
          <div className="flex flex-wrap gap-2.5 pt-1 font-mono text-[0.875rem]">
            {phinode.links.map((l) => (
              <a key={l.href} href={l.href} {...newTab(l.href)}
                className={`rounded-md border border-rule px-3 py-1.5 no-underline hover:border-accent ${"dim" in l && l.dim ? "text-faint hover:border-rule" : ""}`}>
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </header>

      <Fig src="/phinode/loop.png" w={927} h={650} alt="The learning loop">
        The learning loop. A CEM-MPC controller explores the simulator, the data trains a dynamics model made of a physics prior plus a learned residual, and the model then replaces the simulator for training the policy. Several rounds, then no more simulator interaction.
      </Fig>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="abstract">abstract</SectionHeading>
        <P>Fixed-wing UAVs are efficient for long-range missions, but their attitude dynamics grow strongly nonlinear and coupled away from level flight, making them harder to control than the quadrotors that most of the literature targets. Reinforcement learning can learn controllers directly from data, but model-free RL requires a large number of costly simulator interactions. Model-based RL instead learns a dynamics model to train on, which can be made more reliable by embedding known aerodynamic physics as a prior. However, this assumes the prior is accurate, which is rarely the case. In this work we extend PhIHP, a physics-informed model-based RL method validated only on classic control benchmarks, to fixed-wing UAV attitude control. These test environments have dynamics that are low-dimensional and exactly known, and we test whether the approach holds on a system whose aerodynamics are neither. We build a physics prior for a simulated Skywalker X8 fixed-wing UAV, paired with a learned residual that corrects what the prior misses. We evaluate controllers on settled attitude tracking error: the steady-state deviation, in degrees, between commanded and achieved roll and pitch.</P>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="in-short">in short</SectionHeading>
        <P>The equations of flight are known. The coefficients that go into them, for a new or lightweight airframe, are only approximate. That gap is the whole subject.</P>
        <ol className="flex flex-col gap-2.5">
          {[
            ["Train the controller inside a physics-informed model", "rather than in the simulator. The model is cheap, so it can run in parallel; the simulator cannot."],
            ["Correct the physics when it is inaccurate", "by letting the optimiser tune the prior's coefficients together with the learned residual."],
            ["Plan on top of the controller", "with a short-horizon MPC that uses the trained policy and its critic, and find out which of the two actually helps."],
          ].map(([b, rest], i) => (
            <li key={b} className="grid grid-cols-[28px_1fr] gap-3 text-[1rem] leading-[1.7] text-body">
              <span className="pt-0.5 font-mono text-[0.875rem] text-fainter">{i + 1}</span>
              <span><b className="font-medium text-ink">{b}</b> {rest}</span>
            </li>
          ))}
        </ol>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="background">background</SectionHeading>
        <H3>Two ways to build a controller</H3>
        <P>Planning, as in model predictive control, needs a model of the dynamics and optimises actions over a short horizon at every step. Reinforcement learning needs no model and learns a policy from interaction, but pays for it in samples: model-free methods need a great many. Model-based RL sits between the two: learn a model of the dynamics, then train the policy inside it. This work combines all three, a learned model, a policy trained in it, and a planner on top.</P>
        <H3>Model predictive control</H3>
        <P>MPC learns no policy at all. At every step it takes the current state s<sub>t</sub>, a model of the dynamics T<sub>θ</sub> and a horizon H, and searches for the sequence of actions whose predicted return is highest:</P>
        <Eq>
          A<sup>⋆</sup> = arg max<sub>a<sub>t:t+H−1</sub></sub> Σ<sub>k=0</sub><sup>H−1</sup> γ<sup>k</sup> r(s<sub>t+k</sub>, a<sub>t+k</sub>) &nbsp; s.t. &nbsp; s<sub>t+k+1</sub> = T<sub>θ</sub>(s<sub>t+k</sub>, a<sub>t+k</sub>)
        </Eq>
        <P>Only the first action a<sup>⋆</sup><sub>t</sub> is executed; the rest is thrown away and the search starts over at the next step, from wherever the aircraft actually ended up. That constant replanning is what makes MPC tolerant of a model that is only approximately right. How the arg max is solved depends on the model. With a differentiable one, gradients; here, the cross-entropy method (CEM), which needs nothing but rollouts. CEM-MPC keeps a Gaussian N(μ, σ²) over action sequences, samples N candidates, rolls each through the model to score it, keeps the K best (the elites), refits μ and σ² to them, and repeats for a few iterations. It is used twice in this work: as the explorer that collects the data the dynamics model is trained on, and, with two changes described under Method, as the planner on top of the trained policy.</P>
        <H3>Reinforcement learning</H3>
        <P>An agent learns a policy π that maximises the expected discounted return, E<sub>π</sub>[Σ<sub>t</sub> γ<sup>t</sup> r<sub>t</sub>], through trial and error in an environment formalised as a Markov decision process (S, A, T, r, γ): states, actions, transition dynamics, reward and a discount factor. Model-free algorithms come in three families: value-based (learn Q(s, a) and act on it), policy-based (optimise π directly by policy gradient), and actor-critic, which does both, an actor proposing actions and a critic evaluating them, and reduces gradient variance considerably.</P>
        <H3>TD3</H3>
        <P>The controller here is TD3, an off-policy actor-critic for continuous actions. The actor is a deterministic policy π<sub>φ</sub>(o); two independent critics Q<sub>θ1</sub> and Q<sub>θ2</sub> are trained and the smaller of the two forms the target, which is what keeps the value from being overestimated:</P>
        <Eq>y = r + γ min<sub>j∈{"{1,2}"}</sub> Q<sub>θ&#39;j</sub>( o&#39;, π<sub>φ&#39;</sub>(o&#39;) + ε ), &nbsp; ε ~ clip(N(0, σ), −c, c)</Eq>
        <P>The clipped noise ε smooths the target policy so the critics cannot exploit sharp, incorrect peaks in the estimated value, and the actor is updated only once every few critic updates, following the gradient of the first critic. Slowly updated target networks θ&#39; and φ&#39; stabilise the whole thing. The critic Q is also what makes the hybrid controller work later on.</P>
        <H3>Partial observability</H3>
        <P>A flight simulator keeps a far richer internal state than the agent is shown: position, altitude, propulsion variables the attitude task never exposes. The agent acts on an observation o<sub>t</sub>, not the full state s<sub>t</sub>, so the environment is formally a partially observable MDP, (S, A, O, T, Ω, r, γ), with an observation function Ω(o<sub>t</sub> | s<sub>t</sub>, a<sub>t</sub>). The dynamics model and the policy are both built on that partial view.</P>
        <Note>environment: JSBSim through FW-JSBGym · Skywalker X8 · windless, turbulence-free, constant airflow, so the difficulty is the aircraft&#39;s own dynamics · task: drive roll and pitch to a commanded reference and hold it</Note>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="method">method</SectionHeading>
        <H3>The dynamics model</H3>
        <P>Following APHYNITY and PhIHP, the state derivative is a known physics term plus a learned correction, integrated with RK4. The prior is approximate by design, so its coefficients θ<sub>p</sub> are trainable.</P>
        <Eq>
          ṡ = F<sub>p</sub><sup>θp</sup>(s, a) <span className="text-[0.75rem] text-faint">physics prior</span> + F<sub>a</sub><sup>θa</sup>(s, a) <span className="text-[0.75rem] text-faint">learned residual</span><br />
          s<sub>t+1</sub> = s<sub>t</sub> + ∫<sub>t</sub><sup>t+Δt</sup> ṡ dτ
        </Eq>
        <P>The prior is an aerodynamic model of the Skywalker X8. It is degraded on purpose for the experiments: ten coefficients that are hard to measure in practice are perturbed by 25 to 50% (mild) or 75 to 100% (severe), and each condition is run with the prior frozen or trainable.</P>
        <H3>The hybrid controller</H3>
        <P>TD3 trained entirely in imagination gives a policy π and a critic Q. At inference, a CEM-MPC planner searches short action sequences through the dynamics model. The policy seeds the search; the critic scores what lies beyond the planning horizon.</P>
        <Fig src="/phinode/hybrid.png" w={762} h={601} alt="Hybrid controller at inference" narrow>
          Hybrid controller at inference. Candidate actions come from the policy and from random sampling, the dynamics model rolls them out, the reward function scores the trajectories and the critic bootstraps the value past the horizon. CEM-MPC picks the action.
        </Fig>
        <Note>setup: JSBSim full physics · no wind · settled error in degrees, &lt; 1° is near-perfect · 10 seeds per condition · easy and hard target split · 10 ms inference budget</Note>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="results">results</SectionHeading>

        <Q tag="q1" title="Can the controller be trained inside the model alone?">
          <P>Yes. A policy trained purely on trajectories imagined through the dynamics model, with no further simulator interaction, comes close to one trained directly on the simulator. Because the model is cheap to instantiate it can be parallelised, which the simulator does not easily allow: the policy converges faster and ends up best overall.</P>
          <Fig src="/phinode/q1.png" w={1400} h={395} alt="Settled attitude error, three training regimes">
            Settled attitude error in degrees over the full evaluation grid, 10 seeds, 95% CI, three statistics. Lower is better. Grey: parallelised model environment.
          </Fig>
          <Fig src="/phinode/curves.png" w={1400} h={574} alt="Learning curves">
            Learning curves. Model-free and model-environment TD3 follow the same behaviour; the parallelised model converges fastest.
          </Fig>
        </Q>

        <Q tag="q2" title="What if the physics prior is wrong?">
          <P>With an accurate prior, tuning changes little. With a degraded one, tracking error rises sharply in non-nominal conditions, and letting the optimiser correct the prior&#39;s coefficients alongside the residual recovers most of that loss. <b className="font-medium text-ink">On the hardest targets, 37 to 38% of it.</b> Approximate physics is enough to learn a good controller.</P>
          <Fig src="/phinode/q2.png" w={1400} h={605} alt="Policy performance across six prior conditions">
            TD3 policy performance across the six prior conditions, all targets. Blue: prior frozen. Orange: prior trainable. The gap between each pair is what tuning buys.
          </Fig>
        </Q>

        <Q tag="q3" title="Does planning on top of the controller help, and which part does the work?">
          <P>The hybrid controller cuts tracking error on hard targets by <b className="font-medium text-ink">37% across all prior conditions and 41% with the true prior</b>, and up to 43% in the best case. The ablation is the interesting part: almost all of the gain comes from the critic bootstrapping value past the horizon. Seeding the planner with the policy&#39;s own proposals does not help, and on its own it is much worse than the policy alone.</P>
          <Fig src="/phinode/q3.png" w={1400} h={395} alt="Controller performance, all prior conditions">
            Controller performance aggregated over all six prior conditions, all targets. Policy alone, CEM with critic bootstrap, and the full hybrid.
          </Fig>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse font-mono text-[0.8125rem] text-body tabular-nums">
              <thead>
                <tr className="text-faint">
                  <th className="border-b border-rule-light px-2.5 py-1.5 text-left font-medium">controller</th>
                  <th className="border-b border-rule-light px-2.5 py-1.5 text-right font-medium" colSpan={3}>all six prior conditions</th>
                  <th className="border-b border-rule-light px-2.5 py-1.5 text-right font-medium" colSpan={3}>true prior only</th>
                </tr>
                <tr className="text-fainter">
                  <th className="border-b border-rule-light px-2.5 py-1.5 text-left font-medium"></th>
                  {["all", "easy", "hard", "all", "easy", "hard"].map((h, i) => (
                    <th key={i} className="border-b border-rule-light px-2.5 py-1.5 text-right font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["policy alone", "1.17", "0.59", "1.91", "0.97", "0.55", "1.55"],
                  ["mpc + π", "19.57", "3.74", "41.44", "19.76", "4.79", "40.49"],
                  ["mpc + Q", "0.82", "0.48", "1.30", "0.67", "0.50", "*0.90"],
                  ["hybrid (π + Q)", "*0.77", "*0.44", "*1.21", "*0.64", "*0.43", "0.92"],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i} className={`border-b border-rule-light px-2.5 py-1.5 ${i ? "text-right" : "text-left"} ${cell.startsWith("*") ? "font-medium text-ink" : ""}`}>
                        {cell.replace("*", "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Note>IQM settled attitude error, degrees. cost of the hybrid: <b className="font-medium text-ink">21 ms per step</b> against a 10 ms budget, which is the main open problem.</Note>
        </Q>

        <Q tag="example" title="A hard dive">
          <P>Roll and pitch tracking for an aggressive dive and roll manoeuvre, commanded roll −58° and pitch −21°. Dashed red is the reference; the shaded band is ±5°. The policy alone reaches the targets but its angular rates grow into oscillation; the hybrid controller settles and stays there.</P>
          <figure className="flex flex-col gap-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {[["(a) policy only", "dive_policy"], ["(b) hybrid controller", "dive_hybrid"]].map(([lbl, f]) => (
                <div key={f} className="flex flex-col gap-1.5">
                  <span className="font-mono text-[0.8125rem] text-faint">{lbl}</span>
                  <Image src={`/phinode/${f}.png`} width={1000} height={800} alt={`${lbl}, hard dive`}
                    className="h-auto w-full rounded-md border border-rule bg-white p-2.5" />
                </div>
              ))}
            </div>
            <figcaption className="font-mono text-[0.8125rem] leading-relaxed text-faint">
              Hybrid controller vs policy only for hard dive attitude control. Each panel: roll and pitch against their references (top), control surface commands and angular velocities (bottom), over 1000 steps.
            </figcaption>
          </figure>
        </Q>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="next">what&#39;s next</SectionHeading>
        <P>This is the starting point of the PhD at ONERA and ISIR. The open directions, in order of how much they are on my mind:</P>
        <ul className="flex list-disc flex-col gap-1.5 pl-[18px] text-[1rem] leading-[1.7] text-body">
          <li><b className="font-medium text-ink">Waypoint tracking.</b> From holding one attitude to sequencing spatial targets, a longer-horizon and more compositional task.</li>
          <li><b className="font-medium text-ink">Inference cost.</b> 21 ms per step is twice the budget. Action delay, executing short sequences instead of replanning every step, or MPPI instead of CEM.</li>
          <li><b className="font-medium text-ink">Joint learning of model and controller</b>, and hierarchical control across the attitude and guidance loops.</li>
        </ul>
        <p className="font-mono text-[0.875rem]"><Link href="/#phd">the phd, on the main page →</Link></p>
      </section>

      <Rule />
      <Footer />
    </main>
  );
}
