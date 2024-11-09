import type { APIRequestContext, APIResponse } from "@playwright/test";
import { request as playwrightRequestFactory } from "@playwright/test";
import { btoa } from "buffer";
import { InforItem } from "./infor-item";

export class InforApi {
  private request: APIRequestContext;

  private readonly authBaseUrl: string;

  private readonly basicAuthUsername: string;
  private readonly basicAuthPassword: string;

  private readonly authUsername: string;
  private readonly authPassword: string;

  private readonly companyCode: string;

  private token: string;

  private readonly apiBaseUrl: string;

  constructor() {
    this.authBaseUrl = process.env["INFOR_OAUTH_BASE_URL"];

    this.basicAuthUsername = process.env["INFOR_BASIC_AUTH_USERNAME"];
    this.basicAuthPassword = process.env["INFOR_BASIC_AUTH_PASSWORD"];

    this.authUsername = process.env["INFOR_OAUTH_USERNAME"];
    this.authPassword = process.env["INFOR_OAUTH_PASSWORD"];

    this.apiBaseUrl = process.env["INFOR_API_BASE_URL"];

    this.companyCode = process.env["INFOR_COMPANY_CODE"];
  }

  async setRequestContext(): Promise<void> {
    if (this.token != null) {
      return;
    }

    const request: APIRequestContext =
      await playwrightRequestFactory.newContext({
        baseURL: this.authBaseUrl,
      });

    const BASE_64_AUTH = btoa(
      `${this.basicAuthUsername}:${this.basicAuthPassword}`,
    );

    const authResponse: APIResponse = await request.post(this.authBaseUrl, {
      headers: {
        Authorization: `Basic ${BASE_64_AUTH}`,
      },
      form: {
        grant_type: "password",
        username: this.authUsername,
        password: this.authPassword,
      },
    });

    if (!authResponse.ok()) {
      throw new Error(await authResponse.text());
    }

    this.token = (await authResponse.json())["access_token"];

    this.request = await playwrightRequestFactory.newContext({
      baseURL: this.apiBaseUrl,
      extraHTTPHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async getItemBySku(sku: string): Promise<InforItem> {
    await this.setRequestContext();

    const getItemResponse: APIResponse = await this.request.get(
      "M3/m3api-rest/v2/execute/MMS200MI/GetItmBasic",
      {
        params: {
          ITNO: sku,
          CONO: this.companyCode,
        },
      },
    );

    if (!getItemResponse.ok()) {
      throw new Error(await getItemResponse.text());
    }

    const itemFromRequest = (await getItemResponse.json())["results"][0][
      "records"
    ][0];

    if (!itemFromRequest) {
      throw new Error("Item for sku: " + sku + " was not found");
    }

    return new InforItem(itemFromRequest["ITNO"]);
  }
}
