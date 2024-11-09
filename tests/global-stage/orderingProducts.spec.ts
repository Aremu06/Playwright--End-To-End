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
import { buyingProducts } from "../../src/domain/ESNShop/data/productData";
import { getOrderByNameQuery } from "../../src/domain/fulfillment/config/query";
import { shopifyHeaders } from "../../src/domain/fulfillment/config/headers";
import { shopifyENV } from "../../src/domain/fulfillment/config/config";
import { getFluentIDQuery } from "../../src/domain/fulfillment/config/query";
import { fluentENV } from "../../src/domain/fulfillment/config/config";
import { fluentAuthURL } from "../../src/domain/fulfillment/config/config";
import { fluentAuthHeaders } from "../../src/domain/fulfillment/config/headers";

test("Buy a product without a voucher via VISA on DE domain", async ({
  page,
}) => {
  const passwordPage = new PasswordPage(page);
  await passwordPage.goto(CountryAndLanguageCodes.DE);
  await passwordPage.enterPassword();

  const homePage = new HomePage(page);
  await homePage.logoVisible();
  await homePage.searchForProduct(buyingProducts.productNameArray[0]);

  const searchResultPage = new SearchResultPage(page);
  await searchResultPage.openFirstProduct(buyingProducts.productNameArray[0]);

  const productDetailPage = new ProductDetailPage(page);
  await productDetailPage.addToCart();

  const shoppingCartPage = new ShoppingCartPage(page);
  await shoppingCartPage.increaseQuantityBy(1);
  await shoppingCartPage.goToCheckout();

  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.fillCustomerShippingData(CountryAndLanguageCodes.DE);
  await checkoutPage.continueToShipping();
  await checkoutPage.continueToPayment();

  const paymentPage = new PaymentPage(page);
  await paymentPage.selectCreditCardPayment();
  await paymentPage.fillCreditCardData();
  await paymentPage.checkOrder();
  await paymentPage.buyOrder();

  const thankYouPage = new ThankYouPage(page);
  await thankYouPage.verifyPageIsVisible(CountryAndLanguageCodes.DE);
  expect(thankYouPage).toBeTruthy();
  orderId = await thankYouPage.verifyAndGetOrderID();
});

let orderId = "";

test("Shopify Graphql API To Get Order Details", async ({ request }) => {
  const response = await request.post(shopifyENV.graphqlEndpoint as string, {
    headers: shopifyHeaders,
    data: JSON.stringify({
      query: getOrderByNameQuery,
      variables: {
        orderQuery: `name:${orderId}`,
        lineItemsPager: "*",
      },
    }),
  });
  const responseBody = await response.json();
  expect(response.status()).toBe(200);
  expect(responseBody).toHaveProperty("data");
  expect(responseBody.data).toHaveProperty("orders");
  expect(responseBody.data.orders).toHaveProperty("nodes");
});

let fluentAccessToken;

test.describe("Verify Fluent Graphql endpoint for status 200 and get the responseBody", () => {
  test("Fluent Graphql API for Authentication", async ({ request }) => {
    const response = await request.post(fluentAuthURL, {
      headers: fluentAuthHeaders,
      data: JSON.stringify({
        username: fluentENV.fluentUserName,
        password: fluentENV.fluentPassword,
        client_id: fluentENV.fluentAccountClientId,
        client_secret: fluentENV.fluentAccountClientSecret,
        grant_type: "password",
        scope: "api",
      }),
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    fluentAccessToken = responseBody.access_token;
  });

  test("Fluent Graphql API To Get Fluent ID", async ({ request }) => {
    const response = await request.post(fluentENV.fluentEndpoint, {
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "*/*",
        "User-Agent": "PostmanRuntime/7.39.0",
        Connection: "keep-alive",
        Authorization: `Bearer ${fluentAccessToken}`,
      },
      data: JSON.stringify({
        query: getFluentIDQuery,
        variables: {
          ref: `name:${orderId}`,
        },
      }),
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody).toHaveProperty("data");
  });
});
