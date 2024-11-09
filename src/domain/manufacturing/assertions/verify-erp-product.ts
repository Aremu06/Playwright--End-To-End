import { Probe } from "../../../core/interfaces/probe";
import { expect } from "playwright/test";
import { InforApi } from "../../../outbound/global/infor/infor-api";
import { InforItem } from "../../../outbound/global/infor/infor-item";
import { Product } from "../product";

export class VerifyErpProduct implements Probe<void> {
  constructor(private readonly inforApi: InforApi) {}

  async verify(expectedProduct: Product): Promise<void> {
    const inforItem: InforItem = await this.inforApi.getItemBySku(
      expectedProduct.sku,
    );

    expect(inforItem.sku).toStrictEqual(expectedProduct.sku);
  }
}
