import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
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
  weight: ["400", "500", "700"],
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
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${plexSans.variable} ${plexMono.variable} font-sans`}>
        {/* Restore a saved theme before anything paints, so there is no flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var d=document.documentElement,u=new URL(location.href),h=/theme=(dark|light)/.exec(location.hash),q=(h&&h[1])||u.searchParams.get('theme'),t=q||localStorage.getItem('theme');if(t==='dark'||t==='light'){d.dataset.theme=t;if(q){localStorage.setItem('theme',t);u.searchParams.delete('theme');u.hash='';history.replaceState(null,'',u)}}}catch(e){}})()",
          }}
        />
        <StructuredData />
        {/* First focusable element: keyboard and screen-reader users jump past the header. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-rule focus:bg-paper focus:px-3 focus:py-2 focus:font-mono focus:text-[0.875rem] focus:no-underline"
        >
          skip to content
        </a>
        <Header />
        {children}
      </body>
    </html>
  );
}
