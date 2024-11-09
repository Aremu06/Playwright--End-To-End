import { expect, type Locator, type Page } from "@playwright/test";
import { setTimeout } from "timers/promises";
import { ProductDetailPage } from "./product-detail-page";
import { productSearchKeyword } from "../../ESNShop/data/product.d";

export class SearchResultPage {
  readonly page: Page;
  readonly firstProductInSearchResult: Locator;
  readonly productsSort: Locator;
  readonly closeNewsletterPopupButton: Locator;
  readonly recentlyViewedItem: Locator;
  readonly productTitle: Locator;
  readonly searchBar: Locator;
  readonly searchContainer: Locator;
  readonly searchIcon: Locator;
  readonly firstItemInSearch: Locator;
  readonly searchInputField: Locator;
  readonly productDetailPage: ProductDetailPage;
  readonly searchResultsProductCount: Locator;
  readonly productCardTitle: Locator;
  readonly suggestedList: Locator;
  readonly boldTextInSearch: Locator;
  readonly searchAllButton: Locator;
  readonly popularSearchTerm: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstProductInSearchResult = page.locator(
      "(//a[@class='product-card'])[1]",
    );
    this.productsSort = page.locator("div.product-grid__sort-by");
    this.closeNewsletterPopupButton = page.locator(".klaviyo-close-form");
    this.recentlyViewedItem = page.locator(
      "//*[@class='predictive-search__item']",
    );
    this.productTitle = page.locator("//*[@id='template-title']");
    this.searchBar = page.locator("//*[@class='site-header__right'] // input");
    this.searchContainer = page.locator(
      "//*[contains(@class,'overlay__container predictive-search-overlay')]",
    );
    this.searchIcon = page.locator("(//button[@type='submit'])[1]");
    this.searchInputField = page.locator(
      'form[class="search-bar"] #header-search',
    );
    this.firstItemInSearch = page.locator(
      "//*[@class='predictive-search__list'][1]//p[1]",
    );
    this.productDetailPage = new ProductDetailPage(page);
    this.searchResultsProductCount = page.locator(
      '//p[contains(@class,"product-count")]',
    );
    this.productCardTitle = page.locator(
      '//p[contains(@class,"product-card__title text")]',
    );
    this.suggestedList = page.locator(
      '//*[@class="predictive-search__products"]/ul/li',
    );
    this.boldTextInSearch = page.locator(
      '//*[@class="predictive-search__list"]//strong',
    );
    this.searchAllButton = page.locator(
      '//*[@class="predictive-search__results"]/button',
    );
    this.popularSearchTerm = page.locator(
      '//button[contains(@class,"predictive-search__suggestion")]',
    );
  }

  async closeNewsLetterPopup() {
    if (await this.closeNewsletterPopupButton.isVisible()) {
      await this.closeNewsletterPopupButton.click();
    }
  }

  async openFirstProduct(productName: string) {
    await this.page.waitForLoadState();
    await this.productsSort.waitFor({
      state: "visible",
      timeout: 1 * 60 * 1000,
    });
    try {
      await this.searchResultsProductCount.waitFor({
        state: "visible",
        timeout: 1 * 60 * 1000,
      });
    } catch (error) {
      await this.page.reload();
      console.error(error);
    }
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await this.clickProduct(productName);
      if (await this.productDetailPage.addToCartButton.isVisible()) {
        break;
      }
    }
  }

  clickProduct = async (productName: string) => {
    const product: Locator = this.productCardTitle
      .locator(this.page.getByText(productName))
      .first();
    if (await product.isVisible()) {
      await product.click();
    } else {
      await this.page.reload();
    }
  };

  async openFirstProductFromSearchWindow() {
    await this.firstItemInSearch.waitFor();
    await this.firstItemInSearch.click();
    await this.closeNewsLetterPopup();
  }

  async getProductTitle() {
    await this.productTitle.innerText();
  }

  //This function is to check whether first item in "recently viewed" section in search window - is same as product recently opened
  async compareFirstItemInSearchResult() {
    const productTitleText = await this.getProductTitle();
    await this.clickOnSearchBar();
    //get the title of first item in search result and compare with previously selected product
    const productTitleOnSearchText = await this.firstItemInSearch.selectText();
    await expect.soft(productTitleText).toEqual(productTitleOnSearchText);
    //Pressing escape key to close the search window and proceed with next step
    await this.page.keyboard.press("Escape");
  }

  async clickOnSearchBar() {
    await this.searchIcon.waitFor();
    await this.searchBar.click();
    await this.searchContainer.isVisible();
    await setTimeout(2000);
  }

  async verifyEmptySearchResult() {
    await this.clickOnSearchBar();
    await setTimeout(2000);
    await expect.soft(this.recentlyViewedItem).toBeHidden();
  }

  async searchForProduct(searchTerm) {
    await this.searchBar.fill(searchTerm);
  }

  async verifySuggestedListCount() {
    await setTimeout(2000);
    //get the count of suggested list displayed in search window and check whether its equal to 3
    const suggestedListCount = await this.suggestedList.count();
    await expect.soft(suggestedListCount.toFixed()).toBe("3");
  }

  async verifyKeywordInBold() {
    for (let i = 1; i <= 3; i++) {
      const boldText = (
        await this.boldTextInSearch.nth(i).innerText()
      ).toLowerCase();
      await expect(boldText.toString()).toEqual(productSearchKeyword.sample1);
    }
  }

  async clickSearchAllButton() {
    await this.searchAllButton.click();
  }

  async searchAllResultsPageCheck() {
    await setTimeout(3000);
    //check if we have 2 search bars displayed in redirected page
    await expect.soft(this.searchBar).toBeVisible();
    await expect.soft(this.searchInputField).toBeVisible();

    await expect
      .soft(this.searchInputField)
      .toHaveValue(productSearchKeyword.sample1);

    //check if results displayed is matching with the keyword searched
    const productCartTitleText = (
      await this.productCardTitle.first().innerText()
    ).toLowerCase();
    await expect
      .soft(productCartTitleText.toString())
      .toContain(productSearchKeyword.sample1);
  }

  async verifyPopularSearchItemClickBehavior() {
    await this.popularSearchTerm.first().click();
    const firstCategoryText = await this.popularSearchTerm.first().innerText();
    const firstProductTitleText = await this.boldTextInSearch
      .nth(1)
      .innerText();

    //verify popular search category keyword is matching with search window results
    await expect.soft(this.searchBar).toHaveValue(firstCategoryText);
    await expect.soft(firstProductTitleText).toBe(firstCategoryText);

    await this.openFirstProductFromSearchWindow();

    await setTimeout(2000);
    const productTitleText = await this.productTitle.innerText();
    await expect.soft(productTitleText.toString()).toContain(firstCategoryText);
  }
}
