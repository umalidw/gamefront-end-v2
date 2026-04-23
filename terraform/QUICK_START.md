# Quick Start Guide

## 1. Setup (One-time)

```bash
# Navigate to terraform directory
cd terraform

# Copy and edit variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your bucket name

# Initialize Terraform
terraform init
```

## 2. Deploy Infrastructure

```bash
# Review plan
terraform plan

# Apply (creates S3 + CloudFront)
terraform apply
```

## 3. Deploy Application

```bash
# Go back to project root
cd ..

# Use deployment script
./deploy.sh        # Linux/Mac
.\deploy.ps1       # Windows PowerShell

# OR manually:
npm run build
aws s3 sync build/ s3://$(cd terraform && terraform output -raw s3_bucket_name)/ --delete
aws cloudfront create-invalidation --distribution-id $(cd terraform && terraform output -raw cloudfront_distribution_id) --paths "/*"
```

## 4. Get Website URL

```bash
cd terraform
terraform output website_url
```

## Common Commands

```bash
# View outputs
terraform output

# View state
terraform show

# Update infrastructure
terraform plan
terraform apply

# Destroy everything
terraform destroy
```

## Required Variables

Edit `terraform.tfvars`:
- `bucket_name` - Must be globally unique (e.g., `smile-game-frontend-prod-2024`)
- `aws_region` - Your AWS region (e.g., `us-east-1`)

## Troubleshooting

**Bucket name exists?** → Choose a different name in `terraform.tfvars`

**Access denied?** → Check AWS credentials: `aws sts get-caller-identity`

**CloudFront not working?** → Wait 15-30 minutes for deployment to complete

