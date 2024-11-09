import { AbstractS3Reader } from "../../../global/aws/s3/abstract-s3-reader";
import { ImportedProductEventReader } from "../../../../domain/product-information/interfaces/imported-product-event-reader";
import { ProductImportedEvent } from "../../../../domain/product-information/models/product-imported-event";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export class ImportedProductEventBucketReader
  extends AbstractS3Reader<ProductImportedEvent>
  implements ImportedProductEventReader<ProductImportedEvent>
{
  async invoke(key: string): Promise<ProductImportedEvent> {
    const s3Client = await this.getS3Client();
    const bucketName = "testing-pim-changed-service-qa";
    const region = "eu-central-1";

    const query = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    this.logger.debug("Fetching key from S3 bucket:", {
      bucket: bucketName,
      key: key,
    });
    const response = await s3Client.send(query);

    const body = await response.Body.transformToString();
    const s3ObjectUrl = `https://s3.console.aws.amazon.com/s3/object/${bucketName}?prefix=${encodeURIComponent(
      key,
    )}&region=${encodeURIComponent(region)}`;
    this.logger.debug("S3 Object URL: ", s3ObjectUrl);

    let jsonData;
    try {
      jsonData = JSON.parse(body.toString());
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }

    return new ProductImportedEvent(jsonData);
  }
}
