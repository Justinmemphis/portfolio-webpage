variable "aws_region" {
  description = "AWS region for the state backend resources"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "devops-portfolio"
}

variable "github_repo" {
  description = "GitHub repository in 'owner/repo' format for OIDC trust"
  type        = string
  default     = "Justinmemphis/claude-portfolio-webpage"
}
