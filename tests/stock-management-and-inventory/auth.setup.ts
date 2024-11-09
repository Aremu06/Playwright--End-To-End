import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";
const Url = process.env.SMUI_BASE_URL!;
const username = process.env.SMUI_MS_USERNAME!;
const password = process.env.SMUI_MS_PASSWORD!;

setup("authenticate", async ({ page }) => {
  setup.skip(
    !username || !password,
    "SMUI_MS_USERNAME and SMUI_MS_PASSWORD environment variables must be set",
  );
  setup.setTimeout(120000);
  // Perform authentication steps.
  await page.goto(Url);
  await page.getByText("Anmelden", { exact: true }).click();
  await page.getByPlaceholder("Email, phone, or Skype").fill(username);
  await page.getByRole("button", { name: "Next" }).click();
  // eslint-disable-next-line playwright/no-standalone-expect
  await expect(page.getByText("Enter password", { exact: true })).toBeVisible();
  await page.getByPlaceholder("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(Url);
  // Alternatively, you can wait until the page reaches a state where all cookies are set.
  // eslint-disable-next-line playwright/no-standalone-expect
  await expect(page.getByText("Logout", { exact: true })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});
