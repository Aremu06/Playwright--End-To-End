import { expect } from "playwright/test";
import { LambdaActionResult } from "../../../core/actions/results/lambda-action-result";
import { Probe } from "../../../core/interfaces/probe";
import { Logger } from "winston";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class ExtractRequestIdFromImport implements Probe<string> {
  constructor(private readonly logger: Logger) {}
  async verify(lambdaActionResult: LambdaActionResult): Promise<string> {
    expect(lambdaActionResult, "Lambda action finished").toBeDefined();
    const invocationResult = lambdaActionResult.invocationResult;
    expect(
      invocationResult,
      "Lambda action invocation result is defined",
    ).toBeDefined();
    const requestId = invocationResult.requestId;
    expect(
      requestId,
      `Request Id ${requestId} extracted from lambda action invocation result`,
    ).toBeDefined();
    this.logger.info("The lambda invocation has finished:", {
      requestId: requestId,
    });

    return requestId;
  }
}
