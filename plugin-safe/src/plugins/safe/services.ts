import { createSafeClient, SafeConfig } from "@safe-global/sdk-starter-kit";
import { SafeProviderConfig } from "./types.ts";

export let _providerConfig: SafeProviderConfig;

export const createSafe = async (_safeConfig: SafeConfig): Promise<any> => {
    try {
        const safeClient = await createSafeClient({
          provider: _providerConfig.provider.rpcUrl,
          signer: _providerConfig.provider.privateKey,
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

export const initializeSafe = async (providerConfig: SafeProviderConfig): Promise<void> => {
    _providerConfig = providerConfig;
}
