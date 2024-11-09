import { expect, type Locator, type Page } from "@playwright/test";
import { customerDataDE, customerDataNL } from "../data/customerData";
import { CountryAndLanguageCodes } from "../data/countryAndLanguageCodes";
import {
  germanyShippingCostsInfo,
  netherlandsShippingCostsInfo,
} from "../data/shippingCostsData";
import LoggerFactory from "../../../core/logger/logger.factory";

const logger = LoggerFactory.createLogger("ThankYouPage logger");

export class ThankYouPage {
  readonly page: Page;
  readonly recommendationPopupButton: Locator;
  readonly thankYouText: Locator;
  readonly orderId: Locator;
  readonly depositIcon: Locator;
  readonly totalPriceValue: Locator;
  readonly shippingCost: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    this.page = page;
    this.recommendationPopupButton = page.locator("#DisclosureActivator127");
    this.thankYouText = page
      .locator('//main[@id="checkout-main"] //h2')
      .first();
    this.orderId = page.locator("//h1[@class]");
    this.depositIcon = page.locator('img[src*="deposit"]');
    this.totalPriceValue = page
      .locator('div[role="table"] div[role="cell"]>span[translate="no"]')
      .first();
    this.shippingCost = page
      .locator('div[role="table"] div[role="cell"]>span[translate="no"]')
      .nth(1);
    this.productPrice = page.locator(
      '//div[@role="table"] //div[@role="cell"][4]',
    );
  }

  async verifyPageIsVisible(code = CountryAndLanguageCodes.DE) {
    await this.page.waitForLoadState();
    await this.page.waitForURL("**/thank-you");
    if (await this.recommendationPopupButton.isVisible()) {
      await this.recommendationPopupButton.click();
    }

    const customerData = this.getCustomerDataByCode(code);
    await this.thankYouText.waitFor({ state: "visible", timeout: 60000 });
    const expectedText = this.getThankYouTextByCode(
      code,
      customerData.firstName,
    );
    await expect(this.thankYouText).toHaveText(expectedText, {
      timeout: 60000,
    });
  }

  getCustomerDataByCode(code: string) {
    switch (code) {
      case CountryAndLanguageCodes.NL:
        return customerDataNL;
      case CountryAndLanguageCodes.DE:
      case CountryAndLanguageCodes.EN:
        return customerDataDE;
      default:
        throw new Error(`Unsupported country code: ${code}`);
    }
  }

  getThankYouTextByCode(code: string, firstName: string) {
    switch (code) {
      case CountryAndLanguageCodes.NL:
        return `Bedankt, ${firstName}.`;
      case CountryAndLanguageCodes.EN:
        return `Thank you, ${firstName}!`;
      case CountryAndLanguageCodes.DE:
        return `Danke, ${firstName}!`;
      default:
        throw new Error(`Unsupported country code: ${code}`);
    }
  }

  async verifyAndGetOrderID() {
    await this.page.reload();
    await this.page.waitForURL(/.*\/orders\/\d+.*/);
    await expect(this.orderId).toBeVisible();
    const orderIdText = await this.orderId.textContent();
    if (!orderIdText) {
      throw new Error("Order ID is not found or is empty.");
    }
    const orderID = orderIdText.split(" ")[1];
    logger.info(`The Order Id is = ${orderID}`);
    return orderID;
  }

  async checkForDeposit(depositPrice: string, isVisible: boolean = true) {
    if (isVisible) {
      await expect
        .soft(
          this.depositIcon,
          "The deposit icon should be visible, but it is not.",
        )
        .toBeVisible();
      await expect
        .soft(
          this.page.getByText(depositPrice),
          `The deposit price of ${depositPrice} should be visible, but it is not.`,
        )
        .toBeVisible();
    } else {
      await expect
        .soft(
          this.depositIcon,
          " The deposit icon should not be visible, but it is.",
        )
        .not.toBeVisible();
      await expect
        .soft(
          this.page.getByText(depositPrice),
          `The deposit price of ${depositPrice} should not be visible, but it is.`,
        )
        .not.toBeVisible();
    }
  }

  async getShippingCost() {
    const shippingText = await this.shippingCost.textContent();
    const shippingCost = await this.parsePrice(shippingText!);
    return Number(shippingCost);
  }

  async getCartTotalPrice() {
    const cartTotalText = await this.totalPriceValue.textContent();
    // Extract the number part and replace ',' with '.'
    const cartTotalPrice = await this.parsePrice(cartTotalText!);
    return Number(cartTotalPrice);
  }

  async parsePrice(priceString: string) {
    // Extract the numeric part and replace ',' with '.'
    const numberString = priceString.replace(/[^\d,]/g, "").replace(",", ".");
    return numberString;
  }

  async verifyTotalVsShippingCost(countryCode: string) {
    const cartTotalPrice = await this.getCartTotalPrice();
    const shippingCost = await this.getShippingCost();

    switch (countryCode) {
      case "DE":
        if (cartTotalPrice < germanyShippingCostsInfo.freeFrom) {
          expect
            .soft(
              shippingCost,
              `Expected shipping cost for Germany to be ${germanyShippingCostsInfo.shippingCost} but got ${shippingCost}`,
            )
            .toEqual(germanyShippingCostsInfo.shippingCost);
        } else {
          expect(
            shippingCost,
            `Expected free shipping for Germany but got ${shippingCost}`,
          ).toEqual(0);
        }
        break;
      case "NL":
        if (cartTotalPrice < netherlandsShippingCostsInfo.freeFrom) {
          expect
            .soft(
              shippingCost,
              `Expected shipping cost for Netherlands to be ${netherlandsShippingCostsInfo.shippingCost} but got ${shippingCost}`,
            )
            .toEqual(netherlandsShippingCostsInfo.shippingCost);
        } else {
          expect(
            shippingCost,
            `Expected free shipping for Netherlands but got ${shippingCost}`,
          ).toEqual(0);
        }
        break;
      default:
        throw new Error(`Unsupported country code: ${countryCode}`);
    }
  }

  async validateProductPrice(actualPrice: number) {
    const priceText = await this.productPrice.innerText();
    const productPrice = priceText
      ?.split("\n")[2]
      .split("€")[0]
      .replace(",", ".");
    await expect(
      Number(productPrice),
      "Products prices didnt match with the expected price",
    ).toEqual(actualPrice);
  }
}
