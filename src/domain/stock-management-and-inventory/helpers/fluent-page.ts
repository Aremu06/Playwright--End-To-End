import { type Locator, type Page } from "@playwright/test";
const smuiUrl = process.env.SMUI_BASE_URL!;

export class FluentPage {
  readonly page: Page;
  readonly fluentSingleStockUrl: string;
  readonly fluentLink: Locator;
  readonly singleStockLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fluentSingleStockUrl =
      smuiUrl + "fluent-commerce/single-absolute-stock-update";
    this.fluentLink = page.getByRole("link", { name: "󱘸 FluentCommerce" });
    this.singleStockLink = page.getByRole("link", {
      name: "Single stock update",
    });
  }

  async clickFluentLink() {
    await this.fluentLink.click();
  }
  async clickSingleStockLink() {
    await this.singleStockLink.click();
  }
}
