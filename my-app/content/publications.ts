export type Publication = {
  doi: string;
  title: string;
  authors: string;
  venue: string;
  year: number;
  /** Google Scholar has no API; this links to the paper's entry there. */
  scholarUrl: string;
};

export const publications: Publication[] = [
  {
    doi: "10.1007/978-3-031-77367-9_29",
    title:
      "Beyond Chatbots: Enhancing Luxembourgish Language Learning Through Multi-agent Systems and Large Language Model",
    authors: "Nouzri, S., El Fatimi, M., Guerin, T., Othmane, M., Najjar, A.",
    venue:
      "PRIMA 2024: Principles and Practice of Multi-Agent Systems, Kyoto. Lecture Notes in Computer Science, vol. 15395, Springer",
    year: 2025,
    scholarUrl:
      "https://scholar.google.com/scholar?q=%22Beyond+Chatbots%3A+Enhancing+Luxembourgish+Language+Learning+Through+Multi-agent+Systems+and+Large+Language+Model%22",
  },
];
