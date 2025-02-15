import { createSafeClient, SafeConfig } from "@safe-global/sdk-starter-kit";
import { SafeProviderConfig, SafeService } from "./types.ts";
import { IAgentRuntime, ServiceType } from "@elizaos/core";
import { Address, createPublicClient, custom, encodeFunctionData, parseAbi } from 'viem'

export let _providerConfig: SafeProviderConfig;


export const safeService: SafeService = {

  serviceType: ServiceType.BUTTPLUG,

  initialize: async (runtime: IAgentRuntime): Promise<void> => {
    // if (!_providerConfig) {
     console.log("SAFE Service Initialized");  
     _providerConfig.provider.privateKey = runtime.getSetting("SAFE_DEPLOYER_PK_KEY");
     _providerConfig.provider.rpcUrl = runtime.getSetting("SAFE_RPC_URL");
    // }
  },
  createSafe: async (_safeConfig: SafeConfig, runtime: IAgentRuntime): Promise<any> => {
    try {
        const safeClient = await createSafeClient({
          provider: runtime.getSetting("SAFE_RPC_URL"),
          signer: runtime.getSetting("SAFE_DEPLOYER_PK_KEY"),
          safeOptions: {
            owners: _safeConfig.owners,
            threshold: _safeConfig.threshold
          }
        } //save to supabase under agent to agent name
          );
        return safeClient; 
    } catch (error: any) {
        console.error("Error creating Safe", error.message);
        throw error;
    }
},
sendTx: async (_safeAddress: string, runtime: IAgentRuntime, usdc:bigint, to: string): Promise<any> => {
  try {
      const safeClient = await createSafeClient({
        provider: runtime.getSetting("SAFE_RPC_URL"),
        signer: runtime.getSetting("SAFE_DEPLOYER_PK_KEY"),
        safeAddress: _safeAddress
      })
      const usdcTokenAddress  = '0x6b175474e89094c44da98b954eedeac495271d0f';
      const transferUSDC = {
        to: usdcTokenAddress,
        data: generateTransferCallData(to, usdc),
        value: '0'
      }
      const transactions = [transferUSDC, transferUSDC]
    
      const txResult = await safeClient.send({ transactions })
      return txResult; 
  } catch (error: any) {
      console.error("Error sending Safe tx", error.message);
      throw error;
  }
}
}

const generateTransferCallData = (to: string, value: bigint) => {
  const functionAbi = parseAbi(['function transfer(address _to, uint256 _value) returns (bool)'])

  return encodeFunctionData({
    abi: functionAbi,
    functionName: 'transfer',
    args: [to, value]
  })
}