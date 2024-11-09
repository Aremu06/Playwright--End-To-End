import { Probe } from "../../../core/interfaces/probe";
import { ProductDto } from "../models/product.dto";
import { ValidateImportAgainstExpectedVariantData } from "./validate-import-against-expected-variant-data";
import { ValidateProductDescription } from "./validate-product-description";
import { ValidateProductTitle } from "./validate-product-title";
import { ValidateProductSeoMetaDescription } from "./validate-product-seo-meta-description";
import { ValidateProductSeoMetaTitle } from "./validate-product-seo-meta-title";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidateImportAgainstExpectedProductData implements Probe<any> {
  async verify(actualProductEvent, productDto: ProductDto): Promise<void> {
    await new ValidateProductDescription().verify(
      actualProductEvent,
      productDto,
    );
    await new ValidateProductTitle().verify(actualProductEvent, productDto);
    await new ValidateProductSeoMetaDescription().verify(
      actualProductEvent,
      productDto,
    );
    await new ValidateProductSeoMetaTitle().verify(
      actualProductEvent,
      productDto,
    );
    await new ValidateImportAgainstExpectedVariantData().verify(
      actualProductEvent,
      productDto,
    );
  }
}
