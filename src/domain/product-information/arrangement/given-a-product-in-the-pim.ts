import { Arrangement } from "../../../core/interfaces/arrangment";
import { ProductDto } from "../models/product.dto";
import { CreateProduct } from "./create-product";
import { RemoveExistingProductsByEan } from "./remove-existing-products-by-ean";
import { ProductFactory } from "./product.factory";
import { Logger } from "winston";

export class GivenAProductInThePim implements Arrangement<ProductDto> {
  constructor(
    private readonly logger: Logger,
    private readonly productFactory: ProductFactory,
    private readonly removeExistingProductsByEan: RemoveExistingProductsByEan,
    private readonly createProduct: CreateProduct,
  ) {}

  async setup(productName: string): Promise<ProductDto> {
    const productDto = await this.productFactory.createProductDto(productName);
    this.logger.debug("Using the following Product DTO: ", productDto);
    await this.removeExistingProductsByEan.setup(productDto);
    await this.createProduct.setup(productDto);

    return productDto;
  }
}
