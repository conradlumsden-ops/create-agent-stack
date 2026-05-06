import type { Skill } from "../agent.js";
import { echo } from "./echo.js";
import { research } from "./research.js";

export const skills: Skill[] = [echo, research];
