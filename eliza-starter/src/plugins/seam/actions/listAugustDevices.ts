import {
  elizaLogger,
  Action,
  ActionExample,
  HandlerCallback,
  IAgentRuntime,
  Memory,
  State,
} from "@elizaos/core";
import { validateSeamConfig } from "../environment.ts";
import { listAugustDevicesExamples } from "../examples.ts";
import { createSeamService } from "../services.ts";

export const listAugustDevices: Action = {
  name: "SEAM_GET_AUGUST_DEVICES",
  similes: [
      "AUGUST",
      "AUGUST DEVICES",
      "AUGUST LOCKS"
  ],
  description: "List all August devices",
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
          const augustDevices = await seamService.listAugustDevices();
          elizaLogger.success(
              `Successfully retrieved August devices`
          );
          if (callback) {
              console.log(augustDevices)
              callback({
                  text:` ${augustDevices.length} August devices found\n${augustDevices.map((device) => device.display_name).join(", ")}`
              });
              return true;
          }
      } catch (error:any) {
          elizaLogger.error("Error in Seam plugin handler:", error);
          callback({
              text: `Error retrieving August devices: ${error.message}`,
              content: { error: error.message },
          });
          return false;
      }
  },
  examples: listAugustDevicesExamples as ActionExample[][],
} as Action;