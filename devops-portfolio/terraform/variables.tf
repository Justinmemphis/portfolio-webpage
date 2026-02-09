variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of the SSH key pair"
  type        = string
}

variable "allowed_ssh_cidr" {
  description = "CIDR block allowed to SSH (recommend restricting to your IP)"
  type        = string
  default     = "0.0.0.0/0"
}

variable "domain_name" {
  description = "Domain name for the portfolio site"
  type        = string
  default     = "justinmemphis.com"
}

variable "alert_email" {
  description = "Email address for CloudWatch alarm notifications (empty = no subscription)"
  type        = string
  default     = ""
}
