import { IAgentRuntime, ServiceType } from "@elizaos/core";
import { RoomService } from "./types";


export const roomService: RoomService = {

  serviceType: ServiceType.BUTTPLUG,

  initialize: async (runtime: IAgentRuntime): Promise<void> => {
    console.log("Rooms Service Initialized");
  },
  bookRoom: async (_user:string, runtime: IAgentRuntime): Promise<any> => {
    try {
      return {roomNo: '101', escrow: '0x1234'};
        
    } catch (error: any) {
        console.error("Error creating Safe", error.message);
        throw error;
    }
}
// ,
// sendTx: async (_safeAddress: string, runtime: IAgentRuntime, usdc:bigint, to: string): Promise<any> => {
//   try {
//       const safeClient = await createSafeClient({
//         provider: runtime.getSetting("SAFE_RPC_URL"),
//         signer: runtime.getSetting("SAFE_DEPLOYER_PK_KEY"),
//         safeAddress: _safeAddress
//       })
//       const usdcTokenAddress  = '0x6b175474e89094c44da98b954eedeac495271d0f';
//       const transferUSDC = {
//         to: usdcTokenAddress,
//         data: generateTransferCallData(to, usdc),
//         value: '0'
//       }
//       const transactions = [transferUSDC, transferUSDC]
    
//       const txResult = await safeClient.send({ transactions })
//       return txResult; 
//   } catch (error: any) {
//       console.error("Error sending Safe tx", error.message);
//       throw error;
//   }
// }
}