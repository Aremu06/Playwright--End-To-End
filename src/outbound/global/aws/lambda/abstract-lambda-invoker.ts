import { LambdaClient } from "@aws-sdk/client-lambda";
import { AuthStrategy } from "../auth/auth.strategy";
import { LambdaInvoker } from "../../../../core/interfaces/lambda.invoker";
import { Logger } from "winston";

export abstract class AbstractLambdaInvoker<R> implements LambdaInvoker<R> {
  constructor(
    protected readonly logger: Logger,
    private authStrategy: AuthStrategy,
  ) {}

  protected async getLambdaClient(): Promise<LambdaClient> {
    const credentials = await this.authStrategy.getCredentials();
    return new LambdaClient({ credentials });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract invoke(...args: any[]): Promise<R>;
}
