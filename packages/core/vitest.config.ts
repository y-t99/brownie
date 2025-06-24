import { config } from "dotenv";
import path from "path";
import { defineConfig } from "vitest/config";

config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    env: {
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
      DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL,
      DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL,
      SERP_API_KEY: process.env.SERP_API_KEY,
      AZURE_RESOURCE_NAME: process.env.AZURE_RESOURCE_NAME,
      AZURE_API_KEY: process.env.AZURE_API_KEY,
      AZURE_GPT_4o: process.env.AZURE_GPT_4o,
      AZURE_GPT_4o_API_VERSION: process.env.AZURE_GPT_4o_API_VERSION,
    },
    testTimeout: 1000 * 60 * 10,
  },
});
