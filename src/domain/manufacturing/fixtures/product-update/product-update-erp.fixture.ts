import { test as base } from "@playwright/test";
import { VerifyErpProduct } from "../../assertions/verify-erp-product";
import { InforApi } from "../../../../outbound/global/infor/infor-api";

type ProductUpdateErpFixtures = {
  verifyErpProductAgainstExpectedData: VerifyErpProduct;
};

export const test = base.extend<ProductUpdateErpFixtures>({
  verifyErpProductAgainstExpectedData: new VerifyErpProduct(new InforApi()),
});
