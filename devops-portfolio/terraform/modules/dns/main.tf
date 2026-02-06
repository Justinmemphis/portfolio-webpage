# Look up existing Route 53 hosted zone
data "aws_route53_zone" "portfolio" {
  name = var.domain_name
}

# A record for root domain
resource "aws_route53_record" "root" {
  zone_id = data.aws_route53_zone.portfolio.zone_id
  name    = var.domain_name
  type    = "A"
  ttl     = 300
  records = [var.eip_public_ip]
}

# CNAME record for www subdomain
resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.portfolio.zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [var.domain_name]
}
