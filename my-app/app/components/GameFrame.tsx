"use client";

import { useEffect, useRef, useState } from "react";

// The game lays its menu out in fixed pixels and needs about 960x540 to show
// all of it, more than the text column gives. So it always renders at
// 1280x720 and is scaled to whatever width the frame has: the whole menu is
// visible at any size, only smaller.
const W = 1280;
const H = 720;

export default function GameFrame({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = box.current!;
    const observer = new ResizeObserver(() => setScale(el.clientWidth / W));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={box} className="relative aspect-video w-full overflow-hidden rounded-md border border-rule bg-black">
      {/* Mounted once measured, so the game never starts at the wrong size. */}
      {scale > 0 && (
        <iframe
          src={src}
          title={title}
          width={W}
          height={H}
          allow="fullscreen; gamepad; autoplay"
          className="absolute left-0 top-0 origin-top-left border-0"
          style={{ transform: `scale(${scale})` }}
        />
      )}
    </div>
  );
}
