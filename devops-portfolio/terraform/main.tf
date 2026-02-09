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

# --- Monitoring ---

module "monitoring" {
  source       = "./modules/monitoring"
  asg_name     = module.compute.asg_name
  alert_email  = var.alert_email
  project_name = "devops-portfolio"
  environment  = var.environment
}

# --- DNS ---

module "dns" {
  source        = "./modules/dns"
  domain_name   = var.domain_name
  eip_public_ip = aws_eip.portfolio.public_ip
  project_name  = "devops-portfolio"
  environment   = var.environment
}
