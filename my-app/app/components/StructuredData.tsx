import { profile } from "@/content/profile";
import { publications } from "@/content/publications";

/**
 * schema.org Person, so search engines can attach name, role, affiliations
 * and profiles to this page rather than guessing from the prose.
 */
export default function StructuredData() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: "https://titouanguerin.com",
    jobTitle: "PhD student in deep reinforcement learning",
    description: profile.tagline,
    affiliation: profile.institutions.map((inst) => ({
      "@type": "Organization",
      name: inst.name,
      url: inst.href,
    })),
    alumniOf: [
      { "@type": "CollegeOrUniversity", name: "Sorbonne Université" },
      { "@type": "CollegeOrUniversity", name: "University of Luxembourg" },
    ],
    sameAs: profile.links
      .map((link) => link.href)
      .filter((href) => href.startsWith("https://")),
    knowsAbout: [
      "Reinforcement learning",
      "Model-based reinforcement learning",
      "World models",
      "Deep learning",
      "UAV control",
    ],
  };

  const articles = publications.map((pub) => ({
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: pub.title,
    author: pub.authors,
    datePublished: String(pub.year),
    isPartOf: pub.venue,
    sameAs: `https://doi.org/${pub.doi}`,
    identifier: { "@type": "PropertyValue", propertyID: "DOI", value: pub.doi },
  }));

  return (
    <>
      {[person, ...articles].map((data, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
