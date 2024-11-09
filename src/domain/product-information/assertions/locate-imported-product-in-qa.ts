import { ProductDto } from "../models/product.dto";
import { Probe } from "../../../core/interfaces/probe";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class LocateImportedProductInQa implements Probe<any> {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private fetchProductImportedEventFromQaBucket: Probe<any>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async verify(requestId: string, productDto: ProductDto): Promise<any> {
    return await this.fetchProductImportedEventFromQaBucket.verify(
      requestId,
      productDto,
    );
  }
}
