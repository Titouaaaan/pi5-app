export const phd = {
  title:
    "Model-based deep reinforcement learning for drone control with physics-informed priors",
  text: [
    "From November 2026 I am a PhD student at ONERA in Palaiseau, funded by the ANR, working on model-based deep reinforcement learning for drone control with physics-informed priors.",
    "The thesis is co-directed by Julien Marzat (Université Paris-Saclay) and Olivier Sigaud (Sorbonne Université), and supervised by Pierre Fournier at ONERA.",
    "It continues my Master's work on fixed-wing UAVs: what a physical prior brings to the learned dynamics model, then the harder problems around it, long horizons, sparse rewards, partial observability and generalising across tasks and aircraft.",
  ],
  /** Host lab and the two co-directing universities, shown as a logo strip. */
  institutions: [
    { name: "ONERA", src: "/logos/onera_logo.jpg", width: 100, height: 100, href: "https://www.onera.fr" },
    { name: "Université Paris-Saclay", src: "/logos/paris_saclay_logo.png", width: 181, height: 72, href: "https://www.universite-paris-saclay.fr" },
    { name: "Sorbonne Université", src: "/logos/sorbonne_universite_logo.jpeg", width: 100, height: 100, href: "https://www.sorbonne-universite.fr" },
  ],
} as const;
