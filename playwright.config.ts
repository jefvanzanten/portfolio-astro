import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  webServer: {
    command:
      'cmd /c "set ASTRO_TELEMETRY_DISABLED=1&& npm run dev -- --host localhost --port 4321"',
    port: 4321,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
