output "admin_url" {
  description = "Admin panel URL — open this after deploy"
  value       = local.has_domain ? "https://${local.admin_fqdn}" : "https://${aws_cloudfront_distribution.admin.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "Add to GitHub secrets as CLOUDFRONT_DISTRIBUTION_ID"
  value       = aws_cloudfront_distribution.admin.id
}

output "s3_bucket" {
  description = "Add to GitHub secrets as S3_BUCKET"
  value       = aws_s3_bucket.admin.id
}

output "github_role_arn" {
  description = "Add to GitHub secrets as AWS_ROLE_ARN"
  value       = aws_iam_role.github_deploy.arn
}

output "aws_region" {
  description = "Add to GitHub secrets as AWS_REGION"
  value       = var.aws_region
}
