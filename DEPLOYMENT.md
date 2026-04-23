# Deployment Guide - Smile Game Frontend

Complete guide for deploying the Smile Game Frontend to AWS S3 and CloudFront using Terraform.

## Quick Start

### Prerequisites

1. **AWS Account** with programmatic access
2. **AWS CLI** installed and configured
   ```bash
   aws configure
   ```
3. **Terraform** >= 1.0 installed
   - Download from: https://www.terraform.io/downloads
4. **Node.js and npm** (for building the React app)

### Step 1: Configure Terraform Variables

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set your bucket name (must be globally unique):
```hcl
bucket_name = "smile-game-frontend-prod-2024-yourname"
aws_region  = "us-east-1"
```

### Step 2: Initialize and Apply Terraform

```bash
# Initialize Terraform
terraform init

# Review what will be created
terraform plan

# Apply the configuration
terraform apply
```

Type `yes` when prompted. This will create:
- S3 bucket for hosting
- CloudFront distribution
- Security configurations
- Cache policies

**Note**: CloudFront distribution creation takes 15-30 minutes.

### Step 3: Deploy Your Application

#### Option A: Using the Deployment Script (Recommended)

**Linux/Mac:**
```bash
cd ..
./deploy.sh
```

**Windows (PowerShell):**
```powershell
.\deploy.ps1
```

#### Option B: Manual Deployment

```bash
# Build the React app
npm run build

# Get bucket name from Terraform
cd terraform
BUCKET_NAME=$(terraform output -raw s3_bucket_name)
cd ..

# Upload files to S3
aws s3 sync build/ s3://$BUCKET_NAME/ --delete

# Invalidate CloudFront cache
DIST_ID=$(cd terraform && terraform output -raw cloudfront_distribution_id)
aws cloudfront create-invalidation --distribution-id $DIST_ID --paths "/*"
```

### Step 4: Access Your Website

Get your website URL:
```bash
cd terraform
terraform output website_url
```

## Custom Domain Setup

### 1. Request SSL Certificate

```bash
aws acm request-certificate \
  --domain-name game.yourdomain.com \
  --validation-method DNS \
  --region us-east-1
```

**Important**: Certificate must be in `us-east-1` region for CloudFront.

### 2. Validate Certificate

Add the DNS validation records to your domain's DNS settings.

### 3. Update Terraform Variables

Edit `terraform/terraform.tfvars`:
```hcl
custom_domain       = "game.yourdomain.com"
acm_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/..."
```

### 4. Update CloudFront Configuration

Uncomment the ACM certificate configuration in `terraform/main.tf`:
```hcl
viewer_certificate {
  acm_certificate_arn      = var.acm_certificate_arn
  ssl_support_method       = "sni-only"
  minimum_protocol_version = "TLSv1.2_2021"
}
```

### 5. Apply Changes

```bash
cd terraform
terraform apply
```

### 6. Update DNS

Create a CNAME record in your DNS:
- **Name**: `game` (or your subdomain)
- **Value**: CloudFront domain name (from `terraform output cloudfront_domain_name`)

## Features Included

✅ **S3 Static Website Hosting**
- Versioning enabled
- Server-side encryption
- Private bucket (accessed only via CloudFront)

✅ **CloudFront CDN**
- Global content delivery
- Optimized caching strategies
- IPv6 support
- HTTPS enforced

✅ **Security Headers**
- HSTS (HTTP Strict Transport Security)
- XSS Protection
- Content-Type Options
- Frame Options
- Referrer Policy

✅ **React Router Support**
- Custom error pages (404 → index.html)
- SPA routing support

✅ **Optimized Caching**
- Static assets: 1 year cache
- Images: 7 days default
- HTML: 1 hour cache

## Cost Estimation

Approximate monthly costs (varies by usage):

- **S3 Storage**: ~$0.023 per GB
- **S3 Requests**: ~$0.005 per 1,000 requests
- **CloudFront Data Transfer**: 
  - First 10 TB: $0.085 per GB
  - Next 40 TB: $0.080 per GB
- **CloudFront Requests**: $0.0075 per 10,000 HTTPS requests

**Example**: For a small site with 10GB transfer/month:
- S3: ~$0.25
- CloudFront: ~$0.85
- **Total**: ~$1-2/month

## Troubleshooting

### Error: Bucket name already exists
Choose a different globally unique bucket name in `terraform.tfvars`.

### Error: Access Denied
Ensure your AWS credentials have the required permissions (see `terraform/README.md`).

### CloudFront shows old content
Invalidate the cache:
```bash
aws cloudfront create-invalidation \
  --distribution-id <distribution-id> \
  --paths "/*"
```

### 404 errors on routes
The configuration includes custom error responses. Ensure:
1. `index.html` is in the root of S3 bucket
2. CloudFront distribution is fully deployed (check status)

### Build fails
Ensure all dependencies are installed:
```bash
npm install
```

## Updating the Deployment

After making changes to your React app:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy using the script**:
   ```bash
   ./deploy.sh  # or .\deploy.ps1 on Windows
   ```

The script will:
- Build the React app
- Upload to S3
- Invalidate CloudFront cache

## Monitoring

### View CloudFront Metrics
```bash
aws cloudwatch get-metric-statistics \
  --namespace AWS/CloudFront \
  --metric-name Requests \
  --dimensions Name=DistributionId,Value=<distribution-id> \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-02T00:00:00Z \
  --period 3600 \
  --statistics Sum
```

### Check S3 Bucket Size
```bash
aws s3 ls s3://<bucket-name> --recursive --human-readable --summarize
```

## Cleanup

To remove all resources:

```bash
cd terraform
terraform destroy
```

**Warning**: This will delete:
- S3 bucket and all contents
- CloudFront distribution
- All related resources

## Additional Resources

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [S3 Documentation](https://docs.aws.amazon.com/s3/)

## Support

For issues or questions:
1. Check the `terraform/README.md` for detailed configuration options
2. Review AWS CloudWatch logs
3. Check Terraform state: `terraform show`

