# 632 Shop Admin — AWS Infrastructure

Deploys the Angular admin panel to S3 + CloudFront. No backend, no database — frontend only.

## What gets created

| Resource | Cost |
|---|---|
| S3 bucket (build output) | Free (5 GB / 12 months) |
| CloudFront CDN + HTTPS | Free (1 TB / 12 months) |
| ACM SSL certificate | Always free |
| IAM role for GitHub Actions | Always free |

## Setup (one time)

### 1. Prerequisites

```
winget install Amazon.AWSCLI
winget install HashiCorp.Terraform
```

### 2. AWS credentials

```
aws configure
```
Enter your Access Key ID and Secret — get them from AWS Console → IAM → Users → Security credentials.

### 3. Configure variables

```
cd terraform
copy terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars if you have a custom domain, otherwise defaults are fine
```

### 4. Deploy

```
terraform init
terraform plan
terraform apply
```

After `apply`, you'll see:

```
admin_url                    = "https://abc123.cloudfront.net"
cloudfront_distribution_id   = "EXXXXXXXXXXXX"
s3_bucket                    = "632shop-admin"
github_role_arn              = "arn:aws:iam::123456789:role/632shop-github-deploy"
aws_region                   = "us-east-1"
```

### 5. Add GitHub Actions secrets

Go to **GitHub → 632Shop_Admin → Settings → Secrets and variables → Actions** and add:

| Secret name | Value |
|---|---|
| `AWS_ROLE_ARN` | `github_role_arn` output |
| `S3_BUCKET` | `s3_bucket` output |
| `CLOUDFRONT_DISTRIBUTION_ID` | `cloudfront_distribution_id` output |
| `AWS_REGION` | `aws_region` output |

### 6. Push to main — deploys automatically

Every push to `main` builds Angular and deploys to S3 + CloudFront.

---

## Custom domain (optional)

Set `domain_name = "632shop.com"` in `terraform.tfvars`, then `terraform apply`.  
Copy the ACM DNS validation CNAME from the AWS Console to your domain registrar.  
After validation (~5 min), the admin panel is accessible at `https://admin.632shop.com`.

---

## When you add the backend later

Create a separate `632Shop_API` repo with its own `terraform/` folder covering VPC, RDS, Elastic Beanstalk, SQS, Lambda. The frontend infra stays here.
