import { shippingCosts } from "./shippingCosts";

export const germanyShippingCostsInfo: shippingCosts = {
  country: "Germany",
  countryCode: "DE",
  shippingCost: 4.9, // EUR
  freeFrom: 75, // EUR
  deliveryTime: "2-4 working days",
};

export const netherlandsShippingCostsInfo: shippingCosts = {
  country: "Netherlands",
  countryCode: "NL",
  shippingCost: 4.9, // EUR
  freeFrom: 60, // EUR
  deliveryTime: "2-4 working days",
};

export const switzerlandShippingCostsInfo: shippingCosts = {
  country: "Switzerland",
  countryCode: "CH",
  shippingCost: 11.9, // EUR
  freeFrom: 150, // EUR
  deliveryTime: "2-4 working days",
};
