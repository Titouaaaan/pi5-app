"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Home() {
    const [hovered, setHovered] = useState<number | null>(null);
  
    const images = [
      { src: "/nopropic.jpg", alt: "Image 1", link: "/about", text: "Go to About Page" },
      { src: "/surf.jpg", alt: "Image 2", link: "/resume", text: "Go to Resume Page"},
      { src: "/publishement.png", alt: "Image 3", link: "/projects", text: "Go to Projects Page" },
      { src: "/profilepic.jpeg", alt: "Image 4", link: "/", text: "Go to Home Page" }
    ];
  
    return (
      <main className="flex min-h-screen flex-col items-center justify-between bg-gray-300 font-bebas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 p-10">
          {images.map((image, index) => (
            <Link key={index} href={image.link} passHref>
              <div
                className="relative group cursor-pointer"
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Image */}
                <Image
                  src={image.src}
                  width={400}
                  height={500}
                  alt={image.alt}
                  className="rounded-lg w-[400px] h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
  
                {/* Overlay */}
                {hovered === index && (
                  <motion.div
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-white font-bebas text-3xl">{image.text}</p>
                  </motion.div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
    );
  }