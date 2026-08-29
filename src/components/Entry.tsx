import { PixelText } from "./PixelText";
import { PixelIcon } from "./PixelIcon";
import { LcdClock } from "./LcdClock";
import { C } from "../engine/colors";
import { SPRITE_BATTERY, SPRITE_SIGNAL, SPRITE_FLOWER, SPRITE_STAR } from "../engine/sprites";

export function Entry({ onEnter }: { onEnter: () => void }) {
  return (
    <div
      className="entry"
      role="button"
      tabIndex={0}
      aria-label="enter the website"
      onClick={onEnter}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onEnter();
      }}
    >
      <div className="entry-status">
        <span className="entry-status-group">
          <PixelIcon rows={SPRITE_SIGNAL} scale={2} color={C.ink} />
          <PixelText text="QWEN NET" scale={2} color={C.ink} />
        </span>
        <PixelIcon rows={SPRITE_BATTERY} scale={2} color={C.ink} />
      </div>

      <PixelIcon rows={SPRITE_STAR} scale={3} color={C.inkSoft} className="entry-deco deco-tl" />
      <PixelIcon rows={SPRITE_FLOWER} scale={3} color={C.inkSoft} className="entry-deco deco-br" />

      <div className="entry-center">
        <LcdClock scale={7} color={C.ink} withAmPm className="entry-clock" />
        <PixelText text="QWEN 3310" scale={4} color={C.ink} />
        <p className="entry-tag">
          made somewhere
          <br />
          between Peshawar
          <br />
          and the internet
        </p>
        <p className="entry-urdu" lang="ur">
          خوش آمدید جی
        </p>
        <div className="enter-blink">
          <PixelText text="[ TAP TO ENTER ]" scale={2} color={C.ink} />
        </div>
      </div>

      <div className="entry-foot">
        <PixelText text="EST. 2001 - REBOOTED 2026" scale={2} color={C.inkSoft} />
      </div>
    </div>
  );
}
