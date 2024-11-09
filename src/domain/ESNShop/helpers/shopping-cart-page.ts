import { expect, type Locator, type Page } from "@playwright/test";
import {
  germanyShippingCostsInfo,
  netherlandsShippingCostsInfo,
} from "../../checkout/data/shippingCostsData";
import { publicCampaign } from "../../shopify-admin/data/publicCampaignData";
import LoggerFactory from "../../../core/logger/logger.factory";

const logger = LoggerFactory.createLogger("shoppingCartPage logger");

export class ShoppingCartPage {
  readonly page: Page;
  readonly closeIcon: Locator;
  readonly goToCheckoutButton: Locator;
  readonly increaseQuantityButton: Locator;
  readonly cartIcon: Locator;
  readonly cartWindow: Locator;
  readonly cartHeader: Locator;
  readonly cartDiscountTextBox: Locator;
  readonly cartDiscountApplyBtn: Locator;
  readonly cartCloseBtn: Locator;
  readonly cartTotalPrice: Locator;
  readonly shippingCost: Locator;
  readonly discountCodeInput: Locator;
  readonly discountCodeClear: Locator;
  readonly applyButton: Locator;
  readonly greenCheckIcon: Locator;
  readonly priceBeforeDiscount: Locator;
  readonly shippingCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.closeIcon = page.locator(".overlay__close.icon-button").first();
    this.goToCheckoutButton = page.locator(".button[name='checkout']");
    this.increaseQuantityButton = page.locator(
      "(//button[@class='quantity-selector__button'])[2]",
    );
    this.cartIcon = page.locator(
      "//a[@class='site-header__cart icon-button']//*[name()='svg']",
    );
    this.cartWindow = page.locator(
      "//*[contains(@class,'overlay__container cart-drawer-overlay__container')]",
    );
    this.cartHeader = page.locator("//*[@class='cart-drawer__header-top']/p");
    this.cartDiscountTextBox = page.locator(
      "//*[@class='discount-code__input-container']",
    );
    this.cartDiscountApplyBtn = page.locator(
      "//*[@name='discount-code-submit']/span",
    );
    this.cartTotalPrice = page.locator(
      '//div[@class="cart-summary__total"] //p[2]',
    );
    this.shippingCost = page.locator(
      "//p[contains(@class,'cart-thresholds__text-bottom')]",
    );
    this.discountCodeInput = page.locator("#discount-code-input");
    this.discountCodeClear = page.locator(".discount-code__clear");
    this.applyButton = page.locator('//button[@name="discount-code-submit"]');
    this.greenCheckIcon = page.locator(".discount-code__state-icon");
    this.priceBeforeDiscount = page.locator(
      '//p[@class="line-item__price-container"]',
    );
    this.shippingCart = page.locator('//div[@class="cart-drawer__header"]');
  }

  async clickCloseCartIcon() {
    await this.closeIcon.click();
    await expect.soft(this.cartWindow).toBeHidden();
  }

  async increaseQuantityBy(count: number) {
    await this.page.waitForLoadState();
    for (let index = 0; index < count; index++) {
      await this.increaseQuantityButton.click();
    }
  }

  async goToCheckout() {
    await this.goToCheckoutButton.click();
  }

  async clickCartIcon() {
    await this.cartIcon.isVisible();
    await this.cartIcon.click();
  }

  async verifyCartWindow() {
    await this.clickCartIcon();
    await expect.soft(this.cartWindow).toBeVisible();
    const cartTitle = await this.cartHeader.innerText();
    await expect.soft(cartTitle.toString()).toBe("Warenkorb");
    await expect.soft(this.cartDiscountTextBox).toBeVisible();
    await expect.soft(this.cartDiscountApplyBtn).toBeVisible();
  }

  async getShippingCost() {
    const shippingText = await this.shippingCost.textContent();
    const shippingCost = shippingText?.split("€")[1].replace(",", ".");
    return Number(shippingCost);
  }

  async getCartTotalPrice() {
    const cartTotalText = await this.cartTotalPrice.textContent();
    // Extract the number part and replace ',' with '.'
    const cartTotalPrice = cartTotalText
      ?.replace(/[^0-9,]/g, "")
      .replace(",", ".");
    return Number(cartTotalPrice);
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
          expect
            .soft(
              shippingCost,
              `Expected free shipping for Germany but got ${shippingCost}`,
            )
            .toEqual(0);
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
          expect
            .soft(
              shippingCost,
              `Expected free shipping for Netherlands but got ${shippingCost}`,
            )
            .toEqual(0);
        }
        break;
      default:
        throw new Error(`Unsupported country code: ${countryCode}`);
    }
  }

  async applyTheCouponCode() {
    await this.discountCodeInput.fill(publicCampaign.code);
    await this.discountCodeClear.waitFor({ state: "visible", timeout: 5000 });
    await this.applyButton.click();
    try {
      await this.greenCheckIcon.waitFor({ state: "visible", timeout: 30000 });
    } catch (error) {
      logger.error(
        `Coupon "${publicCampaign.code}" has failed to apply`,
        error,
      );
    }
  }

  async getPriceBeforDiscount() {
    await this.shippingCart.waitFor({ state: "visible", timeout: 30000 });
    const priceBeforeDiscountTxt = await this.priceBeforeDiscount.textContent();
    const priceBeforeDiscount = priceBeforeDiscountTxt
      ?.split("€")[1]
      .replace(",", ".");
    return Number(priceBeforeDiscount);
  }

  async getPriceAfterDiscount() {
    const priceAfterDiscountTxt = await this.priceBeforeDiscount.innerText();
    const priceAfterDiscount = priceAfterDiscountTxt
      ?.split("\n")[0]
      .split("€")[1]
      .replace(",", ".");
    return Number(priceAfterDiscount);
  }

  async validateTheDiscountPercentage(
    beforeDiscountPrice: number,
    afterDiscountPrice: number,
  ) {
    const percentage = Math.floor(
      ((beforeDiscountPrice - afterDiscountPrice) / beforeDiscountPrice) * 100,
    );
    await expect
      .soft(
        percentage,
        `The actual percentage ${percentage} doesn't equal the expected percentage ${publicCampaign.discountPercentage}`,
      )
      .toEqual(Number(publicCampaign.discountPercentage));
  }
}
