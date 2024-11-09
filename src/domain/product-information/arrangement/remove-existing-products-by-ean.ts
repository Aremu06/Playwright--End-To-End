import { Arrangement } from "../../../core/interfaces/arrangment";
import { AkeneoApi } from "../../../outbound/global/akeneo/akeneo-api";
import { expect } from "playwright/test";
import { ProductDto } from "../models/product.dto";
import { Logger } from "winston";

export class RemoveExistingProductsByEan implements Arrangement<void> {
  constructor(
    private readonly logger: Logger,
    private akeneoApi: AkeneoApi,
  ) {}

  async setup(dto: ProductDto): Promise<void> {
    const p = await this.akeneoApi.findProductByEan(dto.ean);
    const d = await p.json();
    if (d._embedded.items.length > 0) {
      this.logger.debug("Found existing products for EAN:", {
        ean: dto.ean,
        ids: d._embedded.items.map((item) => item.uuid),
      });
    }
    for (const item of d._embedded.items) {
      const deleteResponse = await this.akeneoApi.deleteProductByUuid(
        item.uuid,
      );
      this.logger.info("Deleted product from Akeneo:", {
        id: item.uuid,
        status_code: deleteResponse.status(),
      });
      expect(
        deleteResponse.status(),
        `Product with id ${item.uuid} successfully deleted from Akeneo`,
      ).toBe(204);
    }
  }
}
