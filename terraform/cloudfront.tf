# ─── Origin Access Control (S3 → CloudFront, no legacy OAI) ──────────────────
resource "aws_cloudfront_origin_access_control" "admin" {
  name                              = "${local.prefix}-admin-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# ─── CloudFront Distribution: Admin Panel ──────────────────────────────────────
resource "aws_cloudfront_distribution" "admin" {
  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  price_class         = "PriceClass_100" # US + Europe only — cheapest

  aliases = local.has_domain ? [local.admin_fqdn] : []

  origin {
    domain_name              = aws_s3_bucket.admin.bucket_regional_domain_name
    origin_id                = "S3Admin"
    origin_access_control_id = aws_cloudfront_origin_access_control.admin.id
  }

  default_cache_behavior {
    target_origin_id       = "S3Admin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    # Assets with content hashes can be cached a full year; index.html must not be
    min_ttl     = 0
    default_ttl = 86400   # 1 day
    max_ttl     = 31536000 # 1 year
  }

  # Angular client-side router: 403/404 from S3 → serve index.html with 200
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  viewer_certificate {
    # Use custom cert if domain supplied, otherwise CloudFront default (*.cloudfront.net)
    acm_certificate_arn      = local.has_domain ? aws_acm_certificate.cloudfront[0].arn : null
    ssl_support_method       = local.has_domain ? "sni-only" : null
    minimum_protocol_version = local.has_domain ? "TLSv1.2_2021" : null
    cloudfront_default_certificate = local.has_domain ? false : true
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  tags = { Name = "${local.prefix}-admin-cdn" }
}
