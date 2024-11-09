import { ProductConfigurationLoader } from "../interfaces/product-configuration-loader";
import { ProductDto } from "../models/product.dto";
import { v4 as uuidv4 } from "uuid";
import { ProductDimensionsDto } from "../models/product-dimensions.dto";
import { CentimeterDto } from "../models/centimeter.dto";
import { GramDto } from "../models/gram.dto";
import { ProductConfigurations, ProductConfig } from "../models/product-config";
import _ from "lodash";

export class ProductFactory {
  constructor(
    private readonly configurationLoader: ProductConfigurationLoader,
  ) {}

  public async createProductDto(productName: string): Promise<ProductDto> {
    const configs: ProductConfigurations =
      await this.configurationLoader.loadProductConfigurations();
    let productConfig = { ...configs.products["defaultProduct"] };
    if (configs.products[productName]) {
      const specificConfig = configs.products[productName];
      if (specificConfig.inheritsFrom) {
        const baseConfig = {
          ...configs.products[specificConfig.inheritsFrom],
        };
        productConfig = this.mergeConfigs(baseConfig, specificConfig);
      } else {
        productConfig = this.mergeConfigs(productConfig, specificConfig);
      }
    }

    return new ProductDto(
      productConfig.baseProductId,
      productConfig.parentVendorCode,
      uuidv4(),
      productConfig.ean,
      productConfig.sku,
      productConfig.pimId,
      productConfig.title,
      productConfig.description,
      productConfig.seoTitle,
      productConfig.seoDescription,
      productConfig.contentSize,
      new ProductDimensionsDto(
        new CentimeterDto(productConfig.dimensions.length),
        new CentimeterDto(productConfig.dimensions.width),
        new CentimeterDto(productConfig.dimensions.height),
        new GramDto(productConfig.dimensions.nettoWeight),
        new GramDto(productConfig.dimensions.bruttoWeight),
      ),
      productConfig.tags,
    );
  }

  mergeConfigs(
    baseConfig: ProductConfig,
    specificConfig: ProductConfig,
  ): ProductConfig {
    return _.merge({}, baseConfig, specificConfig);
  }
}
