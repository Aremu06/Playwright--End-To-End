import { expect, type Locator, type Page } from "@playwright/test";
import LoggerFactory from "../../../core/logger/logger.factory";

const logger = LoggerFactory.createLogger("shopifyAdminHomePage logger");

export class ShopifyAdminHomePage {
  readonly page: Page;
  readonly discounts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.discounts = page.locator(
      '//span[@class="Polaris-Navigation__Text"]/span[text()="Discounts"]',
    );
  }

  async clickOnDiscounts() {
    await this.page.waitForURL("**/store/**");
    try {
      await this.discounts.waitFor({
        state: "visible",
        timeout: 60000,
      });
      await expect(this.discounts).toBeEnabled();
      await this.discounts.click();
    } catch (error) {
      logger.info(
        "Initial click failed. Retrying the click discounts after page reload...",
      );
      await this.discounts.waitFor({
        state: "visible",
        timeout: 60000,
      });
      await expect(this.discounts).toBeEnabled();
      await this.discounts.click();
    }
  }
}
