export const profile = {
  name: "Titouan Guerin",
  tagline:
    "PhD student in deep reinforcement learning, physics-informed models and model-based control at ONERA and Sorbonne Université, from November 2026.",
  links: [
    { label: "github", href: "https://github.com/Titouaaaan" },
    { label: "linkedin", href: "https://linkedin.com/in/tguerin02" },
    { label: "scholar", href: "https://scholar.google.com/citations?user=IgYkGZ0AAAAJ" },
    { label: "email", href: "mailto:titouanguerin@gmail.com" },
    { label: "cv.pdf", href: "/Titouan_Guerin_CV.pdf" },
  ],
  /** Host lab and the two co-directing universities of the PhD, shown as a header strip. */
  institutions: [
    { name: "ONERA", src: "/logos/onera_logo.jpg", width: 100, height: 100, href: "https://www.onera.fr" },
    { name: "Université Paris-Saclay", src: "/logos/paris_saclay_logo.png", width: 181, height: 72, href: "https://www.universite-paris-saclay.fr" },
    { name: "Sorbonne Université", src: "/logos/sorbonne_universite_logo.jpeg", width: 100, height: 100, href: "https://www.sorbonne-universite.fr" },
  ],
  about: [
    "I studied AI and Machine Learning at Sorbonne Université (the MIND Master's, previously called DAC), specialising in probabilistic modelling, deep learning and reinforcement learning. Before that I completed a Bachelor's in Computer Science at the University of Luxembourg in 2023.",
    "I am drawn to the mathematics behind machine learning, and to reinforcement learning in particular. My final Master's internship at ISIR and ONERA was on RL and physics-informed models for drone control, and in November 2026 I am continuing that work there as a PhD. Outside research I have done some software development and a little tutoring.",
  ],
} as const;
