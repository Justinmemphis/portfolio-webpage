output "asg_name" {
  description = "Name of the Auto Scaling Group"
  value       = module.compute.asg_name
}

output "instance_public_ip" {
  description = "Public IP address (Elastic IP)"
  value       = aws_eip.portfolio.public_ip
}

output "security_group_id" {
  description = "ID of the web security group"
  value       = module.compute.security_group_id
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_eip.portfolio.public_ip}"
}

output "website_url" {
  description = "URL to access the portfolio"
  value       = "https://${var.domain_name}"
}

output "sns_topic_arn" {
  description = "ARN of the SNS alerts topic"
  value       = module.monitoring.sns_topic_arn
}
