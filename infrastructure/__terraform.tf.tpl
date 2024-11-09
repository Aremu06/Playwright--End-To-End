terraform {
  backend "s3" {
    bucket         = "${TF_BACKEND_BUCKET}"
    key            = "${TF_BACKEND_BUCKET_KEY}"
    region         = "eu-central-1"
    dynamodb_table = "${TF_BACKEND_DYNAMODB_TABLE}"
  }

  required_providers {
${TF_PROVIDERS}
  }
}
