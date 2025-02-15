import { Action, Content, IAgentRuntime, Memory, State } from '@elizaos/core';
import { safeService } from './services.ts';
import { SafeCreateResponse } from './types.ts';

interface SafeParametersContent extends Content {
  text: string;
}

export const safeAction: Action = {
  name: 'SAFE',
  description: 'Performs basic SAFE Multisig Send',
  similes: [
    'SEND'
    ],
  examples: [
    [
      {
        user: '{{user1}}',
        content: { text: 'Send 2 to 0xaddress1 0.0001 USDC' } as SafeParametersContent
      },
      {
        user: '{{agentName}}',
        content: {
          text: '0.001 has been sent to 0xaddress1',
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
      const addressMatch = content.text.match(/0x[a-fA-F0-9]{40}/);
      const amountMatch = content.text.match(/(\d+(\.\d+)?)/);

      if (!addressMatch || !amountMatch) {
        throw new Error('Invalid input format');
      }

      const address = addressMatch[0];
      const amount = parseFloat(amountMatch[0]);

    let result: string;

    // Use sendTx to handle amount and address
   // result = await safeService.sendTx('safeAddress', runtime, BigInt(amount * 1e6), address);

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
