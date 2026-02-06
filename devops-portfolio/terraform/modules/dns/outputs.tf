output "zone_id" {
  description = "ID of the Route 53 hosted zone"
  value       = data.aws_route53_zone.portfolio.zone_id
}

output "root_record_fqdn" {
  description = "FQDN of the root A record"
  value       = aws_route53_record.root.fqdn
}

output "www_record_fqdn" {
  description = "FQDN of the www CNAME record"
  value       = aws_route53_record.www.fqdn
}
