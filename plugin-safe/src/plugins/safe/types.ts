import { Content } from '@ai16z/eliza';

export interface SafeProviderConfig {
  provider: {
    signer: string;
    privateKey: string;
    rpcUrl: string;
    };
}