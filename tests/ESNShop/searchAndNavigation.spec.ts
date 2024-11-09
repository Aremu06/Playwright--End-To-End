import { test } from "@playwright/test";
import { HomePage } from "../../src/domain/ESNShop/helpers/home-page";
import { PasswordPage } from "../../src/domain/ESNShop/helpers/password-page";
import { SearchResultPage } from "../../src/domain/ESNShop/helpers/search-result-page";
import { CountryAndLanguageCodes } from "../../src/domain/checkout/data/countryAndLanguageCodes";
import { productSearchKeyword } from "../../src/domain/ESNShop/data/product.d";

test("Verify that entering a keyword in the search bar and going to all search results leads to expected search results", async ({
  page,
}) => {
  const passwordPage = new PasswordPage(page);
  const homePage = new HomePage(page);
  const searchResultPage = new SearchResultPage(page);

  await passwordPage.goto(CountryAndLanguageCodes.DE);
  await passwordPage.enterPassword();
  await homePage.closeTheBanner();
  await homePage.logoVisible();

  await searchResultPage.clickOnSearchBar();
  await searchResultPage.searchForProduct(productSearchKeyword.sample1);
  await searchResultPage.verifySuggestedListCount();
  await searchResultPage.verifyKeywordInBold();

  await searchResultPage.clickSearchAllButton();
  await searchResultPage.searchAllResultsPageCheck();
});

test("Verify behaviour of selection of items from 'popular search terms' in search overlay", async ({
  page,
}) => {
  const passwordPage = new PasswordPage(page);
  const homePage = new HomePage(page);
  const searchResultPage = new SearchResultPage(page);

  await passwordPage.goto(CountryAndLanguageCodes.DE);
  await passwordPage.enterPassword();
  await homePage.closeTheBanner();
  await homePage.logoVisible();

  await searchResultPage.clickOnSearchBar();
  await searchResultPage.verifyPopularSearchItemClickBehavior();
});
