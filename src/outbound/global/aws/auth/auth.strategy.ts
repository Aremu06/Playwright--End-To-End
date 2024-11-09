import { AwsCredentialIdentity as AwsCredentials } from "@aws-sdk/types";
import { AwsCredentialIdentityProvider } from "@smithy/types";

export interface AuthStrategy {
  getCredentials(): Promise<AwsCredentials | AwsCredentialIdentityProvider>;
}
