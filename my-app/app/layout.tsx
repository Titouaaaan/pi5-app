"use client";
// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import '@fontsource/bebas-neue';
import React from 'react';
import { GitHub, LinkedIn, Email } from '@mui/icons-material';
import { useEffect, useState } from 'react';


interface SystemStats {
  cpu: string;
  memory: string;
  disk: string;
}

const fetchStats = async (): Promise<SystemStats> => {
  try {
    const response = await fetch('/system-stats');
    
    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    return {} as SystemStats;  // Return an empty object or handle the error appropriately
  }
};



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* export const metadata: Metadata = {
  title: "Titouan Guerin",
  description: "Personal website of Titouan Guerin, stay tuned cuz more stuff will get added",
}; */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const [stats, setStats] = useState<SystemStats | null>(null);

  // Call the fetchStats function on component mount
  useEffect(() => {
    const loadStats = async () => {
      const statsData = await fetchStats();
      setStats(statsData);
    };

    loadStats();
  }, []);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Navigation Bar */}
        <nav className="flex justify-between items-center p-4 bg-black-500 text-white font-bebas">
          <div className="text-3xl text-lg font-bold font-bebas">Insert Logo Eventually</div>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline text-2xl">
              Home
            </Link>
            <Link href="/about" className="hover:underline text-2xl">
              About
            </Link>
            <Link href="/resume"  className="hover:underline text-2xl">
              Resume
            </Link>
            <Link href="/projects" className="hover:underline text-2xl">
              Projects
            </Link>
            {/* <Link href="/test" className="hover:underline text-2xl"> 
            Test
            </Link>  */}
          </div>
        </nav>
        {/* Main Content */}
        {children}

        {/* Footer Banner */}
            
        <footer id="footer" className="bg-black-500 text-white p-1 mt-5">
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
