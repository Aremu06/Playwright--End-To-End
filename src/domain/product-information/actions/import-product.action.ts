import { Action } from "../../../core/interfaces/action";
import { LambdaInvoker } from "../../../core/interfaces/lambda.invoker";
import { ProductDto } from "../models/product.dto";
import { LambdaActionResult } from "../../../core/actions/results/lambda-action-result";
import { LambdaInvocationResult } from "../../../core/actions/results/lambda-invocation-result";
import { Channel } from "../models/channel.enum";
import { EventType } from "../models/event-type.enum";
import { Logger } from "winston";

export class ImportProductAction implements Action<LambdaActionResult> {
  constructor(
    private readonly logger: Logger,
    private lambdaInvoker: LambdaInvoker<LambdaInvocationResult>,
  ) {}

  async execute(
    productDto: ProductDto,
    channel: Channel,
    eventType: EventType,
  ): Promise<LambdaActionResult> {
    this.logger.debug("Importing Product with id: ", productDto.productId);
    const response = await this.lambdaInvoker.invoke(
      [productDto.productId],
      channel,
      eventType,
    );

    return new LambdaActionResult(response);
  }
}
