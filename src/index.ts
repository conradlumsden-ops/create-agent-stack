import "dotenv/config";
import * as Sentry from "@sentry/node";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { Agent } from "./agent.js";
import { skills } from "./skills/index.js";

if (process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.1 });
}

const app = new Hono();
const agent = new Agent({ skills });

app.use("*", async (c, next) => {
  const auth = c.req.header("authorization");
  const token = auth?.replace(/^Bearer\s+/i, "");
  if (process.env.NODE_ENV === "production" && token !== process.env.AGENT_AUTH_TOKEN) {
    return c.json({ error: "unauthorized" }, 401);
  }
  await next();
});

app.get("/", (c) => c.json({ ok: true, agent: "ready" }));
app.get("/healthz", (c) => c.json({ status: "healthy" }));

app.post("/chat", async (c) => {
  const body = await c.req.json<{ messages: { role: "user" | "assistant"; content: string }[] }>();
  try {
    const reply = await agent.run(body.messages);
    return c.json({ reply });
  } catch (e) {
    Sentry.captureException(e);
    const msg = e instanceof Error ? e.message : "unknown error";
    return c.json({ error: msg }, 500);
  }
});

const port = Number(process.env.PORT ?? 3001);
serve({ fetch: app.fetch, port });
console.log(`agent ready on :${port}`);
