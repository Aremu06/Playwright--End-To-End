import { Probe } from "../../../core/interfaces/probe";
import { expect } from "playwright/test";
import { ProductDto } from "../models/product.dto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidateProductDescription implements Probe<any> {
  async verify(actualProductEvent, productDto: ProductDto): Promise<void> {
    const eventDetails = actualProductEvent.event.values;
    expect(
      eventDetails.produktbeschreibung[0].data,
      "Product description has been imported correctly",
    ).toEqual(productDto.description);
  }
}
