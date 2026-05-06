import OpenAI from "openai";
import { readFileSync } from "node:fs";
import { join } from "node:path";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export interface Skill {
  name: string;
  description: string;
  match: (text: string) => boolean;
  run: (text: string) => Promise<string>;
}

const ROOT = process.cwd();

function loadDoc(name: string): string {
  try {
    return readFileSync(join(ROOT, name), "utf8");
  } catch {
    return "";
  }
}

const SOUL = loadDoc("SOUL.md");
const AGENTS = loadDoc("Agents.md");
const USER = loadDoc("User.md");

const SYSTEM = `You are an AI agent built on the create-agent-stack scaffold.

# SOUL (your voice and values)
${SOUL}

# AGENTS (your structure)
${AGENTS}

# USER PROFILE
${USER}

Stay in character. Cite sources when you make factual claims.`;

export class Agent {
  private client: OpenAI;
  constructor(private opts: { skills: Skill[]; model?: string }) {
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  async run(messages: Msg[]): Promise<string> {
    const last = messages[messages.length - 1];
    if (last?.role === "user") {
      const skill = this.opts.skills.find((s) => s.match(last.content));
      if (skill) {
        return skill.run(last.content);
      }
    }
    const response = await this.client.chat.completions.create({
      model: this.opts.model ?? "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM }, ...messages]
    });
    return response.choices[0]?.message?.content ?? "(no reply)";
  }
}
