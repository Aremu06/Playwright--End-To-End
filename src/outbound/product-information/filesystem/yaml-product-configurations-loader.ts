import { ProductConfigurationLoader } from "../../../domain/product-information/interfaces/product-configuration-loader";
import yaml from "js-yaml";
import * as fs from "fs";
import { ProductConfigurations } from "../../../domain/product-information/models/product-config";
import * as path from "path";

export class YamlProductConfigurationsLoader
  implements ProductConfigurationLoader
{
  async loadProductConfigurations(): Promise<ProductConfigurations> {
    const fileContents = fs.readFileSync(
      path.join(
        path.join(
          process.cwd(),
          "src/domain/product-information/config/products.yaml",
        ),
      ),
      "utf8",
    );
    return yaml.load(fileContents) as ProductConfigurations;
  }
}
