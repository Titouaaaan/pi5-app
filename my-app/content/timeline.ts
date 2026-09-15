export type TimelineEntry = {
  date: string;
  role: string;
  org: string;
  detail?: string;
  /** Degrees are set in bold in the timeline. */
  education?: true;
};

export const timeline: TimelineEntry[] = [
  {
    date: "2026.11",
    role: "PhD student",
    education: true,
    org: "ONERA - Université Paris-Saclay & Sorbonne Université",
    detail: "Model-based reinforcement learning for drone control.",
  },
  {
    date: "2026.03",
    role: "Research internship",
    org: "ISIR x ONERA",
    detail: "World models and deep reinforcement learning for drone control.",
  },
  {
    date: "2024.07",
    role: "AI research assistant",
    org: "AI Robolab, University of Luxembourg",
    detail:
      "Backend for a multi-agent language learning app built with LangGraph. Co-authored a paper presented at PRIMA in Kyoto.",
  },
  {
    date: "2023.09",
    role: "MSc AI and Machine Learning",
    education: true,
    org: "Sorbonne Université",
  },
  {
    date: "2023.02",
    role: "Information security intern",
    org: "Grant Thornton Luxembourg",
  },
  {
    date: "2022.08",
    role: "Data analysis intern",
    org: "Grant Thornton Luxembourg",
  },
  {
    date: "2022.02",
    role: "Semester project tutor",
    org: "University of Luxembourg",
  },
  {
    date: "2020.09",
    role: "BSc Computer Science",
    education: true,
    org: "University of Luxembourg",
  },
  {
    date: "2020.09",
    role: "Augmented reality intern",
    org: "Goodyear",
    detail: "HoloLens 2 maintenance guide.",
  },
];
