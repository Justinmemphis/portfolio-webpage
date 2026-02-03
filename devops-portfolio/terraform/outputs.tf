output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.portfolio.id
}

output "instance_public_ip" {
  description = "Public IP address of the EC2 instance"
  value       = aws_eip.portfolio.public_ip
}

output "instance_public_dns" {
  description = "Public DNS name of the EC2 instance"
  value       = aws_instance.portfolio.public_dns
}

output "security_group_id" {
  description = "ID of the security group"
  value       = aws_security_group.portfolio.id
}

output "ssh_connection" {
  description = "SSH connection command"
  value       = "ssh -i ~/.ssh/${var.key_name}.pem ubuntu@${aws_eip.portfolio.public_ip}"
}

output "website_url" {
  description = "URL to access the portfolio"
  value       = "https://${var.domain_name}"
}
