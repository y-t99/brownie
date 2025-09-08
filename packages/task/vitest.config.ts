/* eslint-disable turbo/no-undeclared-env-vars */
import { config } from "dotenv";
import path from "path";
import { defineConfig } from "vitest/config";

config({ path: path.resolve(__dirname, "../../.env") });

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./vitest.setup.ts"],
    env: {
      OPEN_ROUTER_BASE_URL: process.env.OPEN_ROUTER_BASE_URL,
      OPEN_ROUTER_KEY: process.env.OPEN_ROUTER_KEY,
      OPENAI_DEFAULT_MODEL: process.env.OPENAI_DEFAULT_MODEL,
      TRIGGER_SECRET_KEY: process.env.TRIGGER_SECRET_KEY
    },
    testTimeout: 1000 * 60 * 10,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
