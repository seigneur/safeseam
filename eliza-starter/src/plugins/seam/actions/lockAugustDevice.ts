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
import { lockAugustDeviceExamples } from "../examples.ts";
import { createSeamService } from "../services.ts";

export const lockAugustDevice: Action = {
  name: "SEAM_LOCK_AUGUST_DEVICE",
  similes: [
      "LOCK AUGUST DEVICE",
      "AUGUST LOCK",
  ],
  description: "Locks an August device",
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
          console.log(deviceName)
          const actionAttempt = await seamService.lockAugustDevice(deviceName);
          elizaLogger.success(
              `Successfully locked August device`
          );
          if (callback) {
              console.log(actionAttempt)
              callback({
                  text:`Your August device (${deviceName}) has been locked`
              });
              return true;
          }
      } catch (error:any) {
          elizaLogger.error("Error in Seam plugin handler:", error);
          callback({
              text: `Error locking August devices: ${error.message}`,
              content: { error: error.message },
          });
          return false;
      }
  },
  examples: lockAugustDeviceExamples as ActionExample[][],
} as Action;