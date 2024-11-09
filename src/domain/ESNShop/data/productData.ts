import {
  buyingProductData,
  depositProductData,
  shippingProductData,
} from "./product";

export const depositProduct: depositProductData = {
  name: "Crank Energy",
  deposit: "0,25", //EUR
};

export const shippingCostProducts: shippingProductData = {
  firstProductName: "Test Automation Product2 Do not use",
  secondProductName: "Test Automation Product3 Do not use",
};

export const buyingProducts: buyingProductData = {
  firstProductName: "Test Automation Product1 Do not use",
  productNameArray: [
    "Test Automation Product2 Do not use",
    "Test Automation Product1 Do not use",
  ],
};
