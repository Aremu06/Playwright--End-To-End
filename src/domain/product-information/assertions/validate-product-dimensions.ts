import { Probe } from "../../../core/interfaces/probe";
import { expect } from "playwright/test";
import { ProductDto } from "../models/product.dto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidateProductDimensions implements Probe<any> {
  async verify(actualProductEvent, productDto: ProductDto): Promise<void> {
    const eventDetails = actualProductEvent.event.values;
    expect(
      eventDetails.produktmasse.rows[0],
      "Product Dimensions have been imported correctly",
    ).toEqual({
      laenge: { CENTIMETER: productDto.productDimensions.length.value },
      breite: { CENTIMETER: productDto.productDimensions.width.value },
      hoehe: { CENTIMETER: productDto.productDimensions.heigth.value },
      gewicht: { GRAM: productDto.productDimensions.nettoWeight.value },
      bruttoGewicht: { GRAM: productDto.productDimensions.bruttoWeight.value },
    });
  }
}
