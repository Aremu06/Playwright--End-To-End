import { expect, type Locator, type Page } from "@playwright/test";

export class ShopifyAdminTqgPage {
  readonly page: Page;
  readonly campaignName: Locator;
  readonly updateDiscountsMetaFields: Locator;
  readonly updateMetafield: Locator;
  readonly successfullyUpdatedToast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.campaignName = page
      .frameLocator('iframe[name="app-iframe"]')
      .locator('//h3[contains(@class, "Polaris-Text--root")]');
    this.updateDiscountsMetaFields = page.locator(
      '//span[text()="Update Discounts Metafields"]',
    );
    this.updateMetafield = page
      .frameLocator('iframe[name="app-iframe"]')
      .getByRole("button", { name: "Update Metafields" });
    this.successfullyUpdatedToast = page.locator(
      '//span[text()="Successfully updated"]',
    );
  }

  async validateCampaignName(name) {
    const campaignName = await this.campaignName.textContent();
    await expect(campaignName).toContain(name);
  }

  async clickOnUpdateDiscountsMetaFields() {
    try {
      await this.updateDiscountsMetaFields.click({ timeout: 5000 });
    } catch {
      await this.updateDiscountsMetaFields.click({ force: true });
    }
    await this.page.waitForURL("**/update-active-discounts-metafields/**");
  }

  async clickUpdateMetafieldButton() {
    await this.updateMetafield.click();
    await this.successfullyUpdatedToast.waitFor({
      state: "visible",
      timeout: 60000,
    });
  }
}
