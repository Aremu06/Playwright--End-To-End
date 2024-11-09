import { test } from "../../src/domain/product-information/fixtures/import-product-action.fixture";
import { expect } from "playwright/test";

test.beforeEach(async () => {
  test.setTimeout(180000); // three minutes
});

test("Import a variant from PIM (Akeneo) | Workload Event | Channel ESN", async ({
  givenAProductInThePim,
  importSingleProductForEsnAction,
  removeExistingProductsByEAN,
  extractRequestIdFromImport,
  locateImportedProductInQA,
  validateImportAgainstExpectedVariantData,
  logger,
}) => {
  const productData = await givenAProductInThePim.setup(
    "designerWheyStracciatella",
  );
  try {
    const lambdaActionResult =
      await importSingleProductForEsnAction.execute(productData);
    const requestId =
      await extractRequestIdFromImport.verify(lambdaActionResult);
    const actualProductEvent = await locateImportedProductInQA.verify(
      requestId,
      productData,
    );
    validateImportAgainstExpectedVariantData.verify(
      actualProductEvent,
      productData,
    );
  } catch (error) {
    logger.error("An error occurred:", error);
    // eslint-disable-next-line playwright/no-conditional-expect
    expect(error).toBeUndefined();
  } finally {
    await removeExistingProductsByEAN.setup(productData);
  }
});

test("Import a main product without variants from PIM (Akeneo) | Workload Event | Channel ESN", async ({
  removeExistingProductsByEAN,
  givenAProductInThePim,
  importSingleProductForEsnAction,
  extractRequestIdFromImport,
  locateImportedProductInQA,
  validateImportAgainstExpectedProductData,
  logger,
}) => {
  const productData = await givenAProductInThePim.setup("defaultProduct");
  try {
    const lambdaActionResult =
      await importSingleProductForEsnAction.execute(productData);
    const requestId =
      await extractRequestIdFromImport.verify(lambdaActionResult);
    const actualProductEvent = await locateImportedProductInQA.verify(
      requestId,
      productData,
    );
    validateImportAgainstExpectedProductData.verify(
      actualProductEvent,
      productData,
    );
  } catch (error) {
    logger.error("An error occurred:", error);
    // eslint-disable-next-line playwright/no-conditional-expect
    expect(error).toBeUndefined();
  } finally {
    await removeExistingProductsByEAN.setup(productData);
  }
});
