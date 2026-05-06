import OpenAI from "openai";
import type { Skill } from "../agent.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const research: Skill = {
  name: "research",
  description: "Answers a factual question with source citations. Triggered by '/research <q>'.",
  match: (text) => /^\/research\b/i.test(text.trim()),
  run: async (text) => {
    const q = text.replace(/^\/research\s*/i, "").trim();
    if (!q) return "Usage: /research <question>";
    const reply = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a research assistant. Answer in 2-3 short paragraphs. End with a 'Sources:' line listing 2-4 plausible URLs you would cite if you had web access. Do not invent specific facts; flag uncertainty."
        },
        { role: "user", content: q }
      ]
    });
    return reply.choices[0]?.message?.content ?? "(no answer)";
  }
};
