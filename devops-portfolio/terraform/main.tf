# Data source for latest Ubuntu 22.04 AMI
data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# Security Group for the portfolio web server
resource "aws_security_group" "portfolio" {
  name        = "portfolio-web-sg"
  description = "Security group for DevOps portfolio web server"

  # SSH access
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allowed_ssh_cidr]
  }

  # HTTP access
  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS access
  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound internet access
  egress {
    description = "All outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "portfolio-web-sg"
  }
}

# EC2 Instance for the portfolio
resource "aws_instance" "portfolio" {
  ami                    = data.aws_ami.ubuntu.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  vpc_security_group_ids = [aws_security_group.portfolio.id]

  root_block_device {
    volume_size           = 10
    volume_type           = "gp3"
    encrypted             = true
    delete_on_termination = true
  }

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Update system
              apt-get update
              apt-get upgrade -y

              # Install Nginx
              apt-get install -y nginx

              # Install Node.js 20.x
              curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
              apt-get install -y nodejs

              # Install Certbot for SSL
              apt-get install -y certbot python3-certbot-nginx

              # Install fail2ban for security
              apt-get install -y fail2ban
              systemctl enable fail2ban
              systemctl start fail2ban

              # Configure UFW firewall
              ufw allow 22/tcp
              ufw allow 80/tcp
              ufw allow 443/tcp
              ufw --force enable

              # Create web directory
              mkdir -p /var/www/portfolio
              chown -R ubuntu:ubuntu /var/www/portfolio

              # Configure Nginx site
              cat > /etc/nginx/sites-available/portfolio <<'NGINX'
              server {
                  listen 80;
                  server_name ${var.domain_name} www.${var.domain_name};

                  root /var/www/portfolio;
                  index index.html;

                  location / {
                      try_files $uri $uri/ /index.html;
                  }

                  location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                      expires 30d;
                      add_header Cache-Control "public, immutable";
                  }
              }
              NGINX

              # Enable site and remove default
              ln -sf /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/portfolio
              rm -f /etc/nginx/sites-enabled/default

              # Start Nginx
              systemctl enable nginx
              systemctl restart nginx

              echo "Bootstrap complete" > /var/log/user-data-complete.log
              EOF

  tags = {
    Name = "portfolio-webserver"
  }
}

# Elastic IP for consistent public IP
resource "aws_eip" "portfolio" {
  instance = aws_instance.portfolio.id
  domain   = "vpc"

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
