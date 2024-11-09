import { expect, type Locator, type Page } from "@playwright/test";
import { publicCampaign } from "../../shopify-admin/data/publicCampaignData";
import LoggerFactory from "../../../core/logger/logger.factory";

const logger = LoggerFactory.createLogger("productDetailsPage logger");

export class ProductDetailPage {
  readonly page: Page;
  readonly addToCartButton: Locator;
  readonly closeNewsletterPopupButton: Locator;
  readonly confirmAgeButton: Locator;
  readonly addToCartButtonLoadingIcon: Locator;
  readonly couponCode: Locator;

  constructor(page: Page) {
    this.page = page;
    this.addToCartButton = page.locator(
      "//div[@class='product-form__add-to-cart-container']//button[1]",
    );
    this.closeNewsletterPopupButton = page.locator(
      ".needsclick.klaviyo-close-form",
    );
    this.confirmAgeButton = page.locator("#confirm-note");
    this.addToCartButtonLoadingIcon = page.locator(
      '(//*[@class="icon icon__loading"])[1]',
    );
    this.couponCode = page.locator(
      '//div[@class="product-promoted-campaign__header"] //span[1]',
    );
  }

  async addToCart() {
    await this.page.waitForLoadState();
    if (await this.closeNewsletterPopupButton.isVisible()) {
      await this.closeNewsletterPopupButton.click();
    }
    await this.addToCartButton.isEnabled();
    await this.addToCartButton.click();
    if (await this.confirmAgeButton.isVisible()) {
      await this.confirmAgeButton.click();
    }
  }

  async validateTheCouponCode() {
    try {
      await this.couponCode.waitFor({ state: "visible", timeout: 30000 });
    } catch (error) {
      logger.error(
        `The "${publicCampaign.code}" public campaign element isn't visible`,
        error,
      );
    }
    const coupon = await this.couponCode.textContent();
    await expect(coupon).toEqual(publicCampaign.code);
  }
}
