import { test, expect } from "@playwright/test";
import { HomePage } from "../../src/domain/ESNShop/helpers/home-page";
import { PasswordPage } from "../../src/domain/ESNShop/helpers/password-page";
import { PaymentPage } from "../../src/domain/checkout/helpers/payment-page";
import { ProductDetailPage } from "../../src/domain/ESNShop/helpers/product-detail-page";
import { SearchResultPage } from "../../src/domain/ESNShop/helpers/search-result-page";
import { ThankYouPage } from "../../src/domain/checkout/helpers/thank-you.page";
import { CountryAndLanguageCodes } from "../../src/domain/checkout/data/countryAndLanguageCodes";
import { ShoppingCartPage } from "../../src/domain/ESNShop/helpers/shopping-cart-page";
import { shippingCostProducts } from "../../src/domain/ESNShop/data/productData";
import { CheckoutPage } from "../../src/domain/checkout/helpers/checkout-page";
const testCases = [
  {
    domain: CountryAndLanguageCodes.NL,
    productName: shippingCostProducts.firstProductName,
    increaseQuantity: 0,
  },
  {
    domain: CountryAndLanguageCodes.DE,
    productName: shippingCostProducts.secondProductName,
    increaseQuantity: 1,
  },
];

testCases.forEach(({ domain, productName, increaseQuantity }) => {
  test(`Verify shipping costs on cart, checkout and thankyou page on ${domain} domain`, async ({
    page,
  }) => {
    const passwordPage = new PasswordPage(page);
    await passwordPage.goto(domain);
    await passwordPage.enterPassword();

    const homePage = new HomePage(page);
    await homePage.logoVisible();
    await homePage.searchForProduct(productName);

    const searchResultPage = new SearchResultPage(page);
    await searchResultPage.openFirstProduct(productName);

    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.addToCart();

    const shoppingCartPage = new ShoppingCartPage(page);
    await shoppingCartPage.increaseQuantityBy(increaseQuantity);
    await shoppingCartPage.verifyTotalVsShippingCost(domain);
    await shoppingCartPage.goToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillCustomerShippingData(domain);
    await checkoutPage.continueToShipping();
    await checkoutPage.verifyProductCostVsShippingCost(domain);
    await checkoutPage.continueToPayment();

    const paymentPage = new PaymentPage(page);
    await paymentPage.selectCreditCardPayment();
    await paymentPage.fillCreditCardData();
    await paymentPage.checkOrder();
    await paymentPage.buyOrder();

    const thankYouPage = new ThankYouPage(page);
    await thankYouPage.verifyPageIsVisible(domain);
    await thankYouPage.verifyTotalVsShippingCost(domain);
    expect(thankYouPage).toBeTruthy();
  });
});
