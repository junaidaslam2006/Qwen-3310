import { useEffect, useRef } from "react";
import { glyphFor, textWidth } from "../engine/font";

/** Renders the hand-drawn 5x7 bitmap font to a crisp pixel canvas. */
export function PixelText({
  text,
  scale = 3,
  color,
  className,
  style,
}: {
  text: string;
  scale?: number;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const w = Math.max(1, textWidth(text, 1));

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = w;
    c.height = 7;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, 7);
    ctx.fillStyle = color;
    let cx = 0;
    for (const ch of text) {
      const g = glyphFor(ch);
      for (let y = 0; y < 7; y++) {
        for (let x = 0; x < 5; x++) {
          if (g[y][x] === "1") ctx.fillRect(cx + x, y, 1, 1);
        }
      }
      cx += 6;
    }
  }, [text, color, w]);

  return (
    <canvas
      ref={ref}
      className={className}
      role="img"
      aria-label={text}
      style={{ width: w * scale, height: 7 * scale, imageRendering: "pixelated", ...style }}
    />
  );
}
