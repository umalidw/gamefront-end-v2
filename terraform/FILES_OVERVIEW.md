# Terraform Files Overview

## File Structure

```
terraform/
├── main.tf                    # Main Terraform configuration
├── variables.tf               # Variable definitions
├── outputs.tf                 # Output values
├── terraform.tfvars.example   # Example variables file
├── .gitignore                 # Git ignore rules for Terraform
├── README.md                  # Detailed documentation
├── QUICK_START.md            # Quick start guide
└── FILES_OVERVIEW.md         # This file
```

## File Descriptions

### main.tf
**Purpose**: Main Terraform configuration file containing all AWS resources.

**Resources Created**:
- `aws_s3_bucket.website` - S3 bucket for static website hosting
- `aws_s3_bucket_versioning.website` - Enables versioning on S3 bucket
- `aws_s3_bucket_server_side_encryption_configuration.website` - Encrypts S3 bucket
- `aws_s3_bucket_public_access_block.website` - Blocks public access (security)
- `aws_s3_bucket_policy.website` - Policy allowing CloudFront to access S3
- `aws_cloudfront_origin_access_control.oac` - OAC for secure S3 access
- `aws_cloudfront_distribution.website` - CloudFront CDN distribution
- `aws_cloudfront_response_headers_policy.security_headers` - Security headers policy
- `aws_s3_bucket.deployments` (optional) - Separate bucket for deployment artifacts

**Key Features**:
- React Router support (404 → index.html)
- Optimized cache behaviors for different file types
- Security headers (HSTS, XSS protection, etc.)
- Custom domain support
- IPv6 support

### variables.tf
**Purpose**: Defines all input variables for the Terraform configuration.

**Variables**:
- `aws_region` - AWS region (default: us-east-1)
- `project_name` - Project name (default: smile-game-frontend)
- `environment` - Environment name (default: prod)
- `bucket_name` - S3 bucket name (required, must be unique)
- `custom_domain` - Custom domain name (optional)
- `acm_certificate_arn` - ACM certificate ARN (optional, for custom domain)
- `enable_versioning` - Enable S3 versioning (default: true)
- `enable_ipv6` - Enable IPv6 for CloudFront (default: true)
- `price_class` - CloudFront price class (default: PriceClass_100)
- `create_deployment_bucket` - Create deployment bucket (default: false)

### outputs.tf
**Purpose**: Defines output values after Terraform applies.

**Outputs**:
- `s3_bucket_name` - Name of the S3 bucket
- `s3_bucket_arn` - ARN of the S3 bucket
- `cloudfront_distribution_id` - CloudFront distribution ID
- `cloudfront_distribution_arn` - CloudFront distribution ARN
- `cloudfront_domain_name` - CloudFront domain name
- `website_url` - Full website URL (https://...)
- `cloudfront_distribution_status` - Distribution status
- `deployment_bucket_name` - Deployment bucket name (if created)

### terraform.tfvars.example
**Purpose**: Example variables file. Copy to `terraform.tfvars` and customize.

**Usage**:
```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
```

### .gitignore
**Purpose**: Prevents committing sensitive Terraform files to Git.

**Ignored**:
- `.terraform/` directory
- `*.tfstate` files
- `*.tfvars` files (except .example)
- Crash logs

### README.md
**Purpose**: Comprehensive documentation including:
- Prerequisites
- Setup instructions
- Custom domain configuration
- Troubleshooting
- Cost estimation
- Best practices

### QUICK_START.md
**Purpose**: Quick reference guide for common operations.

## Deployment Scripts (Root Directory)

### deploy.sh (Linux/Mac)
**Purpose**: Automated deployment script for Linux/Mac systems.

**Actions**:
1. Builds React application
2. Uploads files to S3 with proper cache headers
3. Invalidates CloudFront cache

### deploy.ps1 (Windows)
**Purpose**: Automated deployment script for Windows PowerShell.

**Actions**: Same as deploy.sh but for Windows.

## Usage Flow

1. **Initial Setup**:
   ```bash
   cd terraform
   cp terraform.tfvars.example terraform.tfvars
   # Edit terraform.tfvars
   terraform init
   ```

2. **Create Infrastructure**:
   ```bash
   terraform plan
   terraform apply
   ```

3. **Deploy Application**:
   ```bash
   cd ..
   ./deploy.sh  # or .\deploy.ps1 on Windows
   ```

4. **Get Website URL**:
   ```bash
   cd terraform
   terraform output website_url
   ```

## Security Features

✅ **S3 Security**:
- Private bucket (no public access)
- Server-side encryption
- Access only via CloudFront OAC

✅ **CloudFront Security**:
- HTTPS enforced
- Security headers (HSTS, XSS protection, etc.)
- Origin Access Control (OAC)

✅ **Best Practices**:
- Versioning enabled
- Proper IAM policies
- No hardcoded credentials

## Cost Optimization

- **Price Class**: Configurable (default: PriceClass_100)
- **Caching**: Optimized cache behaviors reduce origin requests
- **Compression**: Enabled to reduce bandwidth
- **IPv6**: Optional (can be disabled)

## Customization

All settings can be customized via `terraform.tfvars`:
- Bucket name
- Region
- Custom domain
- Price class
- Versioning
- IPv6

For advanced customization, edit `main.tf` directly.

