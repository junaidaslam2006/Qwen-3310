import { useEffect, useState } from "react";
import { PixelText } from "./PixelText";

/** Real local time in Nokia LCD style, with a blinking colon. */
export function LcdClock({
  scale = 4,
  color,
  withAmPm = false,
  className,
}: {
  scale?: number;
  color: string;
  withAmPm?: boolean;
  className?: string;
}) {
  const [now, setNow] = useState(() => new Date());
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const a = setInterval(() => setNow(new Date()), 1000);
    const b = setInterval(() => setBlink((v) => !v), 500);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, []);

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const sep = blink ? ":" : " ";
  const ampm = now.getHours() >= 12 ? "PM" : "AM";

  return (
    <span className={className} style={{ display: "inline-flex", alignItems: "baseline", gap: scale * 2 }}>
      <PixelText text={`${hh}${sep}${mm}`} scale={scale} color={color} />
      {withAmPm && <PixelText text={ampm} scale={Math.max(2, Math.floor(scale / 2))} color={color} />}
    </span>
  );
}
