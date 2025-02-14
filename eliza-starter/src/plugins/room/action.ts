import { Action, Content, IAgentRuntime, Memory, State } from '@elizaos/core';
import { safeService } from './services.ts';
import { SafeCreateResponse } from './types.ts';

interface RoomParametersContent extends Content {
  text: string;
}

export const safeAction: Action = {
  name: 'SAFE',
  description: 'Performs basic Room related operations',
  similes: [
    'CHECK ROOMS',
    'CREATE BOOKING'
    ],
  examples: [
    [
      {
        user: '{{user1}}',
        content: { text: 'Create a booking for me for Wednesday' } as RoomParametersContent
      },
      {
        user: '{{agentName}}',
        content: {
          text: 'The safe has been created with 0xaddress1 and 0xaddress2',
          action: 'CREATE_SAFE'
        }
      }
    ],
  ],
  validate: async (runtime: IAgentRuntime, message: Memory, state?: State): Promise<boolean> => {
    try {
      const content = message.content as RoomParametersContent;
      if (typeof content.text !== 'string') {
        return false;
      }
      const parts = content.text.split(/\s+/);
      return true;
    } catch {
      return false;
    }
  },
  handler: async (runtime: IAgentRuntime, message: Memory, state?: State): Promise<SafeCreateResponse> => {
    try {
      const content = message.content as RoomParametersContent;
      const addresses = content.text.match(/0x[a-fA-F0-9]+/g) || [];
      
      //check the room available to itself
      // if no rooms goto chat group XYZ and ask for rooms 
      // 
      return {
        success: true,
        response: `${content.text} = ${result}`
      };
    } catch (error) {
      return {
        success: false,
        response: error instanceof Error ? error.message : 'Safe Creation failed'
      };
    }
  }
};
