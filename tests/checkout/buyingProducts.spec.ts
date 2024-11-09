import { test } from "@playwright/test";
import { CheckoutPage } from "../../src/domain/checkout/helpers/checkout-page";
import { HomePage } from "../../src/domain/ESNShop/helpers/home-page";
import { PasswordPage } from "../../src/domain/ESNShop/helpers/password-page";
import { PaymentPage } from "../../src/domain/checkout/helpers/payment-page";
import { ProductDetailPage } from "../../src/domain/ESNShop/helpers/product-detail-page";
import { SearchResultPage } from "../../src/domain/ESNShop/helpers/search-result-page";
import { ThankYouPage } from "../../src/domain/checkout/helpers/thank-you.page";
import { CountryAndLanguageCodes } from "../../src/domain/checkout/data/countryAndLanguageCodes";
import { ShoppingCartPage } from "../../src/domain/ESNShop/helpers/shopping-cart-page";
import { buyingProducts } from "../../src/domain/ESNShop/data/productData";

// eslint-disable-next-line playwright/expect-expect
test("Buy a product without a voucher via VISA on NL domain", async ({
  page,
}) => {
  const passwordPage = new PasswordPage(page);
  await passwordPage.goto(CountryAndLanguageCodes.NL);
  await passwordPage.enterPassword();

  const homePage = new HomePage(page);
  await homePage.logoVisible();
  await homePage.searchForProduct(buyingProducts.firstProductName);

  const searchResultPage = new SearchResultPage(page);
  await searchResultPage.openFirstProduct(buyingProducts.firstProductName);

  const productDetailPage = new ProductDetailPage(page);
  await productDetailPage.addToCart();

  const shoppingCartPage = new ShoppingCartPage(page);
  await shoppingCartPage.increaseQuantityBy(1);
  await shoppingCartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillCustomerShippingData(CountryAndLanguageCodes.NL);
  await checkoutPage.continueToShipping();
  await checkoutPage.continueToPayment();

  const paymentPage = new PaymentPage(page);
  await paymentPage.selectCreditCardPayment();
  await paymentPage.fillCreditCardData();
  await paymentPage.checkOrder();
  await paymentPage.buyOrder();

  const thankYouPage = new ThankYouPage(page);
  await thankYouPage.verifyPageIsVisible(CountryAndLanguageCodes.NL);
});

// eslint-disable-next-line playwright/expect-expect
test("Buy two products with influencer code LOVEQA via Mastercard on DE domain and verify that the discount is only applied to the product it is valid for.", async ({
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

  await homePage.goto();
  await homePage.searchForProduct(buyingProducts.productNameArray[0]);
  await searchResultPage.openFirstProduct(buyingProducts.productNameArray[0]);
  await productDetailPage.addToCart();
  await shoppingCartPage.increaseQuantityBy(2);
  await shoppingCartPage.clickCloseCartIcon();

  await homePage.searchForProduct(buyingProducts.productNameArray[1]);
  await searchResultPage.openFirstProduct(buyingProducts.productNameArray[1]);
  await productDetailPage.addToCart();
  await shoppingCartPage.increaseQuantityBy(2);
  await shoppingCartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillCustomerShippingData(CountryAndLanguageCodes.DE);
  const pricesBeforeDiscount = await checkoutPage.grabPricesBeforeDiscount();
  await checkoutPage.fillAndApplyVoucherCode("LOVEQA");
  const pricesAfterDiscount = await checkoutPage.grabPricesAfterDiscount();
  await checkoutPage.verifyPrices(
    pricesBeforeDiscount,
    pricesAfterDiscount,
    0.2,
  );

  await checkoutPage.continueToShipping();
  await checkoutPage.continueToPayment();

  const paymentPage = new PaymentPage(page);
  await paymentPage.selectCreditCardPayment();
  await paymentPage.fillCreditCardData("mastercard");
  await paymentPage.checkOrder();
  await paymentPage.buyOrder();

  const thankYouPage = new ThankYouPage(page);
  await thankYouPage.verifyPageIsVisible();
});
