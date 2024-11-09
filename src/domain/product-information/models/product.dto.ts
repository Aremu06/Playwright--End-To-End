import { ProductDimensionsDto } from "./product-dimensions.dto";

export class ProductDto {
  constructor(
    public baseProductId: string,
    public parentVendorCode: string | null,
    public productId: string,
    public ean: string,
    public sku: string,
    public pimId: string,
    public title: string,
    public description: string,
    public seoTitle: string,
    public seoDescription: string,
    public contentSize: string,
    public productDimensions: ProductDimensionsDto,
    public tags: string[],
  ) {}
}
