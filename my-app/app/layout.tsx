import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import '@fontsource/bebas-neue';
import React from 'react';
import { GitHub, LinkedIn, Email } from '@mui/icons-material';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Titouan Guerin",
  description: "Personal website of Titouan Guerin, stay tuned cuz more stuff will get added",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          </div>
        </nav>
        {/* Main Content */}
        {children}

        {/* Footer Banner */}
        <footer className="bg-black-500 text-white p-4 mt-8">
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
          <p className="text-center mt-2">© Titouan Guerin</p>
        </footer>
      </body>
    </html>
  );
}
