import { glyphFor, textWidth, ADVANCE } from "./font";

export const W = 84;
export const H = 48;

export class Lcd {
  buf = new Uint8Array(W * H);

  clear(): void {
    this.buf.fill(0);
  }

  copyFrom(src: Uint8Array): void {
    this.buf.set(src);
  }

  inBounds(x: number, y: number): boolean {
    return x >= 0 && x < W && y >= 0 && y < H;
  }

  set(x: number, y: number, v = 1): void {
    x = Math.round(x);
    y = Math.round(y);
    if (this.inBounds(x, y)) this.buf[y * W + x] = v;
  }

  get(x: number, y: number): number {
    return this.inBounds(x, y) ? this.buf[y * W + x] : 0;
  }

  rect(x: number, y: number, w: number, h: number, v = 1): void {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) this.set(xx, yy, v);
    }
  }

  frame(x: number, y: number, w: number, h: number, v = 1): void {
    this.rect(x, y, w, 1, v);
    this.rect(x, y + h - 1, w, 1, v);
    this.rect(x, y, 1, h, v);
    this.rect(x + w - 1, y, 1, h, v);
  }

  hline(x: number, y: number, len: number, v = 1): void {
    this.rect(x, y, len, 1, v);
  }

  vline(x: number, y: number, len: number, v = 1): void {
    this.rect(x, y, 1, len, v);
  }

  /** checkerboard dither in a region — used to dim behind popups */
  dither(x: number, y: number, w: number, h: number, v = 1): void {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) {
        if ((xx + yy) % 2 === 0) this.set(xx, yy, v);
      }
    }
  }

  sprite(rows: string[], x: number, y: number, v = 1): void {
    for (let yy = 0; yy < rows.length; yy++) {
      const row = rows[yy];
      for (let xx = 0; xx < row.length; xx++) {
        if (row[xx] === "1") this.set(x + xx, y + yy, v);
      }
    }
  }

  text(s: string, x: number, y: number, v = 1): void {
    let cx = x;
    for (const ch of s) {
      const glyph = glyphFor(ch);
      for (let yy = 0; yy < 7; yy++) {
        const row = glyph[yy];
        for (let xx = 0; xx < 5; xx++) {
          if (row[xx] === "1") this.set(cx + xx, y + yy, v);
        }
      }
      cx += ADVANCE;
    }
  }

  /** pixel-doubled text for the big clock / logos */
  textScaled(s: string, x: number, y: number, scale: number, v = 1): void {
    let cx = x;
    for (const ch of s) {
      const glyph = glyphFor(ch);
      for (let yy = 0; yy < 7; yy++) {
        const row = glyph[yy];
        for (let xx = 0; xx < 5; xx++) {
          if (row[xx] === "1") this.rect(cx + xx * scale, y + yy * scale, scale, scale, v);
        }
      }
      cx += ADVANCE * scale;
    }
  }

  textCenter(s: string, y: number, v = 1, scale = 1): void {
    const w = textWidth(s, scale);
    this.textScaled(s, Math.floor((W - w) / 2), y, scale, v);
  }

  textRight(s: string, rightX: number, y: number, v = 1): void {
    this.text(s, rightX - textWidth(s), y, v);
  }
}

export function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    let w = word;
    while (w.length > maxChars) {
      const chunk = w.slice(0, maxChars);
      if (cur) {
        lines.push(cur);
        cur = "";
      }
      lines.push(chunk);
      w = w.slice(maxChars);
    }
    if (!w) continue;
    if (cur && (cur + " " + w).length > maxChars) {
      lines.push(cur);
      cur = w;
    } else {
      cur = cur ? cur + " " + w : w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}
