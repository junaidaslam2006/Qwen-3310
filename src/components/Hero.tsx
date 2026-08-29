import { PixelText } from "./PixelText";
import { PixelIcon } from "./PixelIcon";
import { C } from "../engine/colors";
import { toast } from "./Toasts";
import { sound } from "../engine/sound";
import {
  SPRITE_CHAI,
  SPRICK_RICKSHAW,
  SPRITE_SAMOSA,
  SPRITE_FLOWER,
  SPRITE_STAR,
} from "../engine/sprites";

const ARROW_DOWN = ["00100", "00100", "11111", "01110", "00100"];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="chips">
          <span className="chip">NETWORK: DESI INTERNET</span>
          <span className="chip chip-red">BATTERY: 99%</span>
          <span className="chip chip-teal">MOOD: CHAI</span>
          <span className="chip chip-mustard">BRAIN: QWEN</span>
        </div>

        <PixelText text="QWEN 3310" scale={9} color={C.ink} className="hero-pixel" />

        <h1 className="painted">
          AI BUT
          <br />
          MAKE IT
          <br />
          DESI
        </h1>

        <p className="urdu-big" lang="ur">
          کیا حال ہے؟
        </p>

        <p className="hero-copy">
          An AI raised on doodh patti, truck art and 2003 ringtones. No phone. No app. Just vibes,
          pixels and a very serious brain living in a very unserious website.
        </p>

        <div className="scroll-hint">
          <PixelIcon rows={ARROW_DOWN} scale={3} color={C.red} />
          <PixelText text="SCROLL, BHAI" scale={2} color={C.ink} />
        </div>
      </div>

      <div className="collage" aria-hidden="false">
        <div className="ajrak-card" />

        <button
          className="sticker r-neg float-a"
          onClick={() => {
            sound.received();
            toast(["SYSTEM MESSAGE", "CHAI.EXE IS RUNNING"], "چائے جاری ہے");
          }}
        >
          <PixelIcon rows={SPRITE_CHAI} scale={5} color={C.red} />
          <span className="cap">CHAI.EXE</span>
        </button>

        <div className="sticker r-pos float-b">
          <PixelIcon rows={SPRICK_RICKSHAW} scale={4} color={C.blue} />
          <span className="cap">NO HORN NO BREAK</span>
        </div>

        <button
          className="sticker sticker-urdu r-neg2 float-c"
          lang="ur"
          onClick={() => {
            sound.error();
            toast(["BAS KARO BHAI"], "بس کرو بھائی");
          }}
        >
          بس کرو بھائی
        </button>

        <button
          className="sticker r-pos2 float-d"
          onClick={() => {
            sound.eat();
            toast(["SAMOSA DETECTED", "ZERO CALORIES (DESI MATH)"]);
          }}
        >
          <PixelIcon rows={SPRITE_SAMOSA} scale={4} color={C.mustardDeep} />
          <span className="cap">SAMOSA.SYS</span>
        </button>

        <PixelIcon rows={SPRITE_FLOWER} scale={4} color={C.teal} className="collage-deco cd-1" />
        <PixelIcon rows={SPRITE_STAR} scale={3} color={C.red} className="collage-deco cd-2" />
        <PixelIcon rows={SPRITE_STAR} scale={2} color={C.mustardDeep} className="collage-deco cd-3" />
      </div>
    </section>
  );
}
