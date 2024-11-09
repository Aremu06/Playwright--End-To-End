import { test as baseTest } from "@playwright/test";
import { ImportProductAction } from "../actions/import-product.action";
import { SSOAuthStrategy } from "../../../outbound/global/aws/auth/sso-auth.strategy";
import { FetchAllChangesLambdaInvoker } from "../../../outbound/product-information/aws/lambda/fetch-all-changes.lambda-invoker";
import { AkeneoApi } from "../../../outbound/global/akeneo/akeneo-api";
import { RemoveExistingProductsByEan } from "../arrangement/remove-existing-products-by-ean";
import { CreateProduct } from "../arrangement/create-product";
import { FetchProductImportedEventFromQaBucket } from "../assertions/fetch-product-imported-event-from-qa-bucket";
import { ImportedProductEventBucketReader } from "../../../outbound/product-information/aws/s3/imported-product-event-bucket-reader";
import { ImportedProductEventFinder } from "../../../outbound/product-information/aws/s3/imported-product-event-finder";
import { ExtractRequestIdFromImport } from "../assertions/extract-request-id-from-import";
import { LocateImportedProductInQa } from "../assertions/locate-imported-product-in-qa";
import { ImportSingleProductForEsnAction } from "../actions/import-single-product-for-esn.action";
import { GivenAProductInThePim } from "../arrangement/given-a-product-in-the-pim";
import { ProductFactory } from "../arrangement/product.factory";
import { YamlProductConfigurationsLoader } from "../../../outbound/product-information/filesystem/yaml-product-configurations-loader";
import { ValidateImportAgainstExpectedVariantData } from "../assertions/validate-import-against-expected-variant-data";
import { ValidateImportAgainstExpectedProductData } from "../assertions/validate-import-against-expected-product-data";
import LoggerFactory from "../../../core/logger/logger.factory";

const test = baseTest.extend({
  // eslint-disable-next-line no-empty-pattern
  logger: async ({}, use) => {
    await use(LoggerFactory.createLogger("OIC"));
  },

  // eslint-disable-next-line no-empty-pattern
  ssoAuthStrategy: async ({}, use) => {
    await use(new SSOAuthStrategy());
  },

  importProductAction: async ({ logger, ssoAuthStrategy }, use) => {
    await use(
      new ImportProductAction(
        logger,
        new FetchAllChangesLambdaInvoker(logger, ssoAuthStrategy),
      ),
    );
  },

  importSingleProductForEsnAction: async ({ importProductAction }, use) => {
    await use(new ImportSingleProductForEsnAction(importProductAction));
  },

  // eslint-disable-next-line no-empty-pattern
  akeneoApi: async ({}, use) => {
    await use(new AkeneoApi());
  },

  createProduct: async ({ logger, akeneoApi }, use) => {
    await use(new CreateProduct(logger, akeneoApi));
  },

  removeExistingProductsByEAN: async ({ logger, akeneoApi }, use) => {
    await use(new RemoveExistingProductsByEan(logger, akeneoApi));
  },

  importedProductEventBucketReader: async (
    { logger, ssoAuthStrategy },
    use,
  ) => {
    await use(new ImportedProductEventBucketReader(logger, ssoAuthStrategy));
  },

  importedProductEventFinder: async ({ logger, ssoAuthStrategy }, use) => {
    await use(new ImportedProductEventFinder(logger, ssoAuthStrategy));
  },

  fetchProductImportedEventFromQaBucket: async (
    { importedProductEventFinder, importedProductEventBucketReader },
    use,
  ) => {
    await use(
      new FetchProductImportedEventFromQaBucket(
        importedProductEventFinder,
        importedProductEventBucketReader,
      ),
    );
  },

  extractRequestIdFromImport: async ({ logger }, use) => {
    await use(new ExtractRequestIdFromImport(logger));
  },

  locateImportedProductInQA: async (
    { fetchProductImportedEventFromQaBucket },
    use,
  ) => {
    await use(
      new LocateImportedProductInQa(fetchProductImportedEventFromQaBucket),
    );
  },

  // eslint-disable-next-line no-empty-pattern
  validateImportAgainstExpectedVariantData: async ({}, use) => {
    await use(new ValidateImportAgainstExpectedVariantData());
  },

  // eslint-disable-next-line no-empty-pattern
  validateImportAgainstExpectedProductData: async ({}, use) => {
    await use(new ValidateImportAgainstExpectedProductData());
  },

  // eslint-disable-next-line no-empty-pattern
  productConfigurationLoader: async ({}, use) => {
    await use(new YamlProductConfigurationsLoader());
  },

  productFactory: async ({ productConfigurationLoader }, use) => {
    await use(new ProductFactory(productConfigurationLoader));
  },

  givenAProductInThePim: async (
    { productFactory, removeExistingProductsByEAN, createProduct, logger },
    use,
  ) => {
    await use(
      new GivenAProductInThePim(
        logger,
        productFactory,
        removeExistingProductsByEAN,
        createProduct,
      ),
    );
  },
});

export { test };
export { expect } from "@playwright/test";
