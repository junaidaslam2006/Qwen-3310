import type { Lcd } from "./lcd";

export type Key =
  | { kind: "dir"; dir: "up" | "down" | "left" | "right" }
  | { kind: "ok" }
  | { kind: "back" }
  | { kind: "call" }
  | { kind: "digit"; digit: number }
  | { kind: "star" }
  | { kind: "hash" }
  | { kind: "char"; char: string };

export interface Scene {
  /** hide status bar / soft labels etc. defaults false */
  fullscreen?: boolean;
  enter?(): void;
  exit?(): void;
  update(dt: number, t: number): void;
  draw(lcd: Lcd): void;
  key?(k: Key): void;
  /** LCD pixel coords */
  pointer?(x: number, y: number): void;
}
