import { expect, type Locator, type Page } from "@playwright/test";
import { visaCreditCard, mastercard } from "../data/paymentData";
import LoggerFactory from "../../../core/logger/logger.factory";

const logger = LoggerFactory.createLogger("PaymentPage logger");

export class PaymentPage {
  readonly page: Page;
  readonly buyButton: Locator;
  readonly checkOrderButton: Locator;
  readonly creditCardExpirationDateInput: Locator;
  readonly creditCardNumberInput: Locator;
  readonly creditCardOwnerNameInput: Locator;
  readonly creditCardPaymentSelector: Locator;
  readonly creditCardSecurityCodeInput: Locator;
  readonly backToCheckoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.buyButton = page.locator('button[type="submit"]').first();
    this.checkOrderButton = page.locator('button[type="submit"]').first();
    this.creditCardExpirationDateInput = page
      .frameLocator('iframe[id^="card-fields-expiry"]')
      .locator("#expiry");
    this.creditCardNumberInput = page
      .frameLocator('iframe[id^="card-fields-number"]')
      .locator("#number");
    this.creditCardPaymentSelector = page.locator("#basic-creditCards");
    this.creditCardOwnerNameInput = page
      .frameLocator('iframe[id^="card-fields-name"]')
      .locator("#name");
    this.creditCardSecurityCodeInput = page
      .frameLocator('iframe[id^="card-fields-verification_value"]')
      .locator("#verification_value");
    this.backToCheckoutButton = page.locator(
      '(//a[contains(@href,"checkouts")])[5]',
    );
  }

  async selectCreditCardPayment() {
    await this.page.waitForLoadState();
    await this.creditCardPaymentSelector.waitFor();
    await this.creditCardPaymentSelector.click();
  }

  async fillCreditCardData(creditcardProvider = "visaCreditCard") {
    await this.buyButton.waitFor({ state: "visible", timeout: 60000 });
    await expect(this.buyButton).toBeEnabled({ timeout: 6000 });
    let creditcardType = visaCreditCard;
    creditcardProvider === "mastercard" ? (creditcardType = mastercard) : "";
    await this.creditCardNumberInput.fill(creditcardType.number);
    await this.creditCardOwnerNameInput.fill(creditcardType.ownerName);
    await this.creditCardExpirationDateInput.fill(
      creditcardType.expirationDate,
    );
    await this.creditCardSecurityCodeInput.fill(creditcardType.securityCode);
  }

  async checkOrder() {
    await this.page.waitForLoadState();
    await this.page.waitForURL("**/payment");
    await this.checkOrderButton.waitFor({ state: "visible" });
    await expect(this.checkOrderButton).toBeEnabled();
    await this.checkOrderButton.click();
  }

  async buyOrder() {
    await this.page.waitForLoadState();
    await this.page.waitForURL("**/review");
    await this.backToCheckoutButton.waitFor({
      state: "visible",
      timeout: 60000,
    });
    await expect(this.backToCheckoutButton).toBeEnabled();
    try {
      await this.buyButton.click({ timeout: 5000 });
    } catch (error) {
      logger.info(
        "Initial click failed. Retrying the click action with force...",
      );
      await this.buyButton.click({ force: true });
    }
  }
}
