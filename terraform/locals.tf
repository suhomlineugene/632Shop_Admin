locals {
  # True when a custom domain is supplied
  has_domain = var.domain_name != ""

  # Fully-qualified hostnames
  admin_fqdn = local.has_domain ? "${var.admin_subdomain}.${var.domain_name}" : ""
  api_fqdn   = local.has_domain ? "${var.api_subdomain}.${var.domain_name}" : ""

  # Short label for names/tags
  prefix = var.project_name
}
