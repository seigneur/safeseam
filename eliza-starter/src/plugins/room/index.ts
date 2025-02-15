import { Plugin } from "@elizaos/core";
import { roomAction } from "./action.ts";

export const roomPlugin: Plugin = {
  name: "room",
  description: "Basic ops for room booking",
  actions: [roomAction],
  evaluators: [],
  providers: [],
};