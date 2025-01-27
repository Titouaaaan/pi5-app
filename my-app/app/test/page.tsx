"use client";

export default function Test() {
  return (
    <main className="flex min-h-screen bg-gray-300 font-bebas text-black"
    style={{
      backgroundImage: "url(/bg_gif.gif)", // Replace with your GIF path
      backgroundSize: "cover", // Ensures the GIF covers the entire background
      backgroundPosition: "center", // Centers the background
      backgroundRepeat: "no-repeat", // Prevents the GIF from repeating
    }}>
        <p>hi</p>
    </main>
  );
}