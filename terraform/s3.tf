# ─── S3: Admin Panel ──────────────────────────────────────────────────────────
resource "aws_s3_bucket" "admin" {
  bucket = "${local.prefix}-admin"
  tags   = { Name = "${local.prefix}-admin" }
}

resource "aws_s3_bucket_public_access_block" "admin" {
  bucket                  = aws_s3_bucket.admin.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Only CloudFront can read from this bucket (no public S3 access)
resource "aws_s3_bucket_policy" "admin" {
  bucket = aws_s3_bucket.admin.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid       = "AllowCloudFrontOAC"
      Effect    = "Allow"
      Principal = { Service = "cloudfront.amazonaws.com" }
      Action    = "s3:GetObject"
      Resource  = "${aws_s3_bucket.admin.arn}/*"
      Condition = {
        StringEquals = {
          "AWS:SourceArn" = aws_cloudfront_distribution.admin.arn
        }
      }
    }]
  })

  depends_on = [aws_cloudfront_distribution.admin]
}
