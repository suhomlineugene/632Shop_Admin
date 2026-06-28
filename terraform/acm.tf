# ACM certs for CloudFront MUST be provisioned in us-east-1.
# This entire file is a no-op when var.domain_name is left empty.

resource "aws_acm_certificate" "cloudfront" {
  count    = local.has_domain ? 1 : 0
  provider = aws.us_east_1

  domain_name = var.domain_name

  # Cover both root and all subdomains in one cert
  subject_alternative_names = [
    "*.${var.domain_name}",
  ]

  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }

  tags = { Name = "${local.prefix}-cloudfront-cert" }
}

# DNS validation records (only useful if you manage the zone in Route 53)
# If your domain is elsewhere, copy the CNAME values from the AWS Console instead.
resource "aws_acm_certificate_validation" "cloudfront" {
  count    = local.has_domain ? 1 : 0
  provider = aws.us_east_1

  certificate_arn = aws_acm_certificate.cloudfront[0].arn

  # validation_record_fqdns filled from route53.tf when has_domain = true
}
