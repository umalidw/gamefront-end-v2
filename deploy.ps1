# Deployment script for Smile Game Frontend (PowerShell)
# This script builds the React app and deploys it to S3 + CloudFront

$ErrorActionPreference = "Stop"

Write-Host "Starting deployment process..." -ForegroundColor Green

# Check if terraform outputs exist
if (-not (Test-Path "terraform\terraform.tfstate")) {
    Write-Host "Error: Terraform state not found. Please run 'terraform apply' first." -ForegroundColor Red
    exit 1
}

# Get bucket name and distribution ID from Terraform
Push-Location terraform
$BUCKET_NAME = terraform output -raw s3_bucket_name
$DISTRIBUTION_ID = terraform output -raw cloudfront_distribution_id
Pop-Location

if ([string]::IsNullOrEmpty($BUCKET_NAME) -or [string]::IsNullOrEmpty($DISTRIBUTION_ID)) {
    Write-Host "Error: Could not retrieve bucket name or distribution ID from Terraform." -ForegroundColor Red
    exit 1
}

Write-Host "Bucket: $BUCKET_NAME" -ForegroundColor Yellow
Write-Host "Distribution ID: $DISTRIBUTION_ID" -ForegroundColor Yellow

# Build the React application
Write-Host "Building React application..." -ForegroundColor Green
npm run build

if (-not (Test-Path "build")) {
    Write-Host "Error: Build directory not found. Build may have failed." -ForegroundColor Red
    exit 1
}

# Sync files to S3 (excluding HTML files first)
Write-Host "Uploading static files to S3..." -ForegroundColor Green
aws s3 sync build/ s3://$BUCKET_NAME/ `
    --delete `
    --cache-control "public, max-age=31536000, immutable" `
    --exclude "*.html" `
    --exclude "service-worker.js" `
    --exclude "manifest.json"

# Upload HTML files with no cache
Write-Host "Uploading HTML files..." -ForegroundColor Green
aws s3 sync build/ s3://$BUCKET_NAME/ `
    --delete `
    --cache-control "public, max-age=0, must-revalidate" `
    --exclude "*" `
    --include "*.html" `
    --include "service-worker.js" `
    --include "manifest.json"

# Invalidate CloudFront cache
Write-Host "Invalidating CloudFront cache..." -ForegroundColor Green
$INVALIDATION_OUTPUT = aws cloudfront create-invalidation `
    --distribution-id $DISTRIBUTION_ID `
    --paths "/*" `
    --output json | ConvertFrom-Json

$INVALIDATION_ID = $INVALIDATION_OUTPUT.Invalidation.Id

Write-Host "Cache invalidation created: $INVALIDATION_ID" -ForegroundColor Green
Write-Host "Note: CloudFront invalidation may take a few minutes to complete." -ForegroundColor Yellow

# Get website URL
Push-Location terraform
$WEBSITE_URL = terraform output -raw website_url
Pop-Location

Write-Host "Deployment completed successfully!" -ForegroundColor Green
Write-Host "Website URL: $WEBSITE_URL" -ForegroundColor Green

