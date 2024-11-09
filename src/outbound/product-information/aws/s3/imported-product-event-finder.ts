import { AbstractS3Reader } from "../../../global/aws/s3/abstract-s3-reader";
import { ImportedProductEventReader } from "../../../../domain/product-information/interfaces/imported-product-event-reader";
import { ListObjectsV2Command } from "@aws-sdk/client-s3";

export class ImportedProductEventFinder
  extends AbstractS3Reader<string[]>
  implements ImportedProductEventReader<string[]>
{
  async invoke(prefix: string): Promise<string[]> {
    const s3Client = await this.getS3Client();

    const query = new ListObjectsV2Command({
      Bucket: "testing-pim-changed-service-qa",
      Prefix: prefix,
    });

    this.logger.debug("Filtering S3 bucket for prefix:", {
      bucket: "testing-pim-changed-service-qa",
      prefix: prefix,
    });
    const { Contents } = await s3Client.send(query);

    return (Contents ?? []).map((c) => c.Key);
  }
}
