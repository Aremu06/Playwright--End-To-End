import { shopifyENV } from "../../fulfillment/config/config";

export const shopifyHeaders = {
  "Content-Type": "application/json",
  "Accept-Encoding": "gzip, deflate, br",
  Accept: "*/*",
  "X-Shopify-Access-Token": shopifyENV.apiToken as string,
};

export const fluentAuthHeaders = {
  "Content-Type": "application/json",
  "Content-Length": "0",
  "Accept-Encoding": "gzip, deflate, br",
  Accept: "*/*",
  "User-Agent": "PostmanRuntime/7.39.0",
  Connection: "keep-alive",
};
