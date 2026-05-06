import { skills } from "./skills/index.js";
console.log(`${skills.length} skills:`);
for (const s of skills) console.log(`  - ${s.name}: ${s.description}`);
