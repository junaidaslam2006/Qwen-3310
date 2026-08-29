// Tiny synthesized retro sounds. No audio files — everything is WebAudio.
// Audio unlocks on first user gesture (browser autoplay policy).

type Wave = OscillatorType;

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  enabled = true;

  constructor() {
    try {
      this.enabled = localStorage.getItem("qwen3310.sound") !== "off";
    } catch {
      this.enabled = true;
    }
  }

  /** call from any user gesture */
  unlock(): void {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.16;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    try {
      localStorage.setItem("qwen3310.sound", on ? "on" : "off");
    } catch {
      /* ignore */
    }
  }

  toggle(): boolean {
    this.setEnabled(!this.enabled);
    if (this.enabled) this.blip(1300, 40);
    return this.enabled;
  }

  private tone(
    freq: number,
    durMs: number,
    opts: { type?: Wave; vol?: number; at?: number; slideTo?: number } = {},
  ): void {
    if (!this.enabled || !this.ctx || !this.master) return;
    const { type = "square", vol = 1, at = 0, slideTo } = opts;
    const t0 = this.ctx.currentTime + at / 1000;
    const dur = durMs / 1000;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.linearRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.004);
    g.gain.setValueAtTime(vol, t0 + dur - 0.012);
    g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }

  blip(freq: number, durMs: number, at = 0, vol = 0.5): void {
    this.tone(freq, durMs, { vol, at });
  }

  keyPress(): void {
    this.tone(1650, 18, { vol: 0.28 });
  }

  nav(): void {
    this.tone(1180, 26, { vol: 0.4 });
  }

  ok(): void {
    this.tone(880, 34, { vol: 0.45 });
    this.tone(1320, 42, { vol: 0.45, at: 40 });
  }

  back(): void {
    this.tone(660, 34, { vol: 0.4 });
    this.tone(495, 40, { vol: 0.38, at: 36 });
  }

  error(): void {
    this.tone(220, 110, { vol: 0.5 });
    this.tone(185, 130, { vol: 0.45, at: 110 });
  }

  smsAlert(): void {
    this.tone(1318, 70, { vol: 0.5 });
    this.tone(1568, 90, { vol: 0.5, at: 90 });
  }

  sent(): void {
    this.tone(700, 90, { vol: 0.4, slideTo: 1500 });
  }

  received(): void {
    this.tone(1568, 40, { vol: 0.42 });
  }

  eat(): void {
    this.tone(1046, 30, { vol: 0.45 });
    this.tone(1568, 40, { vol: 0.45, at: 34 });
  }

  die(): void {
    this.tone(420, 90, { vol: 0.5, slideTo: 260 });
    this.tone(260, 160, { vol: 0.5, at: 90, slideTo: 130 });
  }

  bootJingle(): void {
    const notes = [587, 740, 880, 1175]; // D5 F#5 A5 D6 — an original friendly arpeggio
    notes.forEach((f, i) => {
      this.tone(f, 150, { type: "triangle", vol: 0.5, at: i * 120 });
    });
    this.tone(1175, 260, { type: "triangle", vol: 0.3, at: 520 });
  }

  /** authentic dual-tone keypad beeps */
  dtmf(key: string): void {
    const rows: Record<string, number> = { "1": 697, "2": 697, "3": 697, "4": 770, "5": 770, "6": 770, "7": 852, "8": 852, "9": 852, "*": 941, "0": 941, "#": 941 };
    const cols: Record<string, number> = { "1": 1209, "2": 1336, "3": 1477, "4": 1209, "5": 1336, "6": 1477, "7": 1209, "8": 1336, "9": 1477, "*": 1209, "0": 1336, "#": 1477 };
    const lo = rows[key];
    const hi = cols[key];
    if (!lo || !hi) return;
    this.tone(lo, 55, { type: "sine", vol: 0.4 });
    this.tone(hi, 55, { type: "sine", vol: 0.4 });
  }
}

export const sound = new SoundEngine();
