import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests",
  timeout: 60000,
  use: {
    channel: "chrome",
    baseURL: "http://127.0.0.1:4173",
    viewport: { width: 1920, height: 1080 },
  },
  workers: 1,
  reporter: "list",
});
