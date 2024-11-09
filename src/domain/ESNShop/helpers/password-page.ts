import { type Locator, type Page } from "@playwright/test";

export class PasswordPage {
  readonly page: Page;
  readonly passwordInputField: Locator;

  constructor(page: Page) {
    this.page = page;
    this.passwordInputField = page.locator("#password");
  }

  async goto(countryCode = "") {
    countryCode === ""
      ? await this.page.goto("https://stage.esn.com/password")
      : await this.page.goto(`https://${countryCode}.stage.esn.com/password`);
  }

  async enterPassword() {
    await this.passwordInputField.fill("esn3.0");
    await this.page.keyboard.press("Enter");
  }
}
