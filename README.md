# create-agent-stack

Production-ready agent scaffold. One command from clone to running agent: skills folder, SOUL/Agents/User docs, Sentry error tracking, bearer-token auth, and a Dockerfile that ships.

## What you get

```
create-agent-stack/
├── SOUL.md         ← agent voice and values
├── Agents.md       ← agent + sub-agent definitions
├── User.md         ← user profile schema
├── src/
│   ├── index.ts    ← Hono server, /chat endpoint
│   ├── agent.ts    ← agent runtime (loads SOUL/Agents/User into system prompt)
│   └── skills/
│       ├── echo.ts        ← sample skill (regex match)
│       └── research.ts    ← sample skill (calls OpenAI)
├── Dockerfile      ← multi-stage prod build
└── .env.example
```

## Run locally

```bash
cp .env.example .env       # add your OPENAI_API_KEY
npm install
npm run dev
```

Test:
```bash
curl http://localhost:3001/chat \
  -H 'content-type: application/json' \
  -d '{"messages":[{"role":"user","content":"echo: hello"}]}'
```

## Deploy

**Railway:** push the repo, set `OPENAI_API_KEY`, `AGENT_AUTH_TOKEN`, `SENTRY_DSN`. Railway auto-detects the Dockerfile.

**Anywhere else:** the Dockerfile is portable. `docker build -t my-agent . && docker run -p 3001:3001 --env-file .env my-agent`.

## Add a skill

Create `src/skills/my-skill.ts`:

```ts
import type { Skill } from "../agent.js";

export const mySkill: Skill = {
  name: "my-skill",
  description: "What this skill does.",
  match: (text) => text.startsWith("/myskill"),
  run: async (text) => "result"
};
```

Register it in `src/skills/index.ts`:

```ts
export const skills: Skill[] = [echo, research, mySkill];
```

## Auth

Set `AGENT_AUTH_TOKEN` in production. The middleware in `src/index.ts` requires `Authorization: Bearer <token>` on all routes when `NODE_ENV=production`. In dev (no `NODE_ENV` set), auth is skipped.

For real user auth (Clerk / Auth.js / Lucia), wire the JWT verification into the `app.use("*"...)` middleware and populate the user object that `agent.run()` receives.

## What this is not

- It's not a UI. Bring your own frontend (Next.js, Telegram bot, CLI, whatever).
- It's not a full multi-agent orchestrator. The skill router is a regex match. Swap in a real planner (LangGraph, OpenClaw, ruflo) when you outgrow it.
