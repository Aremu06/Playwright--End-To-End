import { test, expect } from "@playwright/test";
import { getMandatoryFields } from "../../src/domain/fulfillment/config/query";
import { fluentENV } from "../../src/domain/fulfillment/config/config";
import { fluentAuthURL } from "../../src/domain/fulfillment/config/config";
import { fluentAuthHeaders } from "../../src/domain/fulfillment/config/headers";

let fluentAccessToken;

test.describe("Verify Fluent Graphql endpoint for status 200 and get the responseBody", () => {
  test.beforeAll(
    "Fluent Graphql API for Authentication",
    async ({ request }) => {
      const response = await request.post(fluentAuthURL, {
        headers: fluentAuthHeaders,
        data: JSON.stringify({
          username: fluentENV.fluentUserName,
          password: fluentENV.fluentPassword,
          client_id: fluentENV.fluentAccountClientId,
          client_secret: fluentENV.fluentAccountClientSecret,
          grant_type: "password",
          scope: "api",
        }),
      });
      const responseBody = await response.json();
      expect(response.status()).toBe(200);
      fluentAccessToken = responseBody.access_token;
    },
  );

  test("Fluent Graphql API To Get Mandantory Metafields", async ({
    request,
  }) => {
    const response = await request.post(fluentENV.fluentEndpoint as string, {
      headers: {
        "Content-Type": "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        Accept: "*/*",
        "User-Agent": "PostmanRuntime/7.39.0",
        Connection: "keep-alive",
        Authorization: `Bearer ${fluentAccessToken}`,
      },
      data: JSON.stringify({
        query: getMandatoryFields,
        variables: {
          orderId: "5029086",
        },
      }),
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody).toHaveProperty("data");
  });
});
