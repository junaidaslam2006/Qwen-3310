import { useState } from "react";
import { PixelText } from "./PixelText";
import { PixelIcon } from "./PixelIcon";
import { C } from "../engine/colors";
import { desiGenerate, type DesiGen } from "../engine/api";
import { sound } from "../engine/sound";
import { SPRITE_STAR, SPRITE_FLOWER } from "../engine/sprites";

export function Generator() {
  const [result, setResult] = useState<DesiGen | null>(null);
  const [stamp, setStamp] = useState(0);

  const generate = () => {
    sound.eat();
    setResult(desiGenerate());
    setStamp((s) => s + 1);
  };

  return (
    <section className="panel gen-panel">
      <div className="panel-head panel-head-red">
        <PixelText text="DESI MODE GENERATOR" scale={2} color={C.cream} />
        <span className="panel-urdu" lang="ur">
          نیا نام
        </span>
      </div>

      <div className="panel-body gen-body">
        <button className="btn btn-red btn-big" onClick={generate}>
          GENERATE, BHAI
        </button>

        <div className="gen-slot">
          {result ? (
            <div className="gen-card" key={stamp}>
              <span className="gen-label">{result.label}</span>
              {result.lines.map((l) => (
                <p className="gen-line" key={l}>
                  {l}
                </p>
              ))}
            </div>
          ) : (
            <p className="reply-hint">PRESS THE BUTTON. RECEIVE DESTINY.</p>
          )}
        </div>

        <PixelIcon rows={SPRITE_STAR} scale={4} color={C.mustardDeep} className="gen-deco gd-1" />
        <PixelIcon rows={SPRITE_FLOWER} scale={4} color={C.teal} className="gen-deco gd-2" />
      </div>
    </section>
  );
}
