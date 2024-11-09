import { fromSSO } from "@aws-sdk/credential-providers";
import { AuthStrategy } from "./auth.strategy";
import { AwsCredentialIdentityProvider } from "@smithy/types";

export class SSOAuthStrategy implements AuthStrategy {
  async getCredentials(): Promise<AwsCredentialIdentityProvider> {
    return fromSSO();
  }
}
