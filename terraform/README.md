# Terraform Configuration for Smile Game Frontend

This Terraform configuration deploys the Smile Game Frontend React application to AWS S3 and CloudFront CDN.

## Prerequisites

1. **AWS CLI** installed and configured
2. **Terraform** >= 1.0 installed
3. **AWS Account** with appropriate permissions
4. **Built React application** in the `build/` directory

## Required AWS Permissions

Your AWS credentials need the following permissions:
- S3: CreateBucket, PutBucketPolicy, PutBucketVersioning, PutBucketEncryption, PutBucketPublicAccessBlock, PutObject, GetObject, ListBucket
- CloudFront: CreateDistribution, GetDistribution, UpdateDistribution, CreateOriginAccessControl, CreateResponseHeadersPolicy
- IAM: CreateRole, AttachRolePolicy (if using deployment roles)

## Setup Instructions

### 1. Configure Variables

Copy the example variables file and customize it:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and update the following:
- `bucket_name`: Must be globally unique (e.g., `smile-game-frontend-prod-2024`)
- `aws_region`: Your preferred AWS region
- `custom_domain`: (Optional) Your custom domain name
- `acm_certificate_arn`: (Optional) ACM certificate ARN if using custom domain

### 2. Initialize Terraform

```bash
terraform init
```

### 3. Review the Plan

```bash
terraform plan
```

### 4. Apply the Configuration

```bash
terraform apply
```

Type `yes` when prompted to create the resources.

### 5. Deploy Your Application

After Terraform creates the infrastructure, deploy your built React app:

```bash
# From the project root directory
aws s3 sync build/ s3://<bucket-name> --delete
```

Or use the provided deployment script (see below).

### 6. Invalidate CloudFront Cache

After deploying, invalidate the CloudFront cache:

```bash
aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
```

## Deployment Script

A deployment script is provided in the root directory (`deploy.sh` or `deploy.ps1`). It will:
1. Build the React application
2. Sync files to S3
3. Invalidate CloudFront cache

## Outputs

After running `terraform apply`, you'll see outputs including:
- `website_url`: The CloudFront URL for your website
- `cloudfront_distribution_id`: CloudFront distribution ID
- `s3_bucket_name`: S3 bucket name

## Custom Domain Setup

If you want to use a custom domain:

1. **Request an ACM Certificate** (must be in `us-east-1` region for CloudFront):
   ```bash
   aws acm request-certificate \
     --domain-name game.yourdomain.com \
     --validation-method DNS \
     --region us-east-1
   ```

2. **Validate the certificate** by adding DNS records to your domain

3. **Update `terraform.tfvars`**:
   ```hcl
   custom_domain       = "game.yourdomain.com"
   acm_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/..."
   ```

4. **Update your DNS** to point to CloudFront:
   - Create a CNAME record: `game.yourdomain.com` → `<cloudfront-domain-name>`

5. **Re-apply Terraform**:
   ```bash
   terraform apply
   ```

## Features

- ✅ S3 bucket with versioning and encryption
- ✅ CloudFront CDN with optimized caching
- ✅ Security headers (HSTS, XSS protection, etc.)
- ✅ React Router support (404 → index.html)
- ✅ IPv6 support
- ✅ Custom error pages
- ✅ Separate cache behaviors for static assets
- ✅ Origin Access Control (OAC) for secure S3 access

## Cache Behaviors

The configuration includes optimized cache behaviors:
- **Static assets** (`/static/*`): 1 year cache
- **Images** (`*.jpg`, `*.png`, `*.svg`): 7 days default, 1 year max
- **Fonts** (`*.ttf`): 7 days default, 1 year max
- **HTML files**: 1 hour default cache

## Cost Optimization

- **Price Class**: Set to `PriceClass_100` by default (US, Canada, Europe)
- **S3 Versioning**: Can be disabled if not needed
- **IPv6**: Can be disabled if not needed

## Troubleshooting

### Bucket name already exists
Choose a different globally unique bucket name in `terraform.tfvars`.

### CloudFront distribution takes time to deploy
CloudFront distributions can take 15-30 minutes to fully deploy. Check status with:
```bash
aws cloudfront get-distribution --id <distribution-id>
```

### 404 errors on routes
Ensure the custom error responses are configured (they are in this config). If issues persist, check that `index.html` is in the root of your S3 bucket.

### CORS issues
If you have CORS issues with API calls, you may need to configure CORS on your API backend, not on CloudFront/S3.

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

**Warning**: This will delete the S3 bucket and all its contents, and the CloudFront distribution.

## Remote State (Optional)

To use remote state with S3 backend, uncomment and configure the backend block in `main.tf`:

```hcl
backend "s3" {
  bucket = "your-terraform-state-bucket"
  key    = "smile-game-frontend/terraform.tfstate"
  region = "us-east-1"
}
```

