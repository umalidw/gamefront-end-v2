#!/bin/bash

# Deployment script for Smile Game Frontend
# This script builds the React app and deploys it to S3 + CloudFront

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment process...${NC}"

# Check if terraform outputs exist
if [ ! -f "terraform/terraform.tfstate" ]; then
    echo -e "${RED}Error: Terraform state not found. Please run 'terraform apply' first.${NC}"
    exit 1
fi

# Get bucket name and distribution ID from Terraform
BUCKET_NAME=$(cd terraform && terraform output -raw s3_bucket_name)
DISTRIBUTION_ID=$(cd terraform && terraform output -raw cloudfront_distribution_id)

if [ -z "$BUCKET_NAME" ] || [ -z "$DISTRIBUTION_ID" ]; then
    echo -e "${RED}Error: Could not retrieve bucket name or distribution ID from Terraform.${NC}"
    exit 1
fi

echo -e "${YELLOW}Bucket: ${BUCKET_NAME}${NC}"
echo -e "${YELLOW}Distribution ID: ${DISTRIBUTION_ID}${NC}"

# Build the React application
echo -e "${GREEN}Building React application...${NC}"
npm run build

if [ ! -d "build" ]; then
    echo -e "${RED}Error: Build directory not found. Build may have failed.${NC}"
    exit 1
fi

# Sync files to S3
echo -e "${GREEN}Uploading files to S3...${NC}"
aws s3 sync build/ s3://${BUCKET_NAME}/ \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "service-worker.js" \
    --exclude "manifest.json"

# Upload HTML files with no cache
echo -e "${GREEN}Uploading HTML files...${NC}"
aws s3 sync build/ s3://${BUCKET_NAME}/ \
    --delete \
    --cache-control "public, max-age=0, must-revalidate" \
    --exclude "*" \
    --include "*.html" \
    --include "service-worker.js" \
    --include "manifest.json"

# Invalidate CloudFront cache
echo -e "${GREEN}Invalidating CloudFront cache...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id ${DISTRIBUTION_ID} \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo -e "${GREEN}Cache invalidation created: ${INVALIDATION_ID}${NC}"
echo -e "${YELLOW}Note: CloudFront invalidation may take a few minutes to complete.${NC}"

# Get website URL
WEBSITE_URL=$(cd terraform && terraform output -raw website_url)

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Website URL: ${WEBSITE_URL}${NC}"

