import { ProductConfigurations } from "../models/product-config";

export interface ProductConfigurationLoader {
  loadProductConfigurations: () => Promise<ProductConfigurations>;
}
