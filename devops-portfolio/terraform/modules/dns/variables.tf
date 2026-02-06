variable "domain_name" {
  description = "Domain name for the portfolio site"
  type        = string
}

variable "eip_public_ip" {
  description = "Public IP address of the Elastic IP to point the A record at"
  type        = string
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name (e.g. production, dev)"
  type        = string
}
