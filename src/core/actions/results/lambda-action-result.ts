import { LambdaInvocationResult } from "./lambda-invocation-result";

export class LambdaActionResult {
  constructor(public invocationResult: LambdaInvocationResult) {}
}
