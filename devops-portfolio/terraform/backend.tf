terraform {
  backend "s3" {
    bucket         = "devops-portfolio-tfstate-ACCOUNT_ID_HERE"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "devops-portfolio-tflock"
    encrypt        = true
  }
}
