import { Plugin } from "@elizaos/core";
import { listAugustDevices } from "./actions/listAugustDevices.ts";
import { lockAugustDevice } from "./actions/lockAugustDevice.ts";
import { unlockAugustDevice } from "./actions/unlockAugustDevice.ts";

export const seamPlugin: Plugin = {
  name: "seam",
  description: "Seam plugin",
  actions: [listAugustDevices, lockAugustDevice, unlockAugustDevice],
  evaluators: [],
  providers: [],
};