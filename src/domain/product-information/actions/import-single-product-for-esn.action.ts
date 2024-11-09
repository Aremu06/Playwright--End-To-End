import { Action } from "../../../core/interfaces/action";
import { LambdaActionResult } from "../../../core/actions/results/lambda-action-result";
import { withSpinner } from "../../../core/utils/spinner";
import { Channel } from "../models/channel.enum";
import { EventType } from "../models/event-type.enum";
import { ProductDto } from "../models/product.dto";

export class ImportSingleProductForEsnAction
  implements Action<LambdaActionResult>
{
  constructor(private importProductAction: Action<LambdaActionResult>) {}

  async execute(productDto: ProductDto): Promise<LambdaActionResult> {
    return await withSpinner(
      this.importProductAction.execute.bind(this.importProductAction),
      productDto,
      Channel.Channel_ESN,
      EventType.WorkloadEvent,
    );
  }
}
