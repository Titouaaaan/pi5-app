"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import '@fontsource/bebas-neue';
import React, { useEffect, useState } from 'react';
import { GitHub, LinkedIn, Email } from '@mui/icons-material';

interface SystemStats {
  cpu: string;
  memory: string;
  disk: string;
}

const fetchStats = async (): Promise<SystemStats> => {
  const response = await fetch('https://api.titouanguerin.com/system-stats');

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data: SystemStats = await response.json();
  return data;
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [stats, setStats] = useState<SystemStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const statsData = await fetchStats();
      setStats(statsData);
    };

    loadStats();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Header Section */}
        <header className="sticky top-0 bg-white shadow-md p-4 flex justify-between items-center">
          {/* Name on the Left */}
          <div className="text-purple-600 hover:text-purple-800 cursor-pointer" onClick={() => scrollToSection('welcome')}>
            Titouan Guérin
          </div>
          {/* Navigation Links on the Right */}
          <nav className="flex space-x-8">
            <button onClick={() => scrollToSection('about')} className="text-purple-600 hover:text-purple-800">About</button>
            <button onClick={() => scrollToSection('projects')} className="text-purple-600 hover:text-purple-800">Projects</button>
            <button onClick={() => scrollToSection('resume')} className="text-purple-600 hover:text-purple-800">Resume</button>
          </nav>
        </header>

        {/* Main Content */}
        {children}

        {/* Footer Banner */}
        <footer id="footer" className="bg-black text-white p-4 mt-5">
          <div className="flex justify-between mb-4 text-xs">
            {/* Stats on the left */}
            <div className="text-left">
              <h1 className="text-xl font-semibold mb-2 text-xs">Pi5 System Stats</h1>
              {stats ? (
                <div>
                  <p>CPU: {stats.cpu}</p>
                  <p>Memory: {stats.memory}</p>
                  <p>Disk: {stats.disk}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>

            {/* Centered Icons and Name */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center w-full">
              <div className="flex justify-center gap-6">
                <Link href="https://github.com/Titouaaaan" target="_blank" rel="noopener noreferrer">
                  <GitHub fontSize="large" />
                </Link>
                <Link href="https://www.linkedin.com/in/tguerin02/" target="_blank" rel="noopener noreferrer">
                  <LinkedIn fontSize="large" />
                </Link>
                <Link href="mailto:titouanguerin@gmail.com">
                  <Email fontSize="large" />
                </Link>
              </div>
              <p className="text-center text-sm">© Titouan Guerin</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
