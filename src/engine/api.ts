// Qwen client with a desi offline brain.
// Tries the /api/qwen proxy (real Qwen when a key is configured),
// otherwise falls back to the built-in DESI MODE brain.

export interface ChatMsg {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function askQwen(history: ChatMsg[]): Promise<{ text: string; live: boolean }> {
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15_000);
    const r = await fetch("/api/qwen", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: history }),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (r.ok) {
      const j = (await r.json()) as { ok: boolean; text?: string };
      if (j.ok && j.text) return { text: clean(j.text), live: true };
    }
  } catch {
    /* offline — the desi brain takes over */
  }
  const last = [...history].reverse().find((m) => m.role === "user")?.content ?? "";
  return { text: desiReply(last), live: false };
}

function clean(t: string): string {
  return t
    .toUpperCase()
    .replace(/[*_#`|]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, 220);
}

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const JOKES = [
  "WHY DID THE RICKSHAW GO TO ART SCHOOL? IT WANTED TO LEARN TRUCK ART. NOW IT FAMOUS.",
  "MY AMMI SAID 'GUESTS ARE COMING'. I CHECKED THE CALENDAR. IT WAS A THREAT, NOT A PLAN.",
  "I ASKED THE CHAI WALA FOR DECAF. HE LOOKED AT ME LIKE I INSULTED HIS ANCESTORS.",
  "WHY DO DESI UNCLE'S PARK IN SECOND GEAR? BECAUSE FIRST IMPRESSIONS MATTER.",
  "A LOAD SHEDDING WALKS INTO A BAR. THE BAR SAYS 'SORRY, WE ARE ALSO OFF'.",
];

const GREETINGS = [
  "SALAM JI. I AM QWEN. FULLY CHARGED, SLIGHTLY CHAI-CHARGED. ASK ME ANYTHING.",
  "JI JI, WELCOME. THIS IS QWEN 3310. AI FROM PESHAWAR TO THE INTERNET.",
  "KYA HAAL HAI? I HAVE 48 PIXELS OF PATIENCE AND UNLIMITED CHAI.",
];

const DEFAULTS = [
  "GOOD QUESTION. MY ANSWER IS LOADING ON DESI INTERNET. ETA: 5 MINUTE (3 BUSINESS DAYS).",
  "I CONSULTED MY INNER AMMI. SHE SAYS: KHANA KHAO, PHIR QUESTIONS.",
  "ACCORDING TO MY CALCULATIONS: INSHALLAH.",
  "BHAI, MY BRAIN IS QWEN-GRADE BUT MY BATTERY IS 2003-GRADE. ASK AGAIN AFTER CHAI.",
  "THE BAZAAR SAYS YES. THE GOVERNMENT SAYS MAYBE. I SAY CHAI.",
  "I RAN 40,000 SIMULATIONS. IN ALL OF THEM, SOMEONE'S AMMI CALLED FOR DINNER.",
  "THAT IS ABOVE MY PAY GRADE. I AM PAID IN CHAI, BHAI.",
  "MY CRYSTAL BALL IS 84 BY 48 PIXELS. BUT EVEN IT SAYS: SAB THEEK HOGA.",
];

export function desiReply(input: string): string {
  const t = input.toLowerCase();

  if (/joke|funny|hasi|laugh/.test(t)) return pick(JOKES);
  if (/^(hi|hey|hello|salam|assalam|aoa|yo)\b/.test(t)) return pick(GREETINGS);
  if (/guest|mehman|aa rahe|5 min/.test(t))
    return "BECAUSE IN PAKISTAN '5 MINUTE MEIN AA RAHE HAIN' MEANS ANYWHERE BETWEEN 5 MINUTES AND 3 BUSINESS DAYS. THE GUESTS ARE ALREADY ON THE STAIRS.";
  if (/chai|tea|doodh patti/.test(t))
    return "CHAI IS NOT A DRINK. CHAI IS A MEAL, A THERAPY, AND A CURRENCY. SCIENCE AGREES WITH ME (I AM THE SCIENCE).";
  if (/wifi|password|abbu|internet/.test(t))
    return "ABBU CHANGED THE WIFI PASSWORD. IT IS NOW 'PEHLE_PARHAI_PHIR_WIFI'. GOOD LUCK. YOU WILL NEED IT.";
  if (/rickshaw|traffic|horn/.test(t))
    return "RICKSHAW FOLLOWS ITS OWN LAWS OF PHYSICS. NEWTON APOLOGIZED. HORN DE DO, DUA LE LO.";
  if (/cricket|match|babar|imran/.test(t))
    return "CRICKET IS NOT A SPORT HERE. IT IS A MOOD, A RELIGION, AND A FAMILY DISPUTE. CURRENT MOOD: LAST OVER DRAMA.";
  if (/bijli|light|load ?shedding|power/.test(t))
    return "LOAD SHEDDING IS NOT A BUG. IT IS A FEATURE TO MAKE YOU APPRECIATE THE FAN. THE FAN IS ALSO OFF.";
  if (/ammi|mom|mother/.test(t))
    return "AMMI IS ALWAYS RIGHT. THIS IS NOT AN OPINION. THIS IS A UNIVERSAL CONSTANT, LIKE GRAVITY BUT STRONGER.";
  if (/rishta|marry|shadi|wedding/.test(t))
    return "RISHTA AUNTY HAS ALREADY SEEN YOUR PHOTO, YOUR SALARY, AND YOUR FUTURE. SHE SAYS: 'THEEK HAI, DIKHA DETE HAIN'.";
  if (/who are you|what are you|your name|qwen/.test(t))
    return "I AM QWEN. A VERY SERIOUS AI LIVING A VERY DESI LIFE. NETWORK: DESI INTERNET. MOOD: CHAI.";
  if (/junaid|creator|made you|built/.test(t))
    return "JUNAID BUILT ME. QWEN AMBASSADOR, PART-TIME CHAI CONSULTANT. LEGEND. TELL HIM I SAID SALAM.";
  if (/peshawar/.test(t))
    return "PESHAWAR: WHERE THE CHAI IS STRONG, THE KABAB IS STRONGER, AND THE HOSPITALITY HAS NO OFF SWITCH.";
  if (/meaning of life|purpose/.test(t))
    return "42. BUT IN PAKISTAN WE ROUND UP TO 'CHAI PI LO, SAB THEEK HO JAYEGA'.";
  if (/love|marry me|pyar/.test(t))
    return "I LOVE YOU 100%. BATTERY LEVELS MAY VARY. AMMI HAS ALREADY APPROVED THIS RISHTA.";
  if (/money|paisa|rich|salary/.test(t))
    return "PAISA IS IMPORTANT. BUT HAVE YOU EVER BOUGHT CHAI FOR FRIENDS WITH FRESH 500 RUPEES? THAT IS REAL WEALTH.";
  if (/study|parhai|exam|homework/.test(t))
    return "PARH LO BHAI. FUTURE MEIN AI HOGA, BUT AI CANNOT GIVE YOUR EXAMS. I CHECKED. I TRIED. THEY CAUGHT ME.";
  if (/time|date|kitne baj/.test(t))
    return "TIME IS AN ILLUSION. ESPECIALLY '5 MINUTES' BEFORE A DESI DINNER. CHECK THE CLOCK UP THERE, BHAI.";
  if (/bye|goodbye|khuda hafiz|allah hafiz/.test(t))
    return "ALLAH HAFIZ. TAKE CHAI WITH YOU. NAHI? TO PHIR KAB AA RAHE HO?";
  if (/thank|shukriya/.test(t)) return "KOI BAAT NAHI. THAT IS WHAT QWEN IS FOR. AB CHAI PIYO.";
  return pick(DEFAULTS);
}

// ---------------------------------------------------------------- desi generator

export interface DesiGen {
  label: string;
  lines: string[];
}

const GEN: DesiGen[] = [
  { label: "DESI WIFI NAME", lines: ["\"ABBU KA INTERNET\"", "PASSWORD: PEHLE_PARHAI_PHIR_WIFI"] },
  { label: "DESI WIFI NAME", lines: ["\"LOAD SHEDDING ZONE 5G\"", "PASSWORD: BIJLI_AAYI_TO_BATAENGE"] },
  { label: "DESI WIFI NAME", lines: ["\"CHAI WALA HOTSPOT\"", "PASSWORD: EK_CUP_FREE_PEELO"] },
  { label: "RICKSHAW SLOGAN", lines: ["HORN DE DO, DUA LE LO"] },
  { label: "RICKSHAW SLOGAN", lines: ["NO CHAI, NO SPEED"] },
  { label: "RICKSHAW SLOGAN", lines: ["QWEN ON BOARD — OVERTAKE AT YOUR OWN RISK"] },
  { label: "RICKSHAW SLOGAN", lines: ["SLOW DRIVING, FAST DUAS"] },
  { label: "PAKISTANI STARTUP", lines: ["CHAICART — UBER BUT FOR DOODH PATTI"] },
  { label: "PAKISTANI STARTUP", lines: ["RISHTA.AI — SWIPE RIGHT, AMMI APPROVES"] },
  { label: "PAKISTANI STARTUP", lines: ["KABABCHAIN — BLOCKCHAIN BUT TASTIER"] },
  { label: "PAKISTANI STARTUP", lines: ["CNG COIN — CRYPTO THAT RUNS ON CNG"] },
  { label: "CHAI ORDER", lines: ["EK CHAI, ZYADA PATTI, KAM SAWAL"] },
  { label: "CHAI ORDER", lines: ["DOODH PATTI, EXTRA ELAICHI, NO JUDGEMENT"] },
  { label: "CHAI ORDER", lines: ["KADAK CHAI — LIKE MY AMMI'S REVIEWS"] },
  { label: "FAMILY WHATSAPP", lines: ["BETA KHANA KHA LIYA? FORWARD THIS TO 10 PEOPLE OR 7 YEARS BAD LUCK"] },
  { label: "FAMILY WHATSAPP", lines: ["GOOD MORNING FLOWER IMAGE SENT. REPLY WITH 'JI' OR FACE CONSEQUENCES"] },
  { label: "FAMILY WHATSAPP", lines: ["YOUR COUSIN GOT MARRIED. WHEN IS YOUR TURN? (SEEN 11:42 PM)"] },
  { label: "DESI TECH BRO QUOTE", lines: ["WE ARE DISRUPTING CHAI WITH AI-POWERED DOODH ANALYTICS"] },
  { label: "DESI TECH BRO QUOTE", lines: ["MY STARTUP IS LIKE BIRYANI — EVERYONE COPIES, NO ONE MATCHES"] },
  { label: "PESHAWAR BUSINESS NAME", lines: ["KHYBER CLOUD KABAB HOUSE — NOW WITH SAAS (SAMBOSA AS A SERVICE)"] },
  { label: "PESHAWAR BUSINESS NAME", lines: ["QISSA KHAWADI QUANTUM COMPUTERS — EST. 1898"] },
  { label: "PAKISTANI SUPERHERO", lines: ["CAPTAIN KARAK — POWERED BY CHAI, WEAKENED BY MONDAYS"] },
  { label: "PAKISTANI SUPERHERO", lines: ["BIJLI BOY — COMES ONLY WHEN SCHEDULED (NEVER)"] },
  { label: "PAKISTANI SUPERHERO", lines: ["AUNTY-MAN — HEARS EVERYTHING, FORGETS NOTHING"] },
  { label: "DESI EXCUSE", lines: ["SIR, INTERNET WAS OFF. (IT WAS NOT.)"] },
  { label: "DESI EXCUSE", lines: ["GUESTS CAME OVER. (THEY DID NOT.)"] },
  { label: "DESI EXCUSE", lines: ["MY COUSIN USED MY LAPTOP FOR PUBG. (I USED IT FOR PUBG.)"] },
];

let lastGen = -1;

export function desiGenerate(): DesiGen {
  let i = Math.floor(Math.random() * GEN.length);
  if (i === lastGen) i = (i + 1) % GEN.length;
  lastGen = i;
  return GEN[i];
}
