import { expect, type Locator, type Page } from "@playwright/test";
import { customerDataDE, customerDataNL } from "../data/customerData";
import {
  germanyShippingCostsInfo,
  netherlandsShippingCostsInfo,
} from "../data/shippingCostsData";

export class CheckoutPage {
  readonly page: Page;
  readonly applyVoucherButton: Locator;
  readonly billingAddress: Locator;
  readonly billingCity: Locator;
  readonly billingFirstName: Locator;
  readonly billingLastName: Locator;
  readonly billingZipCode: Locator;
  readonly email: Locator;
  readonly firstProductPriceValue: Locator;
  readonly firstProductPriceValueAfterDiscount: Locator;
  readonly goToPaymentButton: Locator;
  readonly goToShippingButton: Locator;
  readonly secondProductPriceValue: Locator;
  readonly shippingAddress: Locator;
  readonly shippingCity: Locator;
  readonly shippingFirstName: Locator;
  readonly shippingLastName: Locator;
  readonly shippingZipCode: Locator;
  readonly totalPriceValue: Locator;
  readonly shippingCost: Locator;
  readonly totalPriceValueAfterDiscount: Locator;
  readonly secondProductPriceValueAfterDiscount: Locator;
  readonly voucherCodeInput: Locator;
  readonly discountApplyButtonSpinner: Locator;
  readonly totalSavings: Locator;
  readonly depositIcon: Locator;
  readonly countryRegionDropDown: Locator;
  readonly backToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.applyVoucherButton = page.locator("(//button[@type='submit'])[3]");
    this.billingAddress = page.locator("(//input[@name='address1'])[1]");
    this.billingCity = page.locator("(//input[@name='city'])[1]");
    this.billingFirstName = page.locator("(//input[@name='firstName'])[1]");
    this.billingLastName = page.locator("(//input[@name='lastName'])[1]");
    this.billingZipCode = page.locator("(//input[@name='postalCode'])[1]");
    this.email = page.locator("#email");
    this.firstProductPriceValue = page.locator(
      '(//div[contains(@aria-labelledby,"ResourceList")]//span[@translate="no"])[1]',
    );
    this.goToPaymentButton = page.locator("(//button[@type='submit'])[1]");
    this.goToShippingButton = page.locator("(//button[@type='submit'])[1]");
    this.secondProductPriceValue = page.locator(
      '(//div[contains(@aria-labelledby,"ResourceList")]//span[@translate="no"])[2]',
    );
    this.shippingAddress = page.locator("#shipping-address1");
    this.shippingCity = page.locator("(//input[@name='city'])[1]");
    this.shippingFirstName = page.locator("(//input[@name='firstName'])[1]");
    this.shippingLastName = page.locator("(//input[@name='lastName'])[1]");
    this.shippingZipCode = page.locator("(//input[@name='postalCode'])[1]");
    this.totalPriceValue = page
      .locator('div[role="table"] div[role="cell"]>span[translate="no"]')
      .first();
    this.shippingCost = page
      .locator('div[role="table"] div[role="cell"]>span[translate="no"]')
      .nth(1);
    this.voucherCodeInput = page.locator("#ReductionsInput0");
    this.discountApplyButtonSpinner = page.locator(
      'svg[aria-label*="Wird bearbeitet"]',
    );
    this.totalSavings = page.locator(
      '(//div[@role="row"]//div[@role="rowheader"])[5]',
    );
    this.firstProductPriceValueAfterDiscount = page
      .locator('div[role="table"] div[role="cell"]>div>del+p')
      .first();
    this.secondProductPriceValueAfterDiscount = page
      .locator('div[role="table"] div[role="cell"]>div>del+p')
      .nth(1);
    this.totalPriceValueAfterDiscount = page.locator(
      'div[role="table"] div[role="cell"]>div strong',
    );
    this.depositIcon = page.locator('img[src*="deposit"]');
    this.countryRegionDropDown = page.locator('select[name="countryCode"]');
    this.backToCheckoutButton = page.locator(
      '(//a[contains(@href,"checkouts")])[4]',
    );
  }

  async fillCustomerShippingData(
    countryCode: string,
    _depositShouldBeHidden?: boolean,
  ) {
    await this.page.waitForLoadState();
    await this.page.waitForTimeout(9000);
    await this.goToShippingButton.waitFor({ state: "visible" });
    let customerData = customerDataDE;
    countryCode === "NL" ? (customerData = customerDataNL) : "";
    if (countryCode) await this.selectCountryRegion(countryCode);
    if (_depositShouldBeHidden) {
      await this.depositIcon.waitFor({ state: "detached", timeout: 60000 });
    }
    await this.email.fill(customerData.email);
    await expect(this.goToShippingButton).toBeEnabled();
    await this.shippingFirstName.fill(customerData.firstName);
    await this.shippingLastName.fill(customerData.lastName);
    await this.shippingAddress.fill(customerData.address);
    await this.shippingZipCode.fill(customerData.zipCode);
    await this.shippingCity.fill(customerData.city);
  }

  async fillCustomerBillingData(countryCode: string) {
    await this.page.waitForLoadState("domcontentloaded");
    let customerData = customerDataDE;
    countryCode === "NL" ? (customerData = customerDataNL) : "";
    await this.email.fill(customerData.email);
    await this.billingFirstName.fill(customerData.firstName);
    await this.billingLastName.fill(customerData.lastName);
    await this.billingAddress.fill(customerData.address);
    await this.billingZipCode.fill(customerData.zipCode);
    await this.billingCity.fill(customerData.city);
  }

  async continueToShipping() {
    await this.page.waitForLoadState();
    await this.goToShippingButton.click();
    await this.page.waitForLoadState();
    await this.page.waitForTimeout(5000);
  }

  async continueToPayment() {
    await this.page.waitForLoadState();
    await this.page.waitForURL("**/shipping");
    await this.backToCheckoutButton.waitFor({
      state: "visible",
      timeout: 60000,
    });
    await expect(this.backToCheckoutButton).toBeEnabled();
    await this.goToPaymentButton.click();
  }

  async fillAndApplyVoucherCode(voucherCode: string) {
    await this.voucherCodeInput.fill(voucherCode);
    await this.applyVoucherButton.click();
    await this.discountApplyButtonSpinner.waitFor({
      state: "detached",
      timeout: 1 * 60 * 1000,
    });
    await this.totalSavings.waitFor({
      state: "visible",
      timeout: 1 * 60 * 1000,
    });
  }

  async grabPricesBeforeDiscount() {
    // We grab the actual price that is shown on the checkout page
    let firstProductPriceValue = await this.firstProductPriceValue.innerText();
    // The price is returned in the format xx,xx . Replace the comma with a dot to enable conversion to a number.
    firstProductPriceValue = await firstProductPriceValue.replace(/,/g, ".");
    // We have to convert the string into an int to be able to calculate with it
    const firstProductPrice = await parseFloat(firstProductPriceValue);

    let secondProductPriceValue =
      await this.secondProductPriceValue.innerText();
    secondProductPriceValue = await secondProductPriceValue.replace(/,/g, ".");
    const secondProductPrice = await parseFloat(secondProductPriceValue);

    let totalPriceValue = await this.totalPriceValue.innerText();
    totalPriceValue = await totalPriceValue.replace(/,/g, ".");
    const totalPrice = await parseFloat(totalPriceValue);

    return [firstProductPrice, secondProductPrice, totalPrice];
  }

  async grabPricesAfterDiscount() {
    // We grab the actual price that is shown on the checkout page
    let firstProductPriceValue =
      await this.firstProductPriceValueAfterDiscount.innerText();
    // The price is returned in the format xx,xx . Replace the comma with a dot to enable conversion to a number.
    firstProductPriceValue = await firstProductPriceValue.replace(/,/g, ".");
    // We have to convert the string into an int to be able to calculate with it
    const firstProductPrice = await parseFloat(firstProductPriceValue);

    let secondProductPriceValue =
      await this.secondProductPriceValueAfterDiscount.innerText();
    secondProductPriceValue = await secondProductPriceValue.replace(/,/g, ".");
    const secondProductPrice = await parseFloat(secondProductPriceValue);

    let totalPriceValue = await this.totalPriceValueAfterDiscount.innerText();
    totalPriceValue = await totalPriceValue.replace(/,/g, ".");
    const totalPrice = await parseFloat(totalPriceValue);

    return [firstProductPrice, secondProductPrice, totalPrice];
  }

  async verifyPrices(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pricesBeforeDiscount: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pricesAfterDiscount: any[],
    voucherPercentage: number,
    shipping?: number,
  ) {
    const shippingCharges = shipping ? shipping : 0;
    const priceOfFirstProductBeforeDiscount = pricesBeforeDiscount[0];
    const priceOfFirstProductAfterDiscount = pricesAfterDiscount[0];
    const priceOfSecondProductBeforeDiscount = pricesBeforeDiscount[1];
    const calculatedPriceOfFirstProductAfterDiscount =
      priceOfFirstProductBeforeDiscount * (1 - voucherPercentage);
    const calculatedPriceOfSecondProductAfterDiscount =
      priceOfSecondProductBeforeDiscount * (1 - voucherPercentage);
    const priceOfSecondProductAfterDiscount = pricesAfterDiscount[1];
    const totalPriceBeforeDiscount = pricesBeforeDiscount[2];
    const calculatedtotalPriceAfterDiscount =
      totalPriceBeforeDiscount * (1 - voucherPercentage);

    const totalPriceAfterDiscount = pricesAfterDiscount[2];

    // To be able to compare the results, we have to round the calculated values to 2 decimals
    // As .toFixed() returns a string, we have to convert the ints coming from grabPrices() to strings again

    /**
     * Use expect.soft in Playwright tests when you want to make many checks and
     *  keep the test running even if some fail, providing a more complete error picture at the end.
     */
    expect
      .soft(priceOfFirstProductAfterDiscount.toFixed(2))
      .toEqual(calculatedPriceOfFirstProductAfterDiscount.toFixed(2));
    expect
      .soft(priceOfSecondProductAfterDiscount.toFixed(2))
      .toEqual(calculatedPriceOfSecondProductAfterDiscount.toFixed(2));
    expect
      .soft(totalPriceAfterDiscount.toFixed(2))
      .toEqual(calculatedtotalPriceAfterDiscount.toFixed(2));

    expect
      .soft(totalPriceAfterDiscount.toFixed(2))
      .toEqual(
        (
          totalPriceBeforeDiscount * (1 - voucherPercentage) +
          shippingCharges
        ).toFixed(2),
      );
  }

  async checkForDeposit(depositPrice: string, isVisible: boolean = true) {
    if (isVisible) {
      await expect(
        this.depositIcon,
        "The deposit icon should be visible, but it is not.",
      ).toBeVisible();

      await expect(
        this.page.getByText(depositPrice),
        `The deposit price of ${depositPrice} should be visible, but it is not.`,
      ).toBeVisible();
    } else {
      await expect(
        this.depositIcon,
        "The deposit icon should not be visible, but it is.",
      ).not.toBeVisible();

      await expect(
        this.page.getByText(depositPrice),
        `The deposit price of ${depositPrice} should not be visible, but it is.`,
      ).not.toBeVisible();
    }
  }

  async selectCountryRegion(value: string) {
    await this.countryRegionDropDown.selectOption(value);
  }

  async getTotalPrice() {
    const cartTotalText = await this.totalPriceValue.textContent();
    const totalPrice = await this.parsePrice(cartTotalText!);
    return Number(totalPrice);
  }

  async getShippingCosts() {
    const shippingText = await this.shippingCost.textContent();
    const shippingCost = await this.parsePrice(shippingText!);
    return Number(shippingCost);
  }

  async parsePrice(priceString: string) {
    // Extract the numeric part and replace ',' with '.'
    const numberString = priceString.replace(/[^\d,]/g, "").replace(",", ".");
    return numberString;
  }

  async verifyProductCostVsShippingCost(countryCode: string) {
    const totalPrice = await this.getTotalPrice();
    const shippingCost = await this.getShippingCosts();
    switch (countryCode) {
      case "DE":
        if (totalPrice < germanyShippingCostsInfo.freeFrom) {
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
        if (totalPrice < netherlandsShippingCostsInfo.freeFrom) {
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

  async validateTheProductPriceAfterDiscount(price: number) {
    const priceTxt =
      await this.firstProductPriceValueAfterDiscount.textContent();
    const priceAfterDiscount = parseFloat(priceTxt.replace(",", "."));
    await expect.soft(priceAfterDiscount).toEqual(price);
  }
}
