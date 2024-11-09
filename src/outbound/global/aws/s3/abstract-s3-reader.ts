import { S3Client } from "@aws-sdk/client-s3";
import { AuthStrategy } from "../auth/auth.strategy";
import { Logger } from "winston";

export abstract class AbstractS3Reader<R> {
  constructor(
    protected readonly logger: Logger,
    protected authStrategy: AuthStrategy,
  ) {}

  protected async getS3Client(): Promise<S3Client> {
    const credentials = await this.authStrategy.getCredentials();
    return new S3Client({ credentials });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract invoke(...args: any[]): Promise<R>;
}
