import { createSafeClient, SafeConfig } from "@safe-global/sdk-starter-kit";
import { SafeProviderConfig, SafeService } from "./types.ts";
import { IAgentRuntime, ServiceType } from "@elizaos/core";

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
        }
          );
        return safeClient; 
    } catch (error: any) {
        console.error("Error creating Safe", error.message);
        throw error;
    }
}
}
