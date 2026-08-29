import { useEffect, useRef } from "react";

/** Renders a pixel sprite (array of bit-rows) to a crisp canvas. */
export function PixelIcon({
  rows,
  scale = 3,
  color,
  className,
  style,
}: {
  rows: string[];
  scale?: number;
  color: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const w = Math.max(...rows.map((r) => r.length));
  const h = rows.length;

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = color;
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        if (row[x] === "1") ctx.fillRect(x, y, 1, 1);
      }
    });
  }, [rows, color, w, h]);

  return (
    <canvas
      ref={ref}
      className={className}
      style={{ width: w * scale, height: h * scale, imageRendering: "pixelated", ...style }}
    />
  );
}
