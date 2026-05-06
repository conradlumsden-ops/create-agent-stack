# User profile

Filled in at runtime per request from auth claims. Edit defaults here for local dev.

## Default user (dev)

- **Name:** Builder
- **Locale:** en
- **Timezone:** Asia/Hong_Kong
- **Preferences:**
  - Reply length: short
  - Code style: TypeScript, no comments unless WHY-comment

## How user context reaches the agent

`src/index.ts` extracts the user object from the auth bearer token (or falls back to default in dev) and passes it into the agent. The agent's system prompt receives:

```
SOUL.md + Agents.md + User profile + last N messages
```
