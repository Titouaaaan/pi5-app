/** Shown under the about text as a labelled grid, like the tools section. */
export const knowledge: { label: string; items: string[] }[] = [
  { label: "rl", items: ["model-free", "model-based", "world models"] },
  { label: "llms", items: ["transformers", "pre-training", "adaptation", "evaluation", "rag"] },
  { label: "generative", items: ["vaes", "gans", "flow matching", "diffusion"] },
  { label: "ai4science", items: ["physics-informed models", "neural odes"] },
  { label: "deep learning", items: ["computational graphs", "autodiff", "cnns", "gnns", "vision transformers"] },
  { label: "vision", items: ["self-supervised learning", "vlms", "vlas"] },
  { label: "and", items: ["mlops", "ai ethics: logic programming", "causal reasoning", "responsibility"] },
];

export const coursework = {
  repo: "https://github.com/Titouaaaan/M2-MIND",
  name: "M2-MIND",
};
