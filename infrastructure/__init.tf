/*
██████   ██████      ███    ██  ██████  ████████     ███████ ██████  ██ ████████
██   ██ ██    ██     ████   ██ ██    ██    ██        ██      ██   ██ ██    ██
██   ██ ██    ██     ██ ██  ██ ██    ██    ██        █████   ██   ██ ██    ██
██   ██ ██    ██     ██  ██ ██ ██    ██    ██        ██      ██   ██ ██    ██
██████   ██████      ██   ████  ██████     ██        ███████ ██████  ██    ██

This file contains common code provided as standard for everyone and is assumed
to be unmodified. ASSUME THINGS WILL BREAK IF YOU EDIT THIS.

If you think something in here is broken or otherwise in need of change, please
contact team cloud.
*/

data "external" "environment" {
  program = ["jq", "-n", "$ENV"]
}

locals {
  env = data.external.environment.result

  dummy_repo = "597031446072.dkr.ecr.eu-central-1.amazonaws.com/dummy-repo:latest"

  naming_environment = (
    var.zzBaseline_naming_environment != null
    && lower(local.build_environment) == "testing"
  ) ? var.zzBaseline_naming_environment : local.build_environment

  default_tags = {
    tqgg_environment    = local.build_environment
    tqgg_subenvironment = local.naming_environment
    tqgg_systemname     = var.zzBaseline_naming_system_name
    tqgg_servicename    = local.service_name
    tqgg_project        = var.zzBaseline_naming_tags_tqgg_project
    tqgg_managed_by     = "terraform"
    tqgg_iac_repository = "https://github.com/The-Quality-Group/${local.repo_name}"
  }
}

module "naming" {
  source  = "cloudposse/label/null"
  version = "~> 0.25.0"

  environment = local.naming_environment
  name        = local.service_name
  namespace   = var.zzBaseline_naming_system_name
  delimiter   = "_"

  label_order = concat(
    (
      var.zzBaseline_naming_prepend_environment || var.zzBaseline_naming_environment != null
    ) ? ["environment"] : [],
    ["name", "namespace"]
  )
  labels_as_tags = ["name"]

  id_length_limit = 32

  tags = local.default_tags
}



/*
// editorconfig-checker-disable
███████ ██    ██ ███████ ████████ ███████ ███    ███
██       ██  ██  ██         ██    ██      ████  ████
███████   ████   ███████    ██    █████   ██ ████ ██
     ██    ██         ██    ██    ██      ██  ██  ██
███████    ██    ███████    ██    ███████ ██      ██


██    ██  █████  ██████  ██  █████  ██████  ██      ███████ ███████
██    ██ ██   ██ ██   ██ ██ ██   ██ ██   ██ ██      ██      ██
██    ██ ███████ ██████  ██ ███████ ██████  ██      █████   ███████
 ██  ██  ██   ██ ██   ██ ██ ██   ██ ██   ██ ██      ██           ██
  ████   ██   ██ ██   ██ ██ ██   ██ ██████  ███████ ███████ ███████

These variables only serve the "framework" provided by this file. DO NOT add
your own variables here.
// editorconfig-checker-enable
*/

variable "zzBaseline_naming_environment" {
  description = <<-EOT
    When the `BUILD_ENVIRONMENT` environment variable is set to "testing", then
    this overrides the environment attribute of the naming module, which
    otherwise defaults to the content of the `BUILD_ENVIRONMENT` environment
    variable. It also forces the module to prepend the environment name when
    generating the `id` value, regardless of the value of
    `var.zzBaseline_naming_prepend_environment`.

    The idea is to allow deploying multiple instances of the same stack to
    testing, eg. for simultaneous testing of multiple feature branches. DO NOT
    DO THIS IN STAGING OR PRODUCTION.
  EOT
  type        = string
  default     = null
}

variable "zzBaseline_naming_prepend_environment" {
  description = <<-EOT
    Whether to prepend the environment name when generating an overall id for
    a resource. This is for backwards-compatibility with shared account
    deployments, where we had testing and staging within the same account.

    New individual services should no do this any more as the environment
    association can be inferred from the account and tags on the resource and
    multiple environments should not share the same account.
  EOT
  type        = bool
  default     = false
}

variable "zzBaseline_naming_system_name" {
  description = "The system name from the naming convention"
  type        = string
  default     = null
}

variable "zzBaseline_naming_tags_tqgg_project" {
  description = <<-EOT
    Value for the "tqgg_project" tag. In the old mono repo, for most stacks
    this was hard coded to "haute-cuisine", which is set as standard for this
    value to aid migration. However, maybe it'll make more sense in the future
    to be more granular about it.
  EOT
  type        = string
  default     = "haute-cuisine"
}
