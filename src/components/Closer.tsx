import { Marquee } from "./Marquee";

export function Closer() {
  return (
    <footer className="closer">
      <p className="urdu-big closer-urdu" lang="ur">
        نوکیا پاکستان گیا
      </p>
      <h2 className="painted painted-small">
        NOKIA WENT
        <br />
        TO PAKISTAN
      </h2>

      <Marquee reverse className="marquee-teal">
        <span>QWEN 3310</span>
        <span>★</span>
        <span lang="ur">چائے پہلے</span>
        <span>★</span>
        <span>5 MIN MEIN AA RAHE HAIN</span>
        <span>★</span>
        <span>NO HORN NO BREAK</span>
        <span>★</span>
        <span>BHAI CHARGER LAGA LO</span>
        <span>★</span>
      </Marquee>

      <p className="credits">
        MADE WITH QWEN + CHAI + 84×48 PIXELS · NO PHONES WERE HARMED ·{" "}
        <span lang="ur">شکریہ</span>
      </p>
    </footer>
  );
}
