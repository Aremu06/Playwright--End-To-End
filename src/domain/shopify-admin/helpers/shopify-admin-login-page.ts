import { type Locator, type Page } from "@playwright/test";
import { get_totp_generated } from "../lib/OTPAuth";

export class ShopifyAdminLoginPage {
  readonly page: Page;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly continueWithEmailButton: Locator;
  readonly loginButton: Locator;
  readonly authenticationCodeField: Locator;
  readonly authCodeloginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailField = page.getByLabel("Email");
    this.passwordField = page.getByLabel("Password", { exact: true });
    this.continueWithEmailButton = page.getByRole("button", {
      name: "Continue with email",
    });
    this.loginButton = page.locator('//button[@type="submit"]');
    this.authenticationCodeField = page.locator("#account_tfa_code");
    this.authCodeloginButton = page.getByRole("button", { name: "Log in" });
  }

  async goto(url) {
    await this.page.goto(url);
  }

  async loginToShopifyAdminPortal(email: string, password: string) {
    await this.emailField.fill(email);
    await this.continueWithEmailButton.waitFor();
    await this.continueWithEmailButton.click();
    await this.passwordField.fill(password);
    await this.loginButton.waitFor();
    await this.loginButton.click();
    await this.authenticationCodeField.fill(await get_totp_generated());
    await this.authCodeloginButton.click();
    await this.page.waitForLoadState();
  }
}
