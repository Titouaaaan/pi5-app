import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const description =
  "PhD student in deep reinforcement learning at ONERA and Sorbonne Université. World models and model-based control for drones. Projects, education and experience.";

export const metadata: Metadata = {
  metadataBase: new URL("https://titouanguerin.com"),
  title: "Titouan Guerin",
  description,
  authors: [{ name: "Titouan Guerin" }],
  openGraph: {
    title: "Titouan Guerin",
    description,
    url: "https://titouanguerin.com",
    siteName: "Titouan Guerin",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Titouan Guerin",
    description,
  },
  robots: { index: true, follow: true },
  alternates: {
    canonical: "https://titouanguerin.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${plexSans.variable} ${plexMono.variable} font-sans`}>
        <StructuredData />
        {children}
      </body>
    </html>
  );
}
