import { PixelText } from "./PixelText";
import { PixelIcon } from "./PixelIcon";
import { C } from "../engine/colors";
import { toast } from "./Toasts";
import { sound } from "../engine/sound";
import {
  SPRITE_BATTERY,
  SPRITE_FLOWER,
  SPRITE_SNAKE,
  SPRITE_CRESCENT,
  SPRITE_CRICKET,
} from "../engine/sprites";

const EGGS: { rows: string[]; color: string; lines: string[]; urdu?: string; s: () => void }[] = [
  {
    rows: SPRITE_BATTERY,
    color: C.ink,
    lines: ["BATTERY: 99%", "BHAI CHARGER LAGA LO"],
    s: () => sound.smsAlert(),
  },
  {
    rows: SPRITE_FLOWER,
    color: C.teal,
    lines: ["SYSTEM MESSAGE", "CHAI.EXE IS RUNNING"],
    urdu: "چائے جاری ہے",
    s: () => sound.received(),
  },
  {
    rows: SPRITE_SNAKE,
    color: C.inkSoft,
    lines: ["SNAKE II HIGH SCORE:", "AMMI (9999)"],
    s: () => sound.eat(),
  },
  {
    rows: SPRITE_CRESCENT,
    color: C.mustardDeep,
    lines: ["EID MODE: LOADING", "SEVAIYAN REQUIRED"],
    s: () => sound.ok(),
  },
  {
    rows: SPRITE_CRICKET,
    color: C.red,
    lines: ["LAST OVER DRAMA:", "ACTIVATED"],
    s: () => sound.die(),
  },
];

export function SystemCheck() {
  return (
    <section className="system-check">
      <PixelText text="SYSTEM CHECK" scale={3} color={C.ink} />
      <p className="check-hint">( CLICK EVERYTHING, BHAI )</p>
      <div className="eggs">
        {EGGS.map((e, i) => (
          <button
            key={i}
            className="egg-btn"
            aria-label="easter egg"
            onClick={() => {
              e.s();
              toast(e.lines, e.urdu);
            }}
          >
            <PixelIcon rows={e.rows} scale={5} color={e.color} />
          </button>
        ))}
      </div>
    </section>
  );
}
