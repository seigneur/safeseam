import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const seamEnvSchema = z.object({
    SEAM_API_KEY: z.string().min(1, "Seam API key is required"),
});

export type seamConfig = z.infer<typeof seamEnvSchema>;

export async function validateSeamConfig(
    runtime: IAgentRuntime
): Promise<seamConfig> {
    try {
        const config = {
          SEAM_API_KEY: runtime.getSetting("SEAM_API_KEY"),
        };
        console.log('config: ', config)
        return seamEnvSchema.parse(config);
    } catch (error) {
        console.log("error::::", error)
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `Seam API configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}