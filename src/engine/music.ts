// Looping Nokia-style ringtone, synthesized with WebAudio — no audio files.
// The melody is the public-domain phrase from Francisco Tárrega's "Gran Vals".

export type MusicState = "off" | "on";

const BEAT = 0.28;

const TUNE: [freq: number, beats: number][] = [
  [659.25, 1], [587.33, 1], [369.99, 2], [415.3, 2],
  [554.37, 1], [493.88, 1], [293.66, 2], [329.63, 2],
  [493.88, 1], [440, 1], [277.18, 2], [329.63, 2], [440, 4],
];

class MusicEngine {
  state: MusicState = "off";
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private timer = 0;

  async toggle(): Promise<MusicState> {
    if (this.state === "on") {
      this.state = "off";
      window.clearTimeout(this.timer);
      if (this.ctx) await this.ctx.suspend();
      return this.state;
    }
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return this.state;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.14;
      this.master.connect(this.ctx.destination);
    }
    await this.ctx.resume();
    this.state = "on";
    this.loop();
    return this.state;
  }

  private loop = (): void => {
    if (!this.ctx || this.state !== "on") return;
    let t = this.ctx.currentTime + 0.06;
    for (const [freq, beats] of TUNE) {
      this.note(freq, t, beats * BEAT);
      t += beats * BEAT;
    }
    this.timer = window.setTimeout(this.loop, (t + 0.7 - this.ctx.currentTime) * 1000);
  };

  private note(freq: number, t: number, dur: number): void {
    if (!this.ctx || !this.master) return;
    const d = Math.max(0.09, dur * 0.92);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.5, t + 0.006);
    g.gain.setValueAtTime(0.5, t + d - 0.02);
    g.gain.linearRampToValueAtTime(0.0001, t + d);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + d + 0.02);
  }
}

export const music = new MusicEngine();
