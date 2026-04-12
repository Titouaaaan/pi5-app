"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@fontsource/bebas-neue';
import React, { useEffect, useState } from 'react';
import { Menu, X } from '@mui/icons-material';
import NeuralNetworkBackground from './components/NeuralNetworkBackground';

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

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState<{ cpu: string; memory: string; disk: string } | null>(null);
  const [lastCommitDate, setLastCommitDate] = useState<string | null>(null);

  useEffect(() => {
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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const backendUrl = typeof window !== 'undefined' 
          ? `http://${window.location.hostname}:8000/system-stats`
          : 'http://localhost:8000/system-stats';
        const response = await fetch(backendUrl);
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    const fetchLastCommitDate = async () => {
      try {
        const response = await fetch('https://api.github.com/repos/Titouaaaan/pi5-app/commits?per_page=1');
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const date = new Date(data[0].commit.committer.date);
            setLastCommitDate(date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
          }
        }
      } catch (error) {
        console.error('Failed to fetch GitHub data:', error);
      }
    };

    fetchStats();
    fetchLastCommitDate(); 
    const interval = setInterval(fetchStats, 30000); // Refresh stats every 30s

    return () => clearInterval(interval);
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white relative`}>
        <NeuralNetworkBackground />
        
        {/* Content wrapper with z-index above background */}
        <div className="relative z-10">
          {/* Header Section */}
          <header className="sticky top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-md border-b border-white/10 p-3 flex justify-between items-center">
            <div
              className="text-white font-bebas text-lg md:text-2xl cursor-pointer hover:text-gray-300 transition"
              onClick={() => scrollToSection('welcome')}
            >
              Titouan Guerin
            </div>

            <nav className="hidden md:flex space-x-6">
              <button
                onClick={() => scrollToSection('about')}
                className={`text-white font-bebas text-sm transition ${activeSection === 'about' ? 'font-bold text-blue-400' : 'hover:text-gray-300'}`}
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('projects')}
                className={`text-white font-bebas text-sm transition ${activeSection === 'projects' ? 'font-bold text-blue-400' : 'hover:text-gray-300'}`}
              >
                Projects
              </button>
              <button
                onClick={() => scrollToSection('timeline')}
                className={`text-white font-bebas text-sm transition ${activeSection === 'timeline' ? 'font-bold text-blue-400' : 'hover:text-gray-300'}`}
              >
                Timeline
              </button>
              <button
                onClick={() => scrollToSection('resume')}
                className={`text-white font-bebas text-sm transition ${activeSection === 'resume' ? 'font-bold text-blue-400' : 'hover:text-gray-300'}`}
              >
                Skills
              </button>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X fontSize="large" /> : <Menu fontSize="large" />}
            </button>
          </header>

          {mobileMenuOpen && (
            <nav className="fixed top-16 left-0 right-0 md:hidden z-40 bg-black/90 backdrop-blur-md border-b border-white/10 shadow-lg">
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    scrollToSection('about');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-white font-bebas border-b border-white/10 text-sm transition hover:bg-white/5"
                >
                  About
                </button>
                <button
                  onClick={() => {
                    scrollToSection('projects');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-white font-bebas border-b border-white/10 text-sm transition hover:bg-white/5"
                >
                  Projects
                </button>
                <button
                  onClick={() => {
                    scrollToSection('timeline');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-white font-bebas border-b border-white/10 text-sm transition hover:bg-white/5"
                >
                  Timeline
                </button>
                <button
                  onClick={() => {
                    scrollToSection('resume');
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-3 text-white font-bebas text-sm transition hover:bg-white/5"
                >
                  Skills
                </button>
              </div>
            </nav>
          )}

          {children}

          <footer className="border-t border-white/10 bg-black/40 py-6 text-center text-gray-400 text-sm">
            <p>&copy; 2024 - present. Titouan Guerin. All rights reserved.</p>
            {stats && (
              <div className="mt-2 text-xs text-gray-500">
                <p>RPi5 Stats: CPU {stats.cpu} | Memory {stats.memory} | Disk {stats.disk}</p>
              </div>
            )}
            {lastCommitDate && (
              <div className="mt-2 text-xs text-gray-500">
                <p>Last GitHub update: {lastCommitDate}</p>
              </div>
            )}
          </footer>
        </div>
      </body>
    </html>
  );
}
