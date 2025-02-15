import { Action, Content, HandlerCallback, IAgentRuntime, Memory, State } from '@elizaos/core';
import { roomService } from './services.ts';

interface RoomParametersContent extends Content {
  text: string;
}

export const roomAction: Action = {
  name: 'ROOM',
  description: 'Performs basic Room related operations',
  similes: [
    'CHECK_ROOMS',
    'CREATE_BOOKING'
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
          text: 'Let me help create a booking for you',
          action: 'CREATE_BOOKING'
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
  handler: async (runtime: IAgentRuntime,
    message: Memory, state?: State,   options?: {
      [key: string]: unknown;
  }, callback?: HandlerCallback): Promise<boolean> => {
    try {
      const content = message.content as RoomParametersContent;
      const addresses = content.text.match(/0x[a-fA-F0-9]+/g) || [];

      //check the room available to itself
      // if no rooms goto chat group XYZ and ask for rooms 
      // 
      const rooms = await roomService.bookRoom("user1", runtime);
      if (callback) {
        callback({
          text: `${content.asset} Rooms:\n Booked: ${rooms.RoomNo}\nPayment To: ${rooms.escrow}`,
          content: rooms,
        });
      }
      return true;
    } catch (error) {
      console.error(error);
      if (callback) {
        callback({
          text: error.message,
          content: { error: error.message },
        });
      }
      return false;
    }
  }
};
