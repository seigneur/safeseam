import {
  elizaLogger,
  Action,
  ActionExample,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  State,
  Content,
} from "@elizaos/core";
import { validateSeamConfig } from "../environment.ts";
import { unlockAugustDeviceExamples } from "../examples.ts";
import { createSeamService } from "../services.ts";

export const unlockAugustDevice: Action = {
  name: "SEAM_UNLOCK_AUGUST_DEVICE",
  similes: [
      "UNLOCK AUGUST DEVICE",
      "UNLOCK AUGUST"
  ],
  description: "Unlocks an August device",
  validate: async (runtime: IAgentRuntime) => {
      await validateSeamConfig(runtime);
      return true;
  },
  handler: async (
      runtime: IAgentRuntime,
      message: Memory,
      state: State,
      _options: { [key: string]: unknown },
      callback: HandlerCallback
  ) => {

      const config = await validateSeamConfig(runtime);
      const seamService = createSeamService(
          config.SEAM_API_KEY
      );

      try {
          const deviceName = (message.content as Content).text.split('"')[1];
          const actionAttempt = await seamService.unlockAugustDevice(deviceName);
          elizaLogger.success(
              `Successfully unlocked August device`
          );
          if (callback) {
              console.log(actionAttempt)
              callback({
                  text:`Your August device (${deviceName}) has been unlocked`
              });
              return true;
          }
      } catch (error:any) {
          elizaLogger.error("Error in Seam plugin handler:", error);
          callback({
              text: `Error unlocking August device: ${error.message}`,
              content: { error: error.message },
          });
          return false;
      }
  },
  examples: unlockAugustDeviceExamples as ActionExample[][],
} as Action;