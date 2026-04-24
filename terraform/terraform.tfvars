# AWS Configuration
aws_region = "us-east-1"

# Project Configuration
project_name = "smile-game-frontend"
environment  = "prod"


# IMPORTANT: Bucket name must be globally unique
bucket_name = "smile-game-frontend-prod-544719091850"



# CloudFront Configurationsss
enable_ipv6 = true
price_class = "PriceClass_100" # Options: PriceClass_All, PriceClass_200, PriceClass_100

# Custom Domain Configuration
custom_domain        = "smartgm.it.com"
acm_certificate_arn  = "arn:aws:acm:us-east-1:544719091850:certificate/85c3d569-010f-483f-ab4e-479e3e9950eb"


# S3 Versioning
enable_versioning = true

# Deployment Bucket (Optional)
create_deployment_bucket = false

