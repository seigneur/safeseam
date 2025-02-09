import { Plugin } from "@elizaos/core";
import { safeAction } from "./action.ts";

export const safePlugin: Plugin = {
  name: "safe",
  description: "Basic ops for safe plugin",
  actions: [safeAction],
  evaluators: [],
  providers: [],
};