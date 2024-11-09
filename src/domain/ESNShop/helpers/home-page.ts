import { expect, type Locator, type Page } from "@playwright/test";
import { setTimeout } from "timers/promises";

export class HomePage {
  readonly page: Page;
  readonly acceptAllCookiesButton: Locator;
  readonly campaignPopUp: Locator;
  readonly closeCampaignPopUp: Locator;
  readonly defaultUrl: string;
  readonly eGiftCardNavigationEntry: Locator;
  readonly logo: Locator;
  readonly productsNavigationEntry: Locator;
  readonly searchIcon: Locator;
  readonly searchInputField: Locator;
  readonly countrySelectorDropdown: Locator;
  readonly countrySelectorWindow: Locator;
  readonly countrySelectorRadioButtonDE: Locator;
  readonly countrySelectorButton: Locator;
  readonly countrySelectorCloseButton: Locator;
  readonly profileIcon: Locator;
  readonly loginHeader: Locator;
  readonly headerLogo: Locator;
  readonly saleBanner: Locator;
  readonly saleBannerClose: Locator;

  constructor(page: Page) {
    this.page = page;
    this.acceptAllCookiesButton = page.locator(
      "(//a[@class='cookiebanner__button'])[1]",
    );
    this.closeCampaignPopUp = page.locator(
      '[class^="overlay__close icon-button campaign-popup-overlay"]',
    );
    this.campaignPopUp = page.locator("button.campaign-popup-overlay__close");
    this.defaultUrl = "https://stage.esn.com";
    this.eGiftCardNavigationEntry = page
      .getByRole("link", { name: "Gutscheine" })
      .first();
    this.logo = page.getByRole("link", { name: "ESN 3.0 - Staging" });
    this.productsNavigationEntry = page.locator(
      "(//button[@class='navigation__dropdown-trigger'])[2]",
    );
    this.searchIcon = page.locator("(//button[@type='submit'])[1]");
    this.searchInputField = page.locator(
      'form[class="search-bar"] #header-search',
    );
    this.headerLogo = page.locator("//*[@class='site-header__logo']");
    this.countrySelectorDropdown = page.locator(
      "//*[@class='site-header__dropdown-trigger']",
    );
    this.countrySelectorWindow = page.locator(
      "//*[contains(@class,'overlay critical-hide market-selector-overlay')]",
    );
    this.countrySelectorRadioButtonDE = page.locator(
      "//*[@class='market-selector__market radio-input']/input[@value='DE']",
    );
    this.countrySelectorButton = page.locator(
      "//*[@class='market-selector__form-footer']/button",
    );
    this.countrySelectorCloseButton = page.locator(
      "//button[@class='market-selector__close icon-button']//*[name()='svg']",
    );
    this.profileIcon = page.locator(
      "//a[@class='site-header__account icon-button']//*[name()='svg']",
    );
    this.loginHeader = page.locator("//*[@class='headings-container']/div/h1");
    this.saleBanner = page.locator("div.gta-content").first();
    this.saleBannerClose = page
      .locator("div.gta-bar__close-btn-container")
      .first();

    this.closeTheBanner();
  }

  async logoVisible() {
    await this.page.waitForLoadState("domcontentloaded");
    await this.logo.isVisible();
    await this.acceptAllCookiesButton.click();
  }

  async searchForProduct(searchTerm: string) {
    await this.page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: "smooth" }); //The UI frequently becomes unresponsive when scrolling to search.
      //This alternative appears to be the most effective solution.
    });
    if (await this.saleBanner.isVisible()) {
      await this.saleBannerClose.click();
    }
    await this.searchIcon.click();
    await this.searchInputField.fill(searchTerm);
    await this.searchInputField.press("Enter");
    if (await this.acceptAllCookiesButton.isVisible()) {
      await this.acceptAllCookiesButton.click();
    }
  }

  async goto(countryCode = "") {
    countryCode === ""
      ? await this.page.goto(this.defaultUrl)
      : await this.page.goto(`https://${this.defaultUrl}.stage.esn.com`);
  }

  async navigateToEGiftCardsOverviewPage() {
    await this.productsNavigationEntry.hover();
    const eGiftCardNavigationEntryUrlPart =
      await this.eGiftCardNavigationEntry.getAttribute("href");
    const eGiftCardNavigationEntryUrl = `${this.defaultUrl}/${eGiftCardNavigationEntryUrlPart}`;
    await this.page.goto(eGiftCardNavigationEntryUrl);
  }

  async closeTheBanner() {
    await this.page.addLocatorHandler(this.campaignPopUp, async () => {
      await this.campaignPopUp.click();
    });
  }

  async clickOnHeaderLogo() {
    await this.headerLogo.click();
  }

  async verifyReloadedPage() {
    await this.page.waitForLoadState("domcontentloaded");
    await expect.soft(this.page).toHaveURL(this.defaultUrl);
    await this.headerLogo.isVisible();
  }

  async clickCountrySelectorDropdown() {
    await this.countrySelectorDropdown.click();
  }

  async verifyCountrySelectorWindow() {
    await this.clickCountrySelectorDropdown();
    await expect.soft(this.countrySelectorWindow).toBeVisible();
    await expect.soft(this.countrySelectorRadioButtonDE).toBeChecked();
    await expect.soft(this.countrySelectorButton).toBeVisible();
  }

  async verifyCountrySelectorWindowClose() {
    await this.countrySelectorCloseButton.click();
    await setTimeout(1000);
    //verify if country selector window is disappearing after click on close button
    const countrySelectorWindowStatus =
      await this.countrySelectorWindow.evaluate(
        (style) => getComputedStyle(style)["display"],
      );
    await expect.soft(countrySelectorWindowStatus.toString()).toBe("none");
  }

  async clickProfileIcon() {
    await this.profileIcon.isVisible();
    await this.profileIcon.click();
  }

  async verifyRedirectedPage() {
    await this.loginHeader.isVisible();
    const title = await this.loginHeader.first().innerText();
    await expect.soft(title).toBe("Einloggen");
  }
}
