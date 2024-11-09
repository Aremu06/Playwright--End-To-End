import { CentimeterDto } from "./centimeter.dto";
import { GramDto } from "./gram.dto";

export class ProductDimensionsDto {
  constructor(
    public length: CentimeterDto,
    public width: CentimeterDto,
    public heigth: CentimeterDto,
    public nettoWeight: GramDto,
    public bruttoWeight: GramDto,
  ) {}
}
