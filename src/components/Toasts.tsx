import { useEffect, useState } from "react";
import { PixelText } from "./PixelText";
import { C } from "../engine/colors";

export interface ToastData {
  id: number;
  lines: string[];
  urdu?: string;
}

let nextId = 1;

/** fire a Nokia-style popup anywhere in the app */
export function toast(lines: string[], urdu?: string): void {
  window.dispatchEvent(new CustomEvent<ToastData>("qwen-toast", { detail: { id: nextId++, lines, urdu } }));
}

export function Toasts() {
  const [items, setItems] = useState<ToastData[]>([]);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<ToastData>).detail;
      setItems((s) => [...s, d]);
      setTimeout(() => setItems((s) => s.filter((t) => t.id !== d.id)), 2600);
    };
    window.addEventListener("qwen-toast", on);
    return () => window.removeEventListener("qwen-toast", on);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="toast-wrap">
      <div className="toast-dither" />
      {items.map((t) => (
        <div className="toast" key={t.id}>
          {t.lines.map((l, i) => (
            <PixelText key={i} text={l} scale={2} color={C.ink} className="toast-line" />
          ))}
          {t.urdu && <div className="toast-urdu">{t.urdu}</div>}
        </div>
      ))}
    </div>
  );
}
