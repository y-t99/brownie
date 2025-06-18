import { defineConfig } from "vitest/config";
import { config } from "dotenv";
import path from "path";

config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  test: {
    environment: "node",
    env: {
      DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
      DEEPSEEK_MODEL: process.env.DEEPSEEK_MODEL,
      DEEPSEEK_BASE_URL: process.env.DEEPSEEK_BASE_URL,
      SERP_API_KEY: process.env.SERP_API_KEY,
    },
    testTimeout: 1000 * 60 * 10,
  },
});
