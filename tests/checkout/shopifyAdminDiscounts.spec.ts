import { test, expect } from "@playwright/test";
import { ShopifyAdminLoginPage } from "../../src/domain/shopify-admin/helpers/shopify-admin-login-page";
import dotenv from "dotenv";
import path from "path";
import { ShopifyAdminHomePage } from "../../src/domain/shopify-admin/helpers/shopify-admin-home-page";
import { ShopifyAdminDiscountsPage } from "../../src/domain/shopify-admin/helpers/shopify-admin-discounts-page";
import { publicCampaign } from "../../src/domain/shopify-admin/data/publicCampaignData";
import { ShopifyAdminTqgPage } from "../../src/domain/shopify-admin/helpers/shopify-admin-tqg-page";
import { CheckoutPage } from "../../src/domain/checkout/helpers/checkout-page";
import { HomePage } from "../../src/domain/ESNShop/helpers/home-page";
import { PasswordPage } from "../../src/domain/ESNShop/helpers/password-page";
import { PaymentPage } from "../../src/domain/checkout/helpers/payment-page";
import { ProductDetailPage } from "../../src/domain/ESNShop/helpers/product-detail-page";
import { SearchResultPage } from "../../src/domain/ESNShop/helpers/search-result-page";
import { ThankYouPage } from "../../src/domain/checkout/helpers/thank-you.page";
import { CountryAndLanguageCodes } from "../../src/domain/checkout/data/countryAndLanguageCodes";
import { ShoppingCartPage } from "../../src/domain/ESNShop/helpers/shopping-cart-page";

dotenv.config({
  path: [path.resolve(".env"), path.resolve(".env.local")],
  override: true,
});

let browserContext;

test.beforeAll(async ({ browser }) => {
  browserContext = await browser.newContext();
});

test.afterAll(async () => {
  await browserContext.close();
});

test.describe.serial("shopify admin public campaign E2E flow", () => {
  // eslint-disable-next-line playwright/expect-expect, playwright/no-skipped-test
  test("login to shopify admin and create a public campaign", async ({
    page,
  }) => {
    const shopifyAdminLoginPage = new ShopifyAdminLoginPage(page);
    await shopifyAdminLoginPage.goto(process.env.SHOPIFY_URL);
    await shopifyAdminLoginPage.loginToShopifyAdminPortal(
      process.env.SHOPIFY_EMAIL,
      process.env.SHOPIFY_PASSWORD,
    );

    const shopifyAdminHomePage = new ShopifyAdminHomePage(page);
    await shopifyAdminHomePage.clickOnDiscounts();

    const shopifyAdminDiscountsPage = new ShopifyAdminDiscountsPage(page);
    await shopifyAdminDiscountsPage.selectCampaignTab();
    await shopifyAdminDiscountsPage.checkSelectAllBox();
    await shopifyAdminDiscountsPage.deactivateDiscounts();
    await shopifyAdminDiscountsPage.createNewPublicCampaign(
      publicCampaign.initialTitle,
      publicCampaign.code,
      publicCampaign.discountPercentage,
      publicCampaign.productGroupSelection,
      publicCampaign.selectCollection,
    );
    await shopifyAdminDiscountsPage.clickOnTqgDiscountsLink();

    const shopifyAdminTqgPage = new ShopifyAdminTqgPage(page);
    await shopifyAdminTqgPage.validateCampaignName(publicCampaign.initialTitle);
    await shopifyAdminTqgPage.clickOnUpdateDiscountsMetaFields();
    await shopifyAdminTqgPage.clickUpdateMetafieldButton();
    await expect(shopifyAdminTqgPage).toBeTruthy();
  });
  // eslint-disable-next-line playwright/expect-expect, playwright/no-skipped-test
  test.skip("Complete order using the new public campaign created", async ({
    page,
  }) => {
    const passwordPage = new PasswordPage(page);
    await passwordPage.goto();
    await passwordPage.enterPassword();

    const homePage = new HomePage(page);
    await homePage.logoVisible();
    await homePage.goto();
    await homePage.searchForProduct(publicCampaign.productName);

    const searchResultPage = new SearchResultPage(page);
    await searchResultPage.openFirstProduct(publicCampaign.productName);

    const productDetailPage = new ProductDetailPage(page);
    await productDetailPage.validateTheCouponCode();
    await productDetailPage.addToCart();

    const shoppingCartPage = new ShoppingCartPage(page);
    const priceBeforeDiscount = await shoppingCartPage.getPriceBeforDiscount();
    await shoppingCartPage.applyTheCouponCode();
    const priceAfterDiscount = await shoppingCartPage.getPriceAfterDiscount();
    await shoppingCartPage.validateTheDiscountPercentage(
      priceBeforeDiscount,
      priceAfterDiscount,
    );
    await shoppingCartPage.goToCheckout();

    const checkoutPage = new CheckoutPage(page);
    await checkoutPage.fillCustomerShippingData(CountryAndLanguageCodes.DE);
    await checkoutPage.validateTheProductPriceAfterDiscount(priceAfterDiscount);
    await checkoutPage.continueToShipping();
    await checkoutPage.continueToPayment();

    const paymentPage = new PaymentPage(page);
    await paymentPage.selectCreditCardPayment();
    await paymentPage.fillCreditCardData("mastercard");
    await paymentPage.checkOrder();
    await paymentPage.buyOrder();

    const thankYouPage = new ThankYouPage(page);
    await thankYouPage.verifyPageIsVisible();
    await thankYouPage.validateProductPrice(priceAfterDiscount);
    await expect(thankYouPage).toBeTruthy();
  });
});
