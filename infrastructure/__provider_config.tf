provider "aws" {
  default_tags {
    tags = module.naming.tags
  }
}
