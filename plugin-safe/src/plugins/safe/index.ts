import { Plugin } from "@ai16z/eliza";
import { safeAction } from "./action.ts";
import { calculateEvaluator } from "./evaluator.ts";
import { initializeSafe } from "./services.ts";

export const safePlugin: Plugin = {
  name: "safe",
  description: "Basic ops for safe plugin",
  actions: [safeAction],
  evaluators: [],
  providers: [],
};

export const initializeSafePlugin = (
  config: any
): void => {
  initializeSafe(config);
}