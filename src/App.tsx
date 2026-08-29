import { useState } from "react";
import { Entry } from "./components/Entry";
import { Hero } from "./components/Hero";
import { AskQwen } from "./components/AskQwen";
import { Generator } from "./components/Generator";
import { SystemCheck } from "./components/SystemCheck";
import { Closer } from "./components/Closer";
import { Marquee } from "./components/Marquee";
import { Toasts } from "./components/Toasts";
import { sound } from "./engine/sound";

export default function App() {
  const [entered, setEntered] = useState(
    () => new URLSearchParams(window.location.search).get("qa") === "main",
  );
  const [wiping, setWiping] = useState(false);

  const enter = () => {
    if (wiping || entered) return;
    sound.unlock();
    sound.bootJingle();
    setWiping(true);
    window.setTimeout(() => {
      setEntered(true);
      setWiping(false);
      window.scrollTo(0, 0);
    }, 560);
  };

  return (
    <>
      <div className="crt" aria-hidden="true" />
      {wiping && <div className="wipe" aria-hidden="true" />}

      {!entered ? (
        <Entry onEnter={enter} />
      ) : (
        <main className="site">
          <Marquee className="marquee-red">
            <span>QWEN 3310</span>
            <span>★</span>
            <span>AI BUT MAKE IT DESI</span>
            <span>★</span>
            <span lang="ur">چائے پہلے</span>
            <span>★</span>
            <span>5 MIN MEIN AA RAHE HAIN</span>
            <span>★</span>
            <span>NO HORN NO BREAK</span>
            <span>★</span>
            <span>BATTERY FULL</span>
            <span>★</span>
          </Marquee>

          <div className="truck-border" aria-hidden="true" />

          <Hero />

          <div className="truck-border flip" aria-hidden="true" />

          <AskQwen />
          <Generator />
          <SystemCheck />
          <Closer />
        </main>
      )}

      <Toasts />
    </>
  );
}
