import { expect, test } from "@playwright/test";
import { CheckoutPage } from "../../src/domain/checkout/helpers/checkout-page";
import { EGiftCardsOverviewPage } from "../../src/domain/ESNShop/helpers/egift-cards-overview-page";
import { HomePage } from "../../src/domain/ESNShop/helpers/home-page";
import { PasswordPage } from "../../src/domain/ESNShop/helpers/password-page";
import { PaymentPage } from "../../src/domain/checkout/helpers/payment-page";
import { ProductDetailPage } from "../../src/domain/ESNShop/helpers/product-detail-page";
import { ThankYouPage } from "../../src/domain/checkout/helpers/thank-you.page";
import { CountryAndLanguageCodes } from "../../src/domain/checkout/data/countryAndLanguageCodes";
import { ShoppingCartPage } from "../../src/domain/ESNShop/helpers/shopping-cart-page";

test("Buy an eGift Card via VISA on DE domain", async ({ page }) => {
  const passwordPage = new PasswordPage(page);
  await passwordPage.goto();
  await passwordPage.enterPassword();

  const homePage = new HomePage(page);
  await homePage.logoVisible();
  await homePage.navigateToEGiftCardsOverviewPage();

  const eGiftCardsOverviewPage = new EGiftCardsOverviewPage(page);
  await eGiftCardsOverviewPage.verifyGiftCardsDisplayed();
  await eGiftCardsOverviewPage.selectFirstGiftCard();

  const productDetailPage = new ProductDetailPage(page);
  await productDetailPage.addToCart();

  const shoppingCartPage = new ShoppingCartPage(page);
  await shoppingCartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillCustomerBillingData(CountryAndLanguageCodes.DE);
  await checkoutPage.continueToShipping();

  const paymentPage = new PaymentPage(page);
  await paymentPage.selectCreditCardPayment();
  await paymentPage.fillCreditCardData("mastercard");
  await paymentPage.checkOrder();
  await paymentPage.buyOrder();

  const thankYouPage = new ThankYouPage(page);
  await thankYouPage.verifyPageIsVisible();
  await expect(thankYouPage).toBeTruthy();

  /*
  TODO: Add steps to open gift card url and verifying content and discount code is shown when
  mail client has been implemented for e2e tests
  */
});
