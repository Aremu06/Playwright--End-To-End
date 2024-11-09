import { expect, type Locator, type Page } from "@playwright/test";

export class ShopifyAdminDiscountsPage {
  readonly page: Page;
  readonly activeTab: Locator;
  readonly miniSpinner: Locator;
  readonly selectAllCheckBox: Locator;
  readonly selectedText: Locator;
  readonly deactivateDiscountsButton: Locator;
  readonly deactivateButton: Locator;
  readonly discountsDeactivatedToast: Locator;
  readonly createDiscountsButton: Locator;
  readonly publicCampaign: Locator;
  readonly newPublicCampaignForm: Locator;
  readonly internalTitle: Locator;
  readonly codes: Locator;
  readonly discountGroupPercentage: Locator;
  readonly saveDiscountButton: Locator;
  readonly productGroupSelectionDropDown: Locator;
  readonly searchCollections: Locator;
  readonly browseButton: Locator;
  readonly selectAllProducts: Locator;
  readonly addButton: Locator;
  readonly bigSpinner: Locator;
  readonly successfullySavedPublicCampaignToast: Locator;
  readonly tqgCheckoutDiscounts: Locator;
  readonly selectAllActiveResults: Locator;
  readonly undo: Locator;
  readonly moreViews: Locator;
  readonly campaignTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.activeTab = page.locator(
      '(//div[@class="Polaris-InlineStack" and text()="Active"])[1]',
    );
    this.miniSpinner = page.locator(
      '//div[@class="Polaris-IndexFilters-Container"]//span[@class="Polaris-Spinner Polaris-Spinner--sizeSmall"]',
    );
    this.selectAllCheckBox = page.locator(
      '(//input[@class="Polaris-Checkbox__Input"])[2]',
    );
    this.selectedText = page.locator('//span[contains(text(),"selected")]');
    this.deactivateDiscountsButton = page.locator(
      '(//span[text()="Deactivate discounts"])[2]',
    );
    this.deactivateButton = page.locator('//span[text()="Deactivate"]');
    this.discountsDeactivatedToast = page.locator(
      '//div[@class="Polaris-Frame-Toast"] //span[contains(text(),"discounts deactivated")]',
    );
    this.createDiscountsButton = page.locator(
      '//span[text()="Create discount"]',
    );
    this.publicCampaign = page.locator(
      '//span[contains(text(),"Public Campaign")]',
    );
    this.newPublicCampaignForm = page
      .frameLocator('iframe[name="app-iframe"]')
      .locator("span")
      .filter({ hasText: "New Campaign" });
    this.internalTitle = page
      .frameLocator('iframe[name="app-iframe"]')
      .getByLabel("Internal title");
    this.codes = page
      .frameLocator('iframe[name="app-iframe"]')
      .getByLabel("Codes");
    this.discountGroupPercentage = page
      .frameLocator('iframe[name="app-iframe"]')
      .getByLabel("Discount percentage", { exact: true });
    this.saveDiscountButton = page
      .frameLocator('iframe[name="app-iframe"]')
      .getByRole("button", { name: "Save discount" });
    this.productGroupSelectionDropDown = page
      .frameLocator('iframe[name="app-iframe"]')
      .locator("#calculation-0")
      .nth(1);
    this.searchCollections = page.getByPlaceholder("Search collections");
    this.browseButton = page
      .frameLocator('iframe[name="app-iframe"]')
      .getByRole("button", { name: "Browse" })
      .first();
    this.selectAllProducts = page.locator('//div[@data-virtualized-index="0"]');
    this.addButton = page.getByRole("button", { name: "Add" });
    this.bigSpinner = page.locator(
      '//span[contains(@class,"Polaris-Spinner--sizeLarge")]',
    );
    this.successfullySavedPublicCampaignToast = page.locator(
      '//span[text()="Successfully saved public campaign"]',
    );
    this.tqgCheckoutDiscounts = page.locator(
      "//a[contains(@href, '/tqg-checkout-and-discounts') and contains(text(), 'TQG Checkout Discounts')]",
    );
    this.selectAllActiveResults = page.getByRole("button", {
      name: 'Select all in "Active"',
    });
    this.undo = page.getByRole("button", { name: "Undo" });
    this.moreViews = page.getByRole("button", { name: "More views" });
    this.campaignTab = page.getByLabel("Campaign", { exact: true });
  }

  async selectCampaignTab() {
    await this.page.waitForURL("**/discounts");
    await this.moreViews.waitFor({
      state: "hidden",
      timeout: 60000,
    });
    try {
      await this.moreViews.click({ timeout: 5000 });
    } catch {
      await this.moreViews.click({ force: true });
    }
    try {
      await this.campaignTab.click({ timeout: 5000 });
    } catch {
      await this.campaignTab.click({ force: true });
    }
    await this.miniSpinner.waitFor({ state: "detached" });
  }

  async checkSelectAllBox() {
    try {
      await this.selectAllCheckBox.check({ timeout: 5000 });
    } catch {
      await this.selectAllCheckBox.check({ force: true });
    }
    await expect(this.selectedText).toBeVisible({ timeout: 30000 });
  }

  async deactivateDiscounts() {
    await this.deactivateDiscountsButton.click();
    await this.deactivateButton.click();
    await this.discountsDeactivatedToast.waitFor({
      state: "visible",
      timeout: 60000,
    });
    await this.discountsDeactivatedToast.waitFor({ state: "hidden" });
  }

  async createNewPublicCampaign(
    initialTitle,
    code,
    discountPercentage,
    productGroupSelection,
    selectCollection,
  ) {
    await this.createDiscountsButton.click();
    await this.publicCampaign.click();
    await this.page.waitForURL("**/campaign-discount/**");
    await this.newPublicCampaignForm.waitFor({
      state: "attached",
      timeout: 60000,
    });
    await this.page.waitForTimeout(5 * 1000);
    await this.internalTitle.fill(initialTitle);
    await this.codes.fill(code);
    await this.discountGroupPercentage.fill(discountPercentage);
    await this.productGroupSelection(productGroupSelection);
    await this.searchAndSelectCollection(selectCollection);
    await this.clickSaveDiscountsButton();
  }

  async productGroupSelection(value) {
    await this.productGroupSelectionDropDown.selectOption(value);
  }

  async searchAndSelectCollection(value) {
    await this.browseButton.click();
    await this.searchCollections.fill(value);
    await this.bigSpinner.waitFor({ state: "visible" });
    await this.bigSpinner.waitFor({ state: "detached" });
    await this.selectAllProducts.click();
    await this.clickAddButton();
  }

  async clickAddButton() {
    await this.addButton.click();
  }

  async clickSaveDiscountsButton() {
    await this.saveDiscountButton.click();
    await this.successfullySavedPublicCampaignToast.waitFor({
      state: "attached",
      timeout: 60000,
    });
    await this.successfullySavedPublicCampaignToast.waitFor({
      state: "detached",
      timeout: 60000,
    });
  }

  async clickOnTqgDiscountsLink() {
    await this.tqgCheckoutDiscounts.click();
    await this.page.waitForURL("**/tqg-checkout-and-discounts/app");
  }
}
