export type Project = {
  id: string;
  slug: string;
  tag: string;
  year: string;
  stack: string;
  body: string;
  href: string;
};

export const projects: Project[] = [
  {
    id: "rl-souls",
    slug: "RL-Souls",
    tag: "reinforcement learning",
    year: "2025",
    stack: "python · pytorch · gymnasium · tensorboard",
    body: "Model-free reinforcement learning algorithms implemented from scratch to train an agent in Dark Souls III, using the SoulsGym environment (a custom Gymnasium). Different algorithms are tested and tuned to work out which methods actually survive a boss fight. Built during my gap year between M1 and M2.",
    href: "https://github.com/Titouaaaan/RL-Souls",
  },
  {
    id: "diy-nn",
    slug: "DIY-Neural-Network",
    tag: "from scratch",
    year: "2025",
    stack: "python · numpy",
    body: "A neural network built on NumPy alone, following the modular shape of early PyTorch, with every layer a module with forward and backward passes. Linear layers and MSE first, then activations, a Sequentiel container and an SGD optimiser, then softmax and cross-entropy for multi-class, autoencoders, and finally 1D convolution, pooling and flattening. PCA and K-means came along the way.",
    href: "https://github.com/Titouaaaan/DIY-Neural-Network",
  },
  {
    id: "ell-mma",
    slug: "ELL-MMA",
    tag: "llm multi-agent system",
    year: "2024",
    stack: "langgraph · gpt-4o · rag",
    body: "Rather than one chatbot, a multi-agent system where each agent specialises in a different part of language learning: reading, conversation, listening, grammar. Aimed at Luxembourgish, a low-resource language. Co-authored paper published at PRIMA, demoed in Kyoto.",
    href: "https://github.com/Titouaaaan/ELL-MMA",
  },
  {
    id: "pi5-app",
    slug: "pi5-app",
    tag: "this website",
    year: "2024",
    stack: "next.js · fastapi · cloudflare",
    body: "A full-stack app self-hosted on a Raspberry Pi 5, with Next.js on the front and FastAPI behind it, exposed through a Cloudflare tunnel so no ports are opened and the Pi keeps its address to itself. The statistics at the bottom of this page come from that backend, live.",
    href: "https://github.com/Titouaaaan/pi5-app",
  },
];
