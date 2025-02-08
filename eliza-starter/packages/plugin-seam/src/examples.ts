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