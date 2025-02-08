import { Seam } from "seam";

export const createSeamService = (apiKey) => {
  const seam = new Seam({
    apiKey
  });

  const listAugustDevices = async (): Promise<any> => {
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

  return { listAugustDevices };
};