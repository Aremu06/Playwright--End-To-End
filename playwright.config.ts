import { defineConfig, devices } from "@playwright/test";
import { format } from "date-fns";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: [path.resolve(".env"), path.resolve(".env.local")],
  override: true,
});

const TIMESTAMP = format(new Date(), "yyyyMMdd-HHmmss");

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Set timeout to 60 seconds. */
  timeout: 10 * 60 * 1000,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  reporter: [
    ["list", { printSteps: false }],
    [
      "html",
      { open: "always", outputFolder: `reports/html/${TIMESTAMP}` },
    ] /* We cannot give filename explicitely here, just folder name */,
    [
      "json",
      {
        outputFolder: "reports/json",
        outputFile: `reports/json/${TIMESTAMP}-results.json`,
      },
    ],
    ["allure-playwright", { outputFolder: "allure-results" }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    // trace: "on-first-retry",
    contextOptions: {
      recordVideo: {
        dir: "./test-results/videos/",
      },
    },
    headless: true,
    video: "on",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chrome",
      testIgnore: "tests/stock-management-and-inventory/**",
      use: { ...devices["Desktop Chrome"] },
    },
    // {
    //   name: "firefox",
    //   testIgnore: "tests/stock-management-and-inventory/**",
    //   use: { ...devices["Desktop Chrome"] },
    // },
    // {
    //   name: "safari",
    //   testIgnore: "tests/stock-management-and-inventory/**",
    //   use: { ...devices["Desktop Safari"] },
    // },
    {
      name: "setup",
      testMatch: /.*setup.ts/,
      testDir: "tests/stock-management-and-inventory",
      use: { ...devices["Desktop Chrome"], headless: false },
    },
    {
      name: "smuiChrome",
      testMatch: /.*ui.spec.ts/,
      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
        headless: true,
      },
      testDir: "tests/stock-management-and-inventory",
      dependencies: ["setup"],
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // }, */

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
