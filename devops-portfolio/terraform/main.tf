# --- Networking ---

module "networking" {
  source       = "./modules/networking"
  project_name = "devops-portfolio"
  environment  = var.environment
}

# --- Compute ---

module "compute" {
  source            = "./modules/compute"
  vpc_id            = module.networking.vpc_id
  subnet_ids        = module.networking.public_subnet_ids
  instance_type     = var.instance_type
  key_name          = var.key_name
  allowed_ssh_cidr  = var.allowed_ssh_cidr
  domain_name       = var.domain_name
  eip_allocation_id = aws_eip.portfolio.id
  aws_region        = var.aws_region
  project_name      = "devops-portfolio"
  environment       = var.environment
}

# Elastic IP for consistent public IP
resource "aws_eip" "portfolio" {
  domain = "vpc"

  tags = {
    Name = "portfolio-eip"
  }
}

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
  records = [aws_eip.portfolio.public_ip]
}

# A record for www subdomain
resource "aws_route53_record" "www" {
  zone_id = data.aws_route53_zone.portfolio.zone_id
  name    = "www.${var.domain_name}"
  type    = "CNAME"
  ttl     = 300
  records = [var.domain_name]
}
