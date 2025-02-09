import { Content, IAgentRuntime, Service } from '@elizaos/core';
import { SafeConfig } from "@safe-global/sdk-starter-kit";


export interface SafeProviderConfig {
  provider: {
    signer: string;
    privateKey: string;
    rpcUrl: string;
    };
}

export interface SafeCreateResponse {
  success: boolean;
  response: string;
}

export interface SafeService extends Service {
  createSafe(_safeConfig: SafeConfig, runtime: IAgentRuntime): Promise<any>;
  sendTx(_safeAddress: string, runtime: IAgentRuntime, usdc:bigint, to: string): Promise<any>;
}

