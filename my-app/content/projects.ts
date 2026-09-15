export type Project = {
  id: string;
  slug: string;
  tag: string;
  year: string;
  body: string;
  stack?: string;
  /** Full title, shown above the body when the slug is only a short name. */
  title?: string;
  /** Quoted verbatim, for example a paper abstract. */
  quote?: string;
  /** A published paper's DOI; the row shows its citation count. */
  doi?: string;
  links: { label: string; href: string }[];
};

export const projects: Project[] = [
  {
    id: "master-thesis",
    slug: "master-thesis",
    tag: "fixed-wing uav attitude control",
    year: "2026",
    title:
      "Model-based deep reinforcement learning for fixed-wing UAV attitude control with prior physics knowledge",
    body: "My final Master's project, done at ISIR and ONERA from March to August 2026, and the starting point of the PhD. The abstract:",
    quote:
      "Fixed-wing UAVs are efficient for long-range missions, but their attitude dynamics grow strongly nonlinear and coupled away from level flight, making them harder to control than the quadrotors that most of the literature targets. Reinforcement learning can learn controllers directly from data, but model-free RL requires a large number of costly simulator interactions. Model-based RL instead learns a dynamics model to train on, which can be made more reliable by embedding known aerodynamic physics as a prior. However, this assumes the prior is accurate, which is rarely the case. In this work we extend PhIHP, a physics-informed model-based RL method validated only on classic control benchmarks, to fixed-wing UAV attitude control. These test environments have dynamics that are low-dimensional and exactly known, and we test whether the approach holds on a system whose aerodynamics are neither. We build a physics prior for a simulated Skywalker X8 fixed-wing UAV, paired with a learned residual that corrects what the prior misses. We evaluate controllers on settled attitude tracking error: the steady-state deviation, in degrees, between commanded and achieved roll and pitch. First, we show that a policy trained purely on trajectories imagined through this dynamics model, with no further simulator interaction, comes close to the tracking accuracy of a policy trained directly on the simulator, and beats it when the environment is parallelized. Second, we show that when the prior is inaccurate, tracking error rises sharply in non-nominal flying conditions, but jointly optimizing the prior's parameters alongside the residual recovers 37-38% of this loss on the hardest targets. Third, combining the trained policy with a short-horizon planner into a Hybrid Controller reduces tracking errors by up to 43% over the policy alone. The modifications we introduce depend only on having a physics prior available, not on the specifics of our system.",
    links: [{ label: "download report", href: "/Titouan_Guerin_Master_Thesis.pdf" }],
  },
  {
    id: "rl-souls",
    slug: "RL-Souls",
    tag: "reinforcement learning",
    year: "2025",
    stack: "python · pytorch · gymnasium · tensorboard",
    body: "Model-free reinforcement learning algorithms implemented from scratch to train an agent in Dark Souls III, using the SoulsGym environment (a custom Gymnasium). Different algorithms are tested and tuned to work out which methods actually survive a boss fight. Built during my gap year between M1 and M2.",
    links: [{ label: "view on github", href: "https://github.com/Titouaaaan/RL-Souls" }],
  },
  {
    id: "diy-nn",
    slug: "DIY-Neural-Network",
    tag: "from scratch",
    year: "2025",
    stack: "python · numpy",
    body: "A neural network built on NumPy alone, following the modular shape of early PyTorch, with every layer a module with forward and backward passes. Linear layers and MSE first, then activations, a Sequentiel container and an SGD optimiser, then softmax and cross-entropy for multi-class, autoencoders, and finally 1D convolution, pooling and flattening. PCA and K-means came along the way.",
    links: [{ label: "view on github", href: "https://github.com/Titouaaaan/DIY-Neural-Network" }],
  },
  {
    id: "ell-mma",
    slug: "ELL-MMA",
    tag: "llm multi-agent system",
    year: "2024",
    stack: "langgraph · gpt-4o · rag",
    body: "Rather than one chatbot, a multi-agent system where each agent specialises in a different part of language learning: reading, conversation, listening, grammar. Aimed at Luxembourgish, a low-resource language. Co-authored paper published at PRIMA 2024, demoed in Kyoto.",
    doi: "10.1007/978-3-031-77367-9_29",
    links: [
      { label: "view on github", href: "https://github.com/Titouaaaan/ELL-MMA" },
      { label: "read paper", href: "https://doi.org/10.1007/978-3-031-77367-9_29" },
    ],
  },
  {
    id: "pi5-app",
    slug: "pi5-app",
    tag: "this website",
    year: "2024",
    stack: "next.js · fastapi · cloudflare",
    body: "A full-stack app self-hosted on a Raspberry Pi 5, with Next.js on the front and FastAPI behind it, exposed through a Cloudflare tunnel so no ports are opened and the Pi keeps its address to itself. The statistics at the bottom of this page come from that backend, live.",
    links: [{ label: "view on github", href: "https://github.com/Titouaaaan/pi5-app" }],
  },
];
