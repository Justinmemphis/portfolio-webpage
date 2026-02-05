terraform {
  backend "s3" {
    bucket         = "devops-portfolio-tfstate-010955985414"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "devops-portfolio-tflock"
    encrypt        = true
  }
}
