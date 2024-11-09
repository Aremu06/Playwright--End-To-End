import { expect, test } from "@playwright/test";
import { CheckoutPage } from "../../src/domain/checkout/helpers/checkout-page";
import { HomePage } from "../../src/domain/ESNShop/helpers/home-page";
import { PasswordPage } from "../../src/domain/ESNShop/helpers/password-page";
import { PaymentPage } from "../../src/domain/checkout/helpers/payment-page";
import { ProductDetailPage } from "../../src/domain/ESNShop/helpers/product-detail-page";
import { SearchResultPage } from "../../src/domain/ESNShop/helpers/search-result-page";
import { ThankYouPage } from "../../src/domain/checkout/helpers/thank-you.page";
import { CountryAndLanguageCodes } from "../../src/domain/checkout/data/countryAndLanguageCodes";
import { ShoppingCartPage } from "../../src/domain/ESNShop/helpers/shopping-cart-page";
import { depositProduct } from "../../src/domain/ESNShop/data/productData";

let browserContext;

test.beforeAll(async ({ browser }) => {
  browserContext = await browser.newContext();
});

test.afterAll(async () => {
  await browserContext.close();
});

test("Verify user can buy products with deposit in Germany store only", async ({
  page,
}) => {
  const passwordPage = new PasswordPage(page);
  await passwordPage.goto();
  await passwordPage.enterPassword();

  const homePage = new HomePage(page);
  await homePage.logoVisible();

  const searchResultPage = new SearchResultPage(page);

  const productDetailPage = new ProductDetailPage(page);
  const shoppingCartPage = new ShoppingCartPage(page);

  await homePage.searchForProduct(depositProduct.name);
  await searchResultPage.openFirstProduct(depositProduct.name);
  await productDetailPage.addToCart();
  await shoppingCartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.checkForDeposit(depositProduct.deposit);

  await checkoutPage.fillCustomerShippingData(CountryAndLanguageCodes.DE);

  await checkoutPage.continueToShipping();
  await checkoutPage.continueToPayment();

  const paymentPage = new PaymentPage(page);
  await paymentPage.selectCreditCardPayment();
  await paymentPage.fillCreditCardData("mastercard");
  await paymentPage.checkOrder();
  await paymentPage.buyOrder();

  const thankYouPage = new ThankYouPage(page);
  await thankYouPage.verifyPageIsVisible();
  await thankYouPage.checkForDeposit(depositProduct.deposit);
  await expect(thankYouPage).toBeTruthy();
});

test("Verify that deposit is removed and not calculated with total price if delivery address is changed to NL from checkout.", async ({
  page,
}) => {
  const passwordPage = new PasswordPage(page);
  await passwordPage.goto();
  await passwordPage.enterPassword();

  const homePage = new HomePage(page);
  await homePage.logoVisible();

  const searchResultPage = new SearchResultPage(page);

  const productDetailPage = new ProductDetailPage(page);
  const shoppingCartPage = new ShoppingCartPage(page);

  await homePage.searchForProduct(depositProduct.name);
  await searchResultPage.openFirstProduct(depositProduct.name);
  await productDetailPage.addToCart();
  await shoppingCartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.checkForDeposit(depositProduct.deposit);
  await checkoutPage.fillCustomerShippingData(CountryAndLanguageCodes.NL, true);
  await checkoutPage.checkForDeposit(depositProduct.deposit, false);

  await checkoutPage.continueToShipping();
  await checkoutPage.continueToPayment();

  const paymentPage = new PaymentPage(page);
  await paymentPage.selectCreditCardPayment();
  await paymentPage.fillCreditCardData("mastercard");
  await paymentPage.checkOrder();
  await paymentPage.buyOrder();

  const thankYouPage = new ThankYouPage(page);
  await thankYouPage.verifyPageIsVisible();
  await thankYouPage.checkForDeposit(depositProduct.deposit, false);
  await expect(thankYouPage).toBeTruthy();
});
