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

# Install and configure unattended-upgrades for automatic security patches
apt-get install -y unattended-upgrades

cat > /etc/apt/apt.conf.d/50unattended-upgrades <<'UUEOF'
Unattended-Upgrade::Allowed-Origins {
    "$${distro_id}:$${distro_codename}-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "true";
Unattended-Upgrade::Automatic-Reboot-Time "08:00";
UUEOF

cat > /etc/apt/apt.conf.d/20auto-upgrades <<'AUEOF'
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
AUEOF

systemctl enable unattended-upgrades

# Install AWS CLI for EIP association
apt-get install -y awscli

# Configure UFW firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Harden SSH configuration
cat > /etc/ssh/sshd_config.d/99-hardening.conf <<'SSHEOF'
PermitRootLogin no
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
MaxAuthTries 3
ClientAliveInterval 300
ClientAliveCountMax 2
SSHEOF

systemctl restart sshd

# Create web directory
mkdir -p /var/www/portfolio
chown -R ubuntu:ubuntu /var/www/portfolio

# Configure Nginx site
cat > /etc/nginx/sites-available/portfolio <<'NGINX'
server {
    listen 80;
    server_name ${domain_name} www.${domain_name};

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

# Ensure Certbot auto-renewal timer is active
systemctl enable certbot.timer
systemctl start certbot.timer

# Associate Elastic IP (IMDSv2)
TOKEN=$(curl -s -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
INSTANCE_ID=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/instance-id)
aws ec2 associate-address --instance-id "$INSTANCE_ID" --allocation-id "${eip_allocation_id}" --region "${aws_region}"

# Install and configure CloudWatch Agent for disk monitoring
wget -q https://amazoncloudwatch-agent.s3.amazonaws.com/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
dpkg -i amazon-cloudwatch-agent.deb
rm -f amazon-cloudwatch-agent.deb

cat > /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json <<'CWAGENT'
{
  "metrics": {
    "metrics_collected": {
      "disk": {
        "measurement": ["used_percent"],
        "resources": ["/"],
        "metrics_collection_interval": 300
      }
    }
  }
}
CWAGENT

/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
  -a fetch-config \
  -m ec2 \
  -c file:/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json \
  -s

# Configure log rotation for CloudWatch Agent
cat > /etc/logrotate.d/amazon-cloudwatch-agent <<'LREOF'
/opt/aws/amazon-cloudwatch-agent/logs/*.log {
    weekly
    missingok
    rotate 4
    compress
    delaycompress
    notifempty
    copytruncate
}
LREOF

# Configure log rotation for application logs
cat > /etc/logrotate.d/portfolio-app <<'LREOF'
/var/log/portfolio/*.log {
    weekly
    missingok
    rotate 4
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    copytruncate
}
LREOF

mkdir -p /var/log/portfolio
chown ubuntu:ubuntu /var/log/portfolio

echo "Bootstrap complete" > /var/log/user-data-complete.log
