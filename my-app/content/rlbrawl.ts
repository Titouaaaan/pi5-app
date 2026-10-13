export const rlbrawl = {
  name: "RL-BRAWL",
  title: "Fighting game (Super Smash Bros inspired) with self-play RL agents",
  meta: "personal project · 2026",
  links: [{ label: "code on github", href: "https://github.com/Titouaaaan/RL-BRAWL" }],
  // Served by the backend from the game repo's web export; see next.config.ts.
  game: "/rl-brawl/play/index.html",
  // Sprite sheets shown in "what's next". Put the PNGs in public/rl-brawl/ and
  // fill in each sheet's numbers: frames in the row, one frame's size, speed.
  animations: [
    { src: "/rl-brawl/idle.png", frames: 8, width: 64, height: 64, fps: 8, caption: "idle animation, not too bad" },
    { src: "/rl-brawl/run.png", frames: 8, width: 64, height: 64, fps: 12, caption: "attempt at making a run animation..." },
  ],
} as const;
