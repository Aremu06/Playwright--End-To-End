import { Probe } from "../../../core/interfaces/probe";
import { expect } from "playwright/test";
import { ProductDto } from "../models/product.dto";
import { ImportedProductEventFinder } from "../../../outbound/product-information/aws/s3/imported-product-event-finder";
import { withSpinner } from "../../../core/utils/spinner";
import { ImportedProductEventBucketReader } from "../../../outbound/product-information/aws/s3/imported-product-event-bucket-reader";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class FetchProductImportedEventFromQaBucket implements Probe<any> {
  constructor(
    private importedProductEventFinder: ImportedProductEventFinder,
    private importedProductEventBucketReader: ImportedProductEventBucketReader,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async verify(requestId: string, productDto: ProductDto): Promise<any> {
    // filtering the bucket for the actual object key
    const args = [productDto.pimId + "_" + requestId];
    const actualObjectKeys =
      (await withSpinner(
        this.importedProductEventFinder.invoke.bind(
          this.importedProductEventFinder,
        ),
        args,
      )) ?? [];
    expect(
      actualObjectKeys,
      "Exactly one imported product JSON object found in the QA S3 bucket",
    ).toHaveLength(1);

    // fetching the actual object
    const productImportedEvent = await withSpinner(
      this.importedProductEventBucketReader.invoke.bind(
        this.importedProductEventBucketReader,
      ),
      actualObjectKeys[0],
    );
    expect(
      productImportedEvent,
      "Actual product JSON object fetched",
    ).toBeDefined();
    return productImportedEvent.json;
  }
}
