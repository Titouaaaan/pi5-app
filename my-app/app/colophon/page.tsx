import type { Metadata } from "next";
import Link from "next/link";
import Footer from "../components/Footer";
import Rule from "../components/Rule";
import SectionHeading from "../components/SectionHeading";
import TunnelDiagram from "../components/TunnelDiagram";

export const metadata: Metadata = {
  title: "How this site runs",
  description: "titouanguerin.com is served from a Raspberry Pi 5 at home through a Cloudflare tunnel. The stack and a few things worth liking about it.",
  alternates: { canonical: "https://titouanguerin.com/colophon" },
  openGraph: { title: "How this site runs", url: "https://titouanguerin.com/colophon" },
};

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[16px] leading-[1.7] text-body">{children}</p>
);
const Item = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <li className="text-[16px] leading-[1.7] text-body">
    <b className="font-semibold text-ink">{title}</b> {children}
  </li>
);

export default function ColophonPage() {
  return (
    <main className="mx-auto flex max-w-column flex-col gap-9 px-8 pb-16 pt-8">
      <p className="font-mono text-[14px]">
        <Link href="/">← titouanguerin.com</Link> <span className="text-faint">/ colophon</span>
      </p>

      <section className="flex flex-col gap-3">
        <h1 className="flex items-baseline gap-2.5 text-[38px] font-semibold leading-tight tracking-tight">
          <span aria-hidden="true" className="font-mono text-[28px] font-normal text-fainter">#</span>
          how this site runs
        </h1>
        <p className="text-[18px] leading-relaxed text-body">
          I did not want to pay for a server, so the site is hosted on my Raspberry Pi 5 sitting on my desk, and I briefly explain here how it works.
        </p>
      </section>

      <figure className="flex flex-col gap-2">
        {/* The tile is white in both themes, so the diagram always uses the light palette. */}
        <div
          className="rounded-md border border-rule bg-white p-3"
          style={{ "--ink": "#16191c", "--body": "#2a3036", "--faint": "#606870", "--fainter": "#6e767e", "--rule": "#e3e7ea" } as React.CSSProperties}
        >
          <TunnelDiagram />
        </div>
        <figcaption className="font-mono text-[13px] leading-relaxed text-faint">
          A request, left to right. The Pi never accepts a connection from the internet: it opens one outbound tunnel to Cloudflare and answers through it.
        </figcaption>
      </figure>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="why">why a pi</SectionHeading>
        <P>This kind of portfolio website doesn&apos;t get thousands or millions of visitors per day (for now?), therefore a Pi 5 can easily handle it. The device only draws a few watts, so hosting at home costs less than a coffee a month, and much less than if I had to pay for a server provider. 
          The one catch of this setup is that a home connection sits behind a router with no fixed address and no ports I want to open. A Cloudflare tunnel solves exactly that: the Pi dials out, Cloudflare holds the public address, and nothing on my network is reachable directly. 
          I also get to play around with this awesome toy, which is always fun. The Pi does a few other things for me at home too, like a little self-hosted drive for my photos and videos, and I&apos;ll probably write a page about that setup eventually.</P>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="stack">the stack</SectionHeading>
        <ul className="flex flex-col gap-2.5">
          <Item title="Next.js and TypeScript">for the pages, rendered on the server so the site is plain HTML to a crawler and works (mostly) with JavaScript off.</Item>
          <Item title="Tailwind">for the styling, and it&apos;s a bit better than vanilla CSS from my experience.</Item>
          <Item title="FastAPI">in Python for the little backend: the live stats in the footer, the visitor counter, and a cache in front of GitHub, OpenAlex and Cloudflare so the page never depends on them being up.</Item>
          <Item title="Cloudflare">for DNS, TLS and the tunnel, and <b className="font-semibold text-ink">systemd</b> keeps the three services running through reboots on my Pi.</Item>
        </ul>
      </section>

      <Rule />
      <section className="flex flex-col gap-3.5">
        <SectionHeading id="likes">things i like about it</SectionHeading>
        <ul className="flex flex-col gap-2.5">
          <Item title="The footer is live.">CPU, memory, disk and uptime come from the Pi every 5 seconds.</Item>
          <Item title="Deploys cannot half-break it.">A script builds the new version into a scratch folder, swaps it in only if the build succeeded, restarts, checks that the page now carries the new commit hash, and rolls back on its own if it does not. It has done that once, for real.</Item>
          <Item title="The visitor counter cannot track you.">It stores a hash of your address mixed with the date and a secret that never leaves the Pi. Same person tomorrow, different hash. No cookies, nothing to join.</Item>
          <Item title="Nothing loads from anyone else.">The only JavaScript on the page is my own, about 110 kB of it, used for small things like the dropdown menu and the light/dark switch. There is no external analytics script adding more, and the single embed is the YouTube video of my RL agent in the Dark Souls III project, which only loads when you open that row. I tried to keep it as light as I could.</Item>
        </ul>
      </section>

      <Rule />
      <Footer colophonLink={false} />
    </main>
  );
}
