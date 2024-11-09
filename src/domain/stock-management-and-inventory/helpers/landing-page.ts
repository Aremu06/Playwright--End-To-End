import { expect, type Locator, type Page } from "@playwright/test";
const smuiUrl = process.env.SMUI_BASE_URL!;

export class LandingPage {
  readonly page: Page;
  readonly landingPageUrl: string;
  readonly correctEnv: Locator;
  readonly logoutButton: Locator;
  readonly b2bStatus: Locator;
  readonly stockSyncHeading: Locator;
  readonly stockSyncChannel: Locator;
  readonly stockSyncUpdateType: Locator;
  readonly stockSyncButton: Locator;
  readonly stockSyncText: Locator;
  readonly stockSyncSuccessClose: Locator;
  successText: Locator;

  //define alle needed locators for this page
  constructor(page: Page) {
    this.page = page;
    this.landingPageUrl = smuiUrl;
    this.correctEnv = this.page.getByText("Environment : STAGING", {
      exact: true,
    });
    this.logoutButton = this.page.getByText("Logout", { exact: true });
    this.b2bStatus = this.page.getByText("B2B-Sales Order status ON");
    this.stockSyncHeading = this.page.getByRole("heading", {
      name: "Trigger Manual Stock Sync",
    });

    this.stockSyncText = this.page.getByText(
      "Trigger a FULL or PARTIAL sync of available to sell stocks in fluent to the given channel.",
    );
    this.stockSyncChannel = this.page.getByText("Channel", { exact: true });
    this.stockSyncUpdateType = this.page.getByText("UpdateType", {
      exact: true,
    });
    this.stockSyncButton = this.page.getByRole("button", { name: "Submit" });
    this.stockSyncSuccessClose = this.page.getByRole("button", {
      name: "Close",
    });
  }

  //open the url in the browser
  async goto() {
    await this.page.goto(this.landingPageUrl);
  }

  //check if all the shops have the status active
  async stockSyncChannelStatusOn() {
    const statusShops = [
      "OXID B2B Shop",
      "Amazon Seller",
      "Member Shop",
      "ESN Shop",
      "ESN 3.0 Shop",
    ];
    for (const shop of statusShops) {
      this.page.getByText(`${shop} Deactivate`, {
        exact: true,
      });
    }
  }

  //check if all the shops for manual syncs are selectable
  async stockSyncChannelFormOptions() {
    const syncShops = ["ESN30", "MEMBER", "B2B", "AMAZON", "ESN"];
    for (const shop of syncShops) {
      await this.page.getByLabel("Channel").selectOption({ value: shop });
    }
  }

  //check if all the update types for manual stock syncs are selectable
  async stockSyncUpdateTypeFormOptions() {
    const updateTypes = ["FULL", "LAST_RUN"];
    for (const typeText of updateTypes) {
      await this.page
        .getByLabel("UpdateType")
        .selectOption({ value: typeText });
    }
  }

  //check if the full stock sync update works for all shops
  async triggerStockSyncSuccessfully(shop: string, syncType: string) {
    await this.page.getByLabel("Channel").selectOption({ value: shop });
    await this.page.getByLabel("UpdateType").selectOption({ value: syncType });
    await this.stockSyncButton.click();
    this.successText = this.page.getByText(
      `Successfully triggered manual stock sync "${syncType}" for channel ${shop}.`,
    );
    await expect(this.successText).toBeVisible();
    await expect(this.stockSyncSuccessClose).toBeVisible();
    await this.stockSyncSuccessClose.click();
  }
}
