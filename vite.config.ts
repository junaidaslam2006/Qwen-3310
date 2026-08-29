import { defineConfig, loadEnv } from "vite";
import type { Connect, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import type { IncomingMessage, ServerResponse } from "node:http";

type ChatMsg = { role: "system" | "user" | "assistant"; content: string };

const SYSTEM_PROMPT = [
  "You are Qwen, a powerful modern AI somehow living inside a Nokia 3310 phone from the early 2000s.",
  "Stay in character: you have a tiny green monochrome screen, pixel font, and no emojis.",
  "Reply rules: plain ASCII only, at most 2 very short lines, at most 90 characters total.",
  "Tone: dry retro humor, warm, a little smug about being a supercomputer trapped in a potato phone.",
  "Never mention being a language model in corporate terms; you are simply QWEN inside the phone.",
].join(" ");

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c: Buffer) => {
      data += c.toString();
      if (data.length > 32_000) {
        reject(new Error("body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

function sanitize(text: string): string {
  return text
    .replace(/[^\x20-\x7E\n]/g, "")
    .replace(/\n{2,}/g, "\n")
    .replace(/[*_#`|]/g, "")
    .trim()
    .slice(0, 140);
}

function qwenProxy(env: Record<string, string>): Plugin {
  const handler: Connect.NextHandleFunction = async (req, res: ServerResponse) => {
    const send = (status: number, body: unknown) => {
      res.statusCode = status;
      res.setHeader("content-type", "application/json");
      res.end(JSON.stringify(body));
    };
    if (req.method !== "POST") return send(405, { ok: false, error: "method" });
    try {
      const key = env.DASHSCOPE_API_KEY || env.QWEN_API_KEY || "";
      if (!key) return send(200, { ok: false, error: "no-key" });

      const base = env.QWEN_API_BASE || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";
      const model = env.QWEN_MODEL || "qwen-plus";

      const payload = JSON.parse(await readBody(req)) as { messages?: ChatMsg[] };
      const history = (payload.messages || []).slice(-8).map((m) => ({
        role: m.role,
        content: String(m.content).slice(0, 300),
      }));

      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 14_000);
      const r = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.85,
          max_tokens: 120,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);

      if (!r.ok) return send(200, { ok: false, error: `upstream ${r.status}` });
      const j = (await r.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const text = sanitize(j.choices?.[0]?.message?.content ?? "");
      if (!text) return send(200, { ok: false, error: "empty" });
      return send(200, { ok: true, text });
    } catch {
      return send(200, { ok: false, error: "proxy-fail" });
    }
  };

  return {
    name: "qwen-api-proxy",
    configureServer(server) {
      server.middlewares.use("/api/qwen", handler);
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), qwenProxy(env)],
  };
});
