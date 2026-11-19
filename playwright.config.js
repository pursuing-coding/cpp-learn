import { defineConfig, devices } from "@playwright/test";

const testPort = Number(process.env.PLAYWRIGHT_PORT || 4273);
const baseURL = `http://127.0.0.1:${testPort}`;

const safari = [
  { name: "webkit-desktop", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 980 } } },
  { name: "webkit-mobile", use: { ...devices["iPhone 13"], viewport: { width: 390, height: 844 } } }
];
const chromium = [
  { name: "chromium-desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 980 } } },
  { name: "chromium-mobile", use: { ...devices["Pixel 5"], viewport: { width: 390, height: 844 } } }
];

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  fullyParallel: true,
  reporter: process.env.CI ? "line" : "list",
  use: {
    baseURL,
    trace: "on-first-retry"
  },
  webServer: {
    command: "npm start",
    url: baseURL,
    env: { PORT: String(testPort) },
    reuseExistingServer: false,
    timeout: 15_000
  },
  projects: process.env.CI ? [...safari, ...chromium] : safari
});
