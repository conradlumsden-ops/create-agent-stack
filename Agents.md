# Agents

Define the agent and its sub-agents here. Loaded at runtime by `src/agent.ts`.

## Primary agent

- **Name:** main
- **Model:** gpt-4o-mini
- **Skills:** echo, research
- **Memory:** in-process (swap to Redis or Postgres in production)

## Sub-agents

Add specialized agents below. Each gets its own SOUL section if its voice differs from the main agent.

### research

- **Purpose:** answers factual questions with citations. No speculation.
- **Tools:** web search (TODO: wire up via Tavily or Brave Search API)
- **Returns:** answer + list of sources
