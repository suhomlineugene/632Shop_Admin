variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Short prefix used for all resource names"
  type        = string
  default     = "632shop"
}

variable "environment" {
  type    = string
  default = "production"
}

# ─── Domain (optional) ────────────────────────────────────────────────────────
# Leave empty to use the default CloudFront URL (*.cloudfront.net) with no custom cert.
variable "domain_name" {
  description = "e.g. '632shop.com' — leave empty to skip ACM + custom domain"
  type        = string
  default     = ""
}

variable "admin_subdomain" {
  description = "Subdomain for the admin panel, e.g. 'admin' → admin.632shop.com"
  type        = string
  default     = "admin"
}

# ─── GitHub ───────────────────────────────────────────────────────────────────
variable "github_org" {
  description = "GitHub username or org"
  type        = string
  default     = "suhomlineugene"
}

variable "admin_repo" {
  description = "GitHub repo name"
  type        = string
  default     = "632Shop_Admin"
}
