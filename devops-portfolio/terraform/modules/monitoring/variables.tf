variable "asg_name" {
  description = "Name of the Auto Scaling Group to monitor"
  type        = string
}

variable "alert_email" {
  description = "Email address for alarm notifications (empty = no subscription)"
  type        = string
  default     = ""
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
}

variable "environment" {
  description = "Environment name"
  type        = string
}
