// Export the environment variables
export const shopifyENV = {
  graphqlEndpoint: process.env.SHOPIFY_ESN_GRAPHQL_URL,
  apiToken: process.env.SHOPIFY_ESN_ACCESS_TOKEN,
};

export const fluentENV = {
  fluentAuthEndpoint: process.env.FLUENT_AUTH_URL,
  fluentEndpoint: process.env.FLUENT_BASE_URL,
  fluentUserName: process.env.FLUENT_USER_NAME,
  fluentPassword: process.env.FLUENT_PASSWORD,
  fluentAccountHost: process.env.FLUENT_ACCOUNT_HOST,
  fluentAccountClientId: process.env.FLUENT_ACCOUNT_CLIENT_ID,
  fluentAccountClientSecret: process.env.FLUENT_ACCOUNT_CLIENT_SECRET,
  fluentAccountUserName: process.env.FLUENT_ACCOUNT_USER_NAME,
  fluentVCStockAllocation: process.env.FLUENT_VC_STOCK_ALLOCATION,
};

export const fluentAuthURL = `${fluentENV.fluentAuthEndpoint}/oauth/token?username=${encodeURIComponent(fluentENV.fluentUserName)}&password=${encodeURIComponent(fluentENV.fluentPassword)}&client_id=${encodeURIComponent(fluentENV.fluentAccountClientId)}&client_secret=${encodeURIComponent(fluentENV.fluentAccountClientSecret)}&scope=api&grant_type=password`;
