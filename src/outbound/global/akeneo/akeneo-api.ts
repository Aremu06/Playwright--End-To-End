import type { APIRequestContext } from "@playwright/test";
import { request as playwrightRequestFactory } from "@playwright/test";
import { btoa } from "buffer";
import { AkeneoApiError } from "./akeneo-api-error";

/**
 * This class is an abstraction of Akeneo API and can be used for
 * - CRUD products and, if needed, other entities
 * - Cleanup
 *
 * Note: Underlying APIRequestContext can be accessed via "request" property to directly fire requests (get, post, patch, ...)
 *
 * Further details on creating Playwright fixtures can be found here: https://playwright.dev/docs/test-fixtures#creating-a-fixture
 */
export class AkeneoApi {
  private readonly API_VERSION = "v1";

  public request: APIRequestContext;
  private readonly baseURL: string;
  private token: string;
  private createdUuids: string[];

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly username: string;
  private readonly password: string;

  constructor() {
    this.baseURL = process.env["AKENEO_BASE_URI"];
    this.clientId = process.env["AKENEO_CLIENT_ID"];
    this.clientSecret = process.env["AKENEO_CLIENT_SECRET"];
    this.username = process.env["AKENEO_USER_NAME"];
    this.password = process.env["AKENEO_PASSWORD"];
  }

  async auth() {
    // early return
    if (this.token != null) {
      return;
    }

    this.request = await playwrightRequestFactory.newContext({
      baseURL: this.baseURL,
    });

    const BASE_64_AUTH = btoa(`${this.clientId}:${this.clientSecret}`);
    const authResponse = await this.request.post("/api/oauth/v1/token", {
      headers: {
        Authorization: `Basic ${BASE_64_AUTH}`,
      },
      data: {
        grant_type: "password",
        username: this.username,
        password: this.password,
      },
    });

    if (!authResponse.ok()) {
      throw new AkeneoApiError(
        "Akeneo API: Authorization failed with status " + authResponse.status(),
        authResponse.url(),
        await authResponse.text(),
      );
    }

    this.token = (await authResponse.json())["access_token"];

    // Update request context to use
    this.request = await playwrightRequestFactory.newContext({
      baseURL: this.baseURL + `/api/rest/${this.API_VERSION}/`,
      extraHTTPHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  async getProducts() {
    await this.auth();

    // TODO: Add filtering, pagination, ...
    // see https://api.akeneo.com/api-reference.html#get_products
    return this.request.get("./products");
  }

  async getProductByIdentifier(identifier: string) {
    await this.auth();
    return this.request.get(`./products/${identifier}`);
  }

  async findProductByEan(ean: string) {
    await this.auth();
    return this.request.get(
      `./products-uuid?search={"ean":[{"operator":"IN","value":["${ean}"]}]}`,
    );
  }

  async getProductByUuid(uuid: string) {
    await this.auth();
    return this.request.get(`./products-uuid/${uuid}`);
  }

  async getProductModelByCode(code: string) {
    await this.auth();
    return this.request.get(`./product-models/${code}`);
  }

  async getProductModels() {
    await this.auth();
    return this.request.get(
      `./product-models?search={"family":[{"operator":"IN","value":["Proteinpulver"]}]}`,
    );
  }

  async createProduct(data: object) {
    await this.auth();
    // TODO: Check answer and add uuid of created product to, like this:
    // this.createdUuids.push((await (await createdProductAnswer).json())['uuid'])

    return this.request.post("./products-uuid", {
      data: data,
    });
  }

  async deleteProductByIdentifier(identifier: string) {
    await this.auth();
    return this.request.delete(`./products-uuid/${identifier}`);
  }

  async deleteProductByUuid(uuid: string) {
    await this.auth();
    return this.request.delete(`./products-uuid/${uuid}`);
  }

  async cleanup() {
    this.createdUuids.forEach((uuid) => {
      this.deleteProductByUuid(uuid);
    });
  }
}
