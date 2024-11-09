import { LambdaInvoker } from "../../../../core/interfaces/lambda.invoker";
import { Channel } from "../../../../domain/product-information/models/channel.enum";
import { EventType } from "../../../../domain/product-information/models/event-type.enum";
import { LambdaInvocationResult } from "../../../../core/actions/results/lambda-invocation-result";
import { AbstractLambdaInvoker } from "../../../global/aws/lambda/abstract-lambda-invoker";
import { InvokeCommand } from "@aws-sdk/client-lambda";

export class FetchAllChangesLambdaInvoker
  extends AbstractLambdaInvoker<LambdaInvocationResult>
  implements LambdaInvoker<LambdaInvocationResult>
{
  async invoke(
    productUuids: string[],
    channel: Channel,
    eventType: EventType,
  ): Promise<LambdaInvocationResult> {
    const lambdaClient = await this.getLambdaClient();
    const payload = {
      version: "0",
      id: "a28cdc00-93f0-443f-9f6d-0d74a2427f11",
      "detail-type": eventType,
      source: "MP/systems/pim/command",
      account: "111122223333",
      time: "2023-12-13T18:43:48Z",
      region: "eu-central-1",
      resources: [],
      detail: {
        products: productUuids,
        channel: channel,
      },
    };

    const command = new InvokeCommand({
      FunctionName: "mp-testing-systems-pim-fetch-all-changes",
      Payload: Buffer.from(JSON.stringify(payload)),
    });

    this.logger.info("Invoking lambda ", {
      FunctionName: "mp-testing-systems-pim-fetch-all-changes",
      Channel: channel,
      EventType: eventType,
      ProductUuids: productUuids,
    });
    this.logger.info("Datadog Live Tail: https://tinyurl.com/yuekoqpm");
    const response = await lambdaClient.send(command);

    return new LambdaInvocationResult(response.$metadata.requestId);
  }
}
