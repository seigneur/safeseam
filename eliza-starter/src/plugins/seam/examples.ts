import { ActionExample } from "@elizaos/core";

export const listAugustDevicesExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "How many August locks do I have?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me retrieve your August locks.",
                action: "SEAM_GET_AUGUST_DEVICES",
            },
        }
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "List all August devices",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Let me retrieve your August devices.",
                action: "SEAM_GET_AUGUST_DEVICES",
            },
        }
    ],
];

export const lockAugustDeviceExamples: ActionExample[][] = [
  [
      {
          user: "{{user1}}",
          content: {
              text: 'Can I lock my "FRONT DOOR?"',
          },
      },
      {
          user: "{{agent}}",
          content: {
              text: "Let me lock FRONT DOOR",
              action: "SEAM_LOCK_AUGUST_DEVICE",
          },
      }
  ],
  [
      {
          user: "{{user1}}",
          content: {
              text: 'Can you help me lock my August lock with name "GARAGE?"',
          },
      },
      {
          user: "{{agent}}",
          content: {
              text: "Let me lock GARAGE.",
              action: "SEAM_LOCK_AUGUST_DEVICE",
          },
      }
  ],
];

export const unlockAugustDeviceExamples: ActionExample[][] = [
  [
      {
          user: "{{user1}}",
          content: {
              text: 'Can you unlock my "FRONT DOOR?"',
          },
      },
      {
          user: "{{agent}}",
          content: {
              text: "Let me unlock FRONT DOOR",
              action: "SEAM_UNLOCK_AUGUST_DEVICE",
          },
      }
  ],
  [
      {
          user: "{{user1}}",
          content: {
              text: 'Can you help me unlock my August lock with name "GARAGE?"',
          },
      },
      {
          user: "{{agent}}",
          content: {
              text: "Let me unlock GARAGE.",
              action: "SEAM_UNLOCK_AUGUST_DEVICE",
          },
      }
  ],
];