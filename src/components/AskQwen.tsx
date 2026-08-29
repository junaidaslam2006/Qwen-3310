import { useEffect, useRef, useState } from "react";
import { PixelText } from "./PixelText";
import { C } from "../engine/colors";
import { askQwen } from "../engine/api";
import { sound } from "../engine/sound";

const SUGGESTIONS = [
  "why do guests take 3 business days?",
  "is chai a food group?",
  "abbu ka wifi password?",
  "rickshaw physics explained",
];

export function AskQwen() {
  const [input, setInput] = useState("");
  const [phase, setPhase] = useState<"idle" | "waiting" | "typing" | "done">("idle");
  const [reply, setReply] = useState("");
  const [shown, setShown] = useState("");
  const timer = useRef<number>(0);

  useEffect(() => () => window.clearInterval(timer.current), []);

  // pixel typewriter
  useEffect(() => {
    if (phase !== "typing") return;
    let i = 0;
    timer.current = window.setInterval(() => {
      i += 1;
      setShown(reply.slice(0, i));
      if (i % 3 === 0) sound.keyPress();
      if (i >= reply.length) {
        window.clearInterval(timer.current);
        setPhase("done");
      }
    }, 24);
    return () => window.clearInterval(timer.current);
  }, [phase, reply]);

  const ask = async (q: string) => {
    const question = q.trim();
    if (!question || phase === "waiting" || phase === "typing") return;
    sound.sent();
    setPhase("waiting");
    setShown("");
    const { text } = await askQwen([{ role: "user", content: question }]);
    setReply(text);
    sound.received();
    setPhase("typing");
  };

  return (
    <section className="panel ask-panel" id="ask">
      <div className="panel-head">
        <PixelText text="ASK QWEN SOMETHING DESI" scale={2} color={C.cream} />
        <span className="panel-urdu" lang="ur">
          پوچھو جی
        </span>
      </div>

      <div className="panel-body">
        <form
          className="ask-row"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(input);
          }}
        >
          <input
            className="ask-input"
            value={input}
            maxLength={90}
            placeholder="type your question, bhai..."
            aria-label="ask qwen something desi"
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="btn" type="submit">
            ASK QWEN
          </button>
        </form>

        <div className="sugg-row">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="sugg"
              onClick={() => {
                setInput(s);
                void ask(s);
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="reply-box" aria-live="polite">
          {phase === "idle" && <p className="reply-hint">QWEN IS LISTENING. CHAI IN HAND.</p>}
          {phase === "waiting" && (
            <p className="reply-hint typing-dots">
              QWEN IS TYPING<span className="dots" />
            </p>
          )}
          {(phase === "typing" || phase === "done") && (
            <>
              <PixelText text="QWEN:" scale={2} color={C.red} />
              <p className={`reply-text${phase === "typing" ? " caret" : ""}`}>{shown}</p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
