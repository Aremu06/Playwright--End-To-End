import { Probe } from "../../../core/interfaces/probe";
import { ProductDto } from "../models/product.dto";
import { ValidateEan } from "./validate-ean";
import { ValidateSku } from "./validate-sku";
import { ValidateProductDimensions } from "./validate-product-dimensions";
import { ValidateContentSize } from "./validate-content-size";
import { ValidateProductTags } from "./validate-product-tags";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidateImportAgainstExpectedVariantData implements Probe<any> {
  async verify(actualProductEvent, productDto: ProductDto): Promise<void> {
    await new ValidateContentSize().verify(actualProductEvent, productDto);
    await new ValidateEan().verify(actualProductEvent, productDto);
    await new ValidateSku().verify(actualProductEvent, productDto);
    await new ValidateProductDimensions().verify(
      actualProductEvent,
      productDto,
    );
    await new ValidateProductTags().verify(actualProductEvent, productDto);
  }
}
