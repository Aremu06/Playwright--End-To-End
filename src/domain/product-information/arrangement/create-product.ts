import { Arrangement } from "../../../core/interfaces/arrangment";
import { AkeneoApi } from "../../../outbound/global/akeneo/akeneo-api";
import { expect } from "playwright/test";
import { ProductDto } from "../models/product.dto";
import { Logger } from "winston";

export class CreateProduct implements Arrangement<void> {
  constructor(
    private readonly logger: Logger,
    private akeneoApi: AkeneoApi,
  ) {}

  async setup(dto: ProductDto): Promise<void> {
    const product = await this.akeneoApi.getProductByUuid(dto.baseProductId);
    const data = await product.json();

    data.uuid = dto.productId;
    data.values.externe_Produkt_ID[0].data = dto.sku;
    data.values.ean[0].data = dto.ean;
    data.parent = dto.parentVendorCode;
    data.values.Titel[0].data = dto.title;
    data.values.Produktbeschreibung = data.values.Produktbeschreibung.map(
      (item: { locale: string; scope: string; data: string }) => {
        if (item.locale === "de_DE" && item.scope === "Channel_ESN") {
          return {
            ...item,
            data: dto.description,
          };
        }

        return item;
      },
    );
    data.values.pim_id[0].data = dto.pimId;
    data.values.sku[0].data = dto.sku;
    data.values.seo_meta_description[0].data = dto.seoDescription;
    data.values.seo_meta_title[0].data = dto.seoTitle;
    data.values.Inhaltsgroesse[0].data = dto.contentSize;
    data.values.Produktmasse[0].data = [
      {
        Hoehe: {
          unit: "CENTIMETER",
          amount: dto.productDimensions.heigth.value,
        },
        Breite: {
          unit: "CENTIMETER",
          amount: dto.productDimensions.width.value,
        },
        Laenge: {
          unit: "CENTIMETER",
          amount: dto.productDimensions.length.value,
        },
        Gewicht: {
          unit: "GRAM",
          amount: dto.productDimensions.nettoWeight.value,
        },
        dimensions: "Produktmasse",
        Brutto_Gewicht: {
          unit: "GRAM",
          amount: dto.productDimensions.bruttoWeight.value,
        },
      },
    ];
    data.values.Tags[0].data = dto.tags;
    let response = undefined;
    try {
      response = await this.akeneoApi.createProduct(data);
      this.logger.info("Product created in Akeneo:", {
        id: dto.productId,
        status: response.status(),
      });

      expect(
        response.status(),
        `Product successfully created in Akeneo. Id: ${dto.productId}`,
      ).toBe(201);
    } catch (error) {
      if (response !== undefined) {
        const responseBody = await response.body();
        this.logger.error("Response from Akeneo: ", responseBody.toString());
      } else {
        this.logger.error("Error: ", error);
      }

      throw error;
    }
  }
}
