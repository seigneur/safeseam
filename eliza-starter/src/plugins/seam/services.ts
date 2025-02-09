import { DevicesListResponse, Seam, SeamHttpRequest, LocksLockDoorResponse, LocksUnlockDoorResponse } from "seam";

export const createSeamService = (apiKey) => {
  const seam = new Seam({
    apiKey
  });

  const listAugustDevices = async (): Promise<SeamHttpRequest<DevicesListResponse, "devices">> => {
      try {
          // Retrieve all devices, filtered by manufacturer,
          // which is one of several filters that list() supports.
          const allAugustLocks = await seam.devices.list({manufacturer: "august"});
        
          return allAugustLocks
      } catch (error: any) {
          console.error("Error retrieving August devices", error.message);
          throw error;
      }
  }

  const lockAugustDevice = async (name: string): Promise<SeamHttpRequest<LocksLockDoorResponse, 'action_attempt'>> => {
    try {
        const device = await seam.devices.get({name});
        const actionAttempt = await seam.locks.lockDoor({
          device_id: device.device_id
        });
      
        return actionAttempt
    } catch (error: any) {
        console.error("Error retrieving August devices", error.message);
        throw error;
    }
  }

  const unlockAugustDevice = async (name: string): Promise<SeamHttpRequest<LocksUnlockDoorResponse, 'action_attempt'>> => {
    try {
        const device = await seam.devices.get({name});
        const actionAttempt = await seam.locks.unlockDoor({
          device_id: device.device_id
        });
      
        return actionAttempt
    } catch (error: any) {
        console.error("Error retrieving August devices", error.message);
        throw error;
    }
  }

  return { listAugustDevices, lockAugustDevice, unlockAugustDevice };
};