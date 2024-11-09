import { type Locator, type Page } from "@playwright/test";

export class EGiftCardsOverviewPage {
  readonly page: Page;
  readonly closeNewsletterPopupButton: Locator;
  readonly firstGiftCardEntry: Locator;
  readonly searchResults: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeNewsletterPopupButton = page.locator(".klaviyo-close-form");
    this.firstGiftCardEntry = page.locator(
      "(//a[@class='product-card']//div)[1]",
    );
    this.searchResults = page.locator("#CollectionAjaxResult");
  }

  async verifyGiftCardsDisplayed() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.searchResults.isVisible();
  }

  async selectFirstGiftCard() {
    if (await this.closeNewsletterPopupButton.isVisible()) {
      await this.closeNewsletterPopupButton.click();
    }
    await this.firstGiftCardEntry.click();
  }
}
