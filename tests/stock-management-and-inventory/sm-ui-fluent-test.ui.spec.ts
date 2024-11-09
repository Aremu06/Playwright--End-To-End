import { expect, test } from "@playwright/test";
import { FluentPage } from "../../src/domain/stock-management-and-inventory/helpers/fluent-page.ts";
import { LandingPage } from "../../src/domain/stock-management-and-inventory/helpers/landing-page.ts";

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

test("Navigating to the page FluentCommerce, verifying single stock update is possible.", async ({
  page,
}) => {
  const fluentPage = new FluentPage(page);
  await expect(fluentPage.fluentLink).toBeVisible();
  await fluentPage.clickFluentLink();
  await expect(fluentPage.singleStockLink).toBeVisible();
  await fluentPage.clickSingleStockLink();
  const currentUrl = page.url();
  expect(currentUrl).toEqual(fluentPage.fluentSingleStockUrl);
});
