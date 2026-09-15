export type TimelineEntry = {
  date: string;
  role: string;
  org: string;
  detail?: string;
};

export const timeline: TimelineEntry[] = [
  {
    date: "2026.03",
    role: "Master's internship",
    org: "ISIR × ONERA",
    detail: "physics-informed model-based RL for safer autonomous systems.",
  },
  {
    date: "2024.07",
    role: "Research assistant",
    org: "University of Luxembourg",
    detail:
      "LangGraph multi-agent backend; co-authored paper, demo in Kyoto.",
  },
  {
    date: "2023.09",
    role: "MSc Machine Learning & AI",
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
    org: "University of Luxembourg",
  },
  {
    date: "2020.09",
    role: "Augmented reality intern",
    org: "Goodyear",
    detail: "HoloLens 2 maintenance guide.",
  },
];
