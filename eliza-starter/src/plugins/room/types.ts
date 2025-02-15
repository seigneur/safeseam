import { Content, IAgentRuntime, Service } from '@elizaos/core';

export interface RoomsCreateResponse {
  success: boolean;
  response: string;
}

export interface RoomService extends Service {
  bookRoom(user: string, runtime: IAgentRuntime): Promise<any>;
}
