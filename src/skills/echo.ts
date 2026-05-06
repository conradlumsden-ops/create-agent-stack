import type { Skill } from "../agent.js";

export const echo: Skill = {
  name: "echo",
  description: "Echoes back what the user said. Sample skill that demonstrates the contract.",
  match: (text) => /^echo:/i.test(text.trim()),
  run: async (text) => `Echo: ${text.replace(/^echo:\s*/i, "")}`
};
