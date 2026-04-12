"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import '@fontsource/bebas-neue';
import React, { useEffect, useState } from 'react';
import { GitHub, LinkedIn, Email, Menu, X } from '@mui/icons-material';

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

const fetchLastCommitDate = async () => {
  const response = await fetch(`https://api.github.com/repos/Titouaaaan/pi5-app/commits`);
  if (!response.ok) {
    throw new Error('Failed to fetch commit data');
  }
  const commits = await response.json();
  if (commits.length > 0) {
    return new Date(commits[0].commit.committer.date).toLocaleString();
  }
  return 'Unknown';
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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      const statsData = await fetchStats();
      setStats(statsData);
    };

    const fetchDate = async () => {
      try {
        const date = await fetchLastCommitDate();
        setLastUpdate(date);
      } catch (error) {
        console.error('Error fetching last commit date:', error);
      }
    };

    loadStats();
    fetchDate();

    const handleScroll = () => {
      const sections = ['welcome', 'about', 'projects', 'timeline', 'resume', 'skills'];
      const tolerancePixels = 600;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= tolerancePixels && rect.bottom >= tolerancePixels) {
            setActiveSection(section);
            return;
          }
        }
      }
      setActiveSection(null);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Header Section */}
        <header className="sticky top-0 left-0 w-full z-50 bg-white shadow-md p-3 flex justify-between items-center">
          {/* Name on the Left */}
          <div
            className={`text-black font-bebas text-lg md:text-2xl ${activeSection === 'welcome' ? 'font-bold' : ''}`}
            onClick={() => scrollToSection('welcome')}
            style={{ cursor: 'pointer' }}
          >
            Titouan Guerin
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <button
              onClick={() => scrollToSection('about')}
              className={`text-black font-bebas text-sm ${activeSection === 'about' ? 'font-bold text-red-600' : ''}`}
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className={`text-black font-bebas text-sm ${activeSection === 'projects' ? 'font-bold text-red-600' : ''}`}
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('timeline')}
              className={`text-black font-bebas text-sm ${activeSection === 'timeline' ? 'font-bold text-red-600' : ''}`}
            >
              Timeline
            </button>
            <button
              onClick={() => scrollToSection('resume')}
              className={`text-black font-bebas text-sm ${activeSection === 'resume' ? 'font-bold text-red-600' : ''}`}
            >
              Skills
            </button>
          </nav>

          {/* Mobile Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-black p-2"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden sticky top-16 z-40 bg-white border-b border-gray-200 shadow-md">
            <div className="flex flex-col">
              <button
                onClick={() => {
                  scrollToSection('about');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 text-black font-bebas border-b border-gray-100 text-sm ${activeSection === 'about' ? 'bg-gray-100 font-bold text-red-600' : ''}`}
              >
                About
              </button>
              <button
                onClick={() => {
                  scrollToSection('projects');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 text-black font-bebas border-b border-gray-100 text-sm ${activeSection === 'projects' ? 'bg-gray-100 font-bold text-red-600' : ''}`}
              >
                Projects
              </button>
              <button
                onClick={() => {
                  scrollToSection('timeline');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 text-black font-bebas border-b border-gray-100 text-sm ${activeSection === 'timeline' ? 'bg-gray-100 font-bold text-red-600' : ''}`}
              >
                Timeline
              </button>
              <button
                onClick={() => {
                  scrollToSection('resume');
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-3 text-black font-bebas text-sm ${activeSection === 'resume' ? 'bg-gray-100 font-bold text-red-600' : ''}`}
              >
                Skills
              </button>
            </div>
          </nav>
        )}

        {/* Main Content */}
        {children}

        {/* Footer Banner */}
        <footer id="footer" className="bg-black text-white p-4 mt-5 w-full">
          {/* Mobile Layout */}
          <div className="block md:hidden">
            <div className="flex flex-col gap-4">
              {/* Stats */}
              <div className="text-center text-xs">
                <h1 className="text-sm font-semibold mb-2">Pi5 System Stats</h1>
                {stats ? (
                  <div className="space-y-1">
                    <p>CPU: {stats.cpu}</p>
                    <p>Memory: {stats.memory}</p>
                    <p>Disk: {stats.disk}</p>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              
              {/* Social Icons */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex justify-center gap-4 mb-2">
                  <Link href="https://github.com/Titouaaaan" target="_blank" rel="noopener noreferrer">
                    <GitHub fontSize="medium" />
                  </Link>
                  <Link href="https://www.linkedin.com/in/tguerin02/" target="_blank" rel="noopener noreferrer">
                    <LinkedIn fontSize="medium" />
                  </Link>
                  <Link href="mailto:titouanguerin@gmail.com">
                    <Email fontSize="medium" />
                  </Link>
                </div>
                <p className="text-center text-xs">© Titouan Guerin</p>
              </div>

              {/* Last Update */}
              <div className="text-center text-xs">
                {lastUpdate ? <p>Last Update: {lastUpdate.split(' ')[0]}</p> : <p>Loading...</p>}
              </div>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center gap-4">
            {/* Stats on the left */}
            <div className="text-left text-xs flex-1">
              <h1 className="text-sm font-semibold mb-2">Pi5 System Stats</h1>
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
            <div className="flex flex-col items-center justify-center flex-1">
              <div className="flex justify-center gap-6 mb-2">
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

            {/* Last Update on the right */}
            <div className="text-right text-xs flex-1">
              {lastUpdate ? <p>Last Website Update: {lastUpdate}</p> : <p>Loading...</p>}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
