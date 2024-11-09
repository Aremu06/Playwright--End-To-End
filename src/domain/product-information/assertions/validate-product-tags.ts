import { Probe } from "../../../core/interfaces/probe";
import { expect } from "playwright/test";
import { ProductDto } from "../models/product.dto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ValidateProductTags implements Probe<any> {
  async verify(actualProductEvent, productDto: ProductDto): Promise<void> {
    const eventDetails = actualProductEvent.event.values;
    expect(
      [...eventDetails.tags.data.map((tag) => tag.code)].sort((a, b) =>
        a.localeCompare(b),
      ),
      "Tags have been imported correctly",
    ).toEqual([...productDto.tags].sort((a, b) => a.localeCompare(b)));
  }
}
