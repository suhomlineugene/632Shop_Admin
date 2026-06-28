terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Primary region
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project   = "632shop"
      ManagedBy = "terraform"
    }
  }
}

# ACM certs for CloudFront must be in us-east-1 regardless of primary region
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"

  default_tags {
    tags = {
      Project   = "632shop"
      ManagedBy = "terraform"
    }
  }
}
