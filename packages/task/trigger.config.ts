import { defineConfig } from "@trigger.dev/sdk";

export default defineConfig({
  project: "proj_ooxriugmrvgxjcpsivqc",
  dirs: ["./src/trigger"],
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  maxDuration: 3600,
});