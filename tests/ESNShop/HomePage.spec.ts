import { test } from "@playwright/test";
import { HomePage } from "../../src/domain/ESNShop/helpers/home-page";
import { PasswordPage } from "../../src/domain/ESNShop/helpers/password-page";
import { SearchResultPage } from "../../src/domain/ESNShop/helpers/search-result-page";
import { ShoppingCartPage } from "../../src/domain/ESNShop/helpers/shopping-cart-page";
import { CountryAndLanguageCodes } from "../../src/domain/checkout/data/countryAndLanguageCodes";
import { productSearchKeyword } from "../../src/domain/ESNShop/data/product.d";

test("Verify the elements in header", async ({ page }) => {
  const passwordPage = new PasswordPage(page);
  const homePage = new HomePage(page);
  const searchResultPage = new SearchResultPage(page);
  const cartPage = new ShoppingCartPage(page);

  await passwordPage.goto(CountryAndLanguageCodes.DE);
  await passwordPage.enterPassword();
  await homePage.closeTheBanner();
  await homePage.logoVisible();

  await homePage.clickOnHeaderLogo();
  await homePage.verifyReloadedPage();

  await searchResultPage.verifyEmptySearchResult();

  await searchResultPage.searchForProduct(productSearchKeyword.sample1);
  await searchResultPage.openFirstProductFromSearchWindow();
  await searchResultPage.compareFirstItemInSearchResult();

  await homePage.verifyCountrySelectorWindow();
  await homePage.verifyCountrySelectorWindowClose();

  await cartPage.verifyCartWindow();
  await cartPage.clickCloseCartIcon();

  await homePage.clickProfileIcon();
  await homePage.verifyRedirectedPage();
});
