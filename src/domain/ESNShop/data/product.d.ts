export type depositProductData = {
  name: string;
  deposit: string;
};

export type shippingProductData = {
  firstProductName: string;
  secondProductName: string;
};

export type buyingProductData = {
  firstProductName: string;
  productNameArray: string[];
};

export enum productSearchKeyword {
  sample1 = "protein",
}
