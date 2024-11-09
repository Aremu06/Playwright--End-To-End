import { test } from "../../../src/domain/manufacturing/fixtures/product-update/product-update-erp.fixture";
import { Product } from "../../../src/domain/manufacturing/product";

// eslint-disable-next-line playwright/expect-expect
test("Publish product update and consume it in ERP", async ({
  verifyErpProductAgainstExpectedData,
}): Promise<void> => {
  const erpProduct: Product = new Product("R00441");

  await verifyErpProductAgainstExpectedData.verify(erpProduct);
});
