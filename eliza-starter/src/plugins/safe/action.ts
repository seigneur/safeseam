import { Action, Content, IAgentRuntime, Memory, State } from '@elizaos/core';
import { safeService } from './services.ts';
import { SafeCreateResponse } from './types.ts';

interface SafeParametersContent extends Content {
  text: string;
}

export const safeAction: Action = {
  name: 'SAFE',
  description: 'Performs basic SAFE Multisig Operations',
  similes: [
    'CREATE_SAFE',
    'SEND'
    ],
  examples: [
    [
      {
        user: '{{user1}}',
        content: { text: 'Create a safe with 0xaddress1, 0xaddress2' } as SafeParametersContent
      },
      {
        user: '{{agentName}}',
        content: {
          text: 'The safe has been created with 0xaddress1 and 0xaddress2',
          action: 'CREATE_SAFE'
        }
      }
    ],
    [
      {
        user: '{{user1}}',
        content: { text: 'Send 2 to 0xaddress1' } as SafeParametersContent
      },
      {
        user: '{{agentName}}',
        content: {
          text: '2 has been sent to 0xaddress1',
          action: 'SEND'
        }
      }
    ],
  ],
  validate: async (runtime: IAgentRuntime, message: Memory, state?: State): Promise<boolean> => {
    try {
      const content = message.content as SafeParametersContent;
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
      const content = message.content as SafeParametersContent;
      const addresses = content.text.match(/0x[a-fA-F0-9]+/g) || [];
      
      let result: string;

      result = await safeService.createSafe({ owners:addresses, threshold:1 }, runtime);

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
