import { expect, test } from "@playwright/test";
import { LandingPage } from "../../src/domain/stock-management-and-inventory/helpers/landing-page.ts";
import { getFixtures } from "../../src/core/fixturesLoader/fixturesLoader.ts";
import LoggerFactory from "../../src/core/logger/logger.factory.ts";

const logger = LoggerFactory.createLogger("SmuiLanding");

test.beforeEach(async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.goto();
});

test("The environment is STAGING.", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.correctEnv).toBeVisible();
});

test("Login is possible.", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.logoutButton).toBeVisible();
});

test("The B2B order status is ON.", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.b2bStatus).toBeVisible();
});

// eslint-disable-next-line playwright/expect-expect
test("The expected shops are active and could be deactivated.", async ({
  page,
}) => {
  const landingPage = new LandingPage(page);
  await landingPage.stockSyncChannelStatusOn();
});

test("The manual Stock Sync is available.", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await expect(landingPage.stockSyncHeading).toBeVisible();
  await expect(landingPage.stockSyncChannel).toBeVisible();
  await expect(landingPage.stockSyncUpdateType).toBeVisible();
  await expect(landingPage.stockSyncButton).toBeVisible();
  await expect(landingPage.stockSyncText).toBeVisible();
});

// eslint-disable-next-line playwright/expect-expect
test("The expected Channel options for the manual Stock Sync are available.", async ({
  page,
}) => {
  const landingPage = new LandingPage(page);
  await landingPage.stockSyncChannelFormOptions();
});

// eslint-disable-next-line playwright/expect-expect
test("The expected Update Type options for the manual Stock Sync are available.", async ({
  page,
}) => {
  const landingPage = new LandingPage(page);
  await landingPage.stockSyncUpdateTypeFormOptions();
});

//getting test data using fixtures
(async () => {
  try {
    fixtures = await getFixtures(
      "/src/domain/stock-management-and-inventory/fixtures/stockSyncs.json",
    );
    logger.info("Loading fixtures", { additional: fixtures });
  } catch (error) {
    logger.error("Error loading fixtures:", fixtures);
  }
})();
let fixtures: string[] = [];

// eslint-disable-next-line playwright/expect-expect
test("The Stock Syncs can be triggered successfully for the expected shops.", async ({
  page,
}) => {
  for (const key of Object.keys(fixtures)) {
    const landingPage = new LandingPage(page);
    await landingPage.triggerStockSyncSuccessfully(
      fixtures[key].shop,
      fixtures[key].syncType,
    );
  }
});
