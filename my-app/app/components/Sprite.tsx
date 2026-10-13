// Plays a sprite sheet as a looping animation, in CSS only (no client JS).
// The sheet is one row of equal-sized frames, left to right.
export type SpriteSheet = {
  src: string;
  frames: number; // how many frames in the row
  width: number; // one frame, in pixels of the sheet
  height: number;
  fps: number;
  caption: string;
};

export default function Sprite({ src, frames, width, height, fps, caption }: SpriteSheet) {
  return (
    <figure className="flex flex-col items-center gap-2">
      <div
        role="img"
        aria-label={caption}
        className="sprite w-full max-w-[240px]"
        style={{
          aspectRatio: `${width} / ${height}`,
          backgroundImage: `url(${src})`,
          backgroundSize: `${frames * 100}% 100%`,
          animationDuration: `${frames / fps}s`,
          animationTimingFunction: `steps(${frames}, jump-none)`,
        }}
      />
      <figcaption className="text-center font-mono text-[0.8125rem] text-faint">{caption}</figcaption>
    </figure>
  );
}
