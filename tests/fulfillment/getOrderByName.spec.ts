import { test, expect } from "@playwright/test";
import { getOrderByNameQuery } from "../../src/domain/fulfillment/config/query";
import { shopifyHeaders } from "../../src/domain/fulfillment/config/headers";
import { shopifyENV } from "../../src/domain/fulfillment/config/config";

test.describe("Verify Shopify Graphql endpoint for status 200 and get the responseBody", () => {
  test("Shopify Graphql API To Get Order Details", async ({ request }) => {
    const response = await request.post(shopifyENV.graphqlEndpoint as string, {
      headers: shopifyHeaders,
      data: JSON.stringify({
        query: getOrderByNameQuery,
        variables: {
          orderQuery: "name:E4201",
          lineItemsPager: "*",
        },
      }),
    });
    const responseBody = await response.json();
    expect(response.status()).toBe(200);
    expect(responseBody).toHaveProperty("data");
    expect(responseBody.data).toHaveProperty("orders");
    expect(responseBody.data.orders).toHaveProperty("nodes");
  });
});
