# Production-Style AWS Infrastructure

A production-style AWS infrastructure project built with Terraform and deployed through GitHub Actions using OpenID Connect (OIDC) federation.

This repository provisions and manages the infrastructure behind my personal website. The focus is reproducible infrastructure, secure deployment, Linux hardening, monitoring, and operational practices that reduce manual configuration and make the environment easier to maintain.

Live site: https://justinmemphis.com

---

## Project Overview

This project builds a small but realistic AWS hosting environment using Infrastructure as Code.

It includes:

* Custom AWS VPC networking
* Public subnets across multiple Availability Zones
* EC2 instance managed by an Auto Scaling Group
* Elastic IP for stable public access
* Route 53 DNS records
* Nginx web server configuration
* TLS certificates through Let’s Encrypt / Certbot
* IAM roles and policies
* GitHub Actions deployment workflow
* OIDC-based AWS authentication
* Remote Terraform state with S3 and DynamoDB locking
* CloudWatch monitoring and alarms
* Linux hardening and automated server bootstrap

The goal is to keep the environment reproducible from code rather than depending on manual AWS Console configuration.

---

## Architecture

```text
Internet
  │
  ├── Route 53 DNS
  │       │
  │       ▼
  ├── Elastic IP
  │       │
  │       ▼
  └── AWS VPC
          │
          ├── Public Subnet - us-east-1a
          │       │
          │       └── EC2 instance managed by Auto Scaling Group
          │               ├── Nginx
          │               ├── Certbot / Let’s Encrypt
          │               └── Website files
          │
          └── Public Subnet - us-east-1b

Deployment:
GitHub Actions → AWS OIDC → S3 artifact upload → SSM Run Command → EC2

Monitoring:
CloudWatch Logs / Alarms → SNS Email Notification

Terraform State:
S3 backend + DynamoDB state locking
```

---

## AWS Services Used

* **VPC** for network isolation and routing
* **Public subnets** across two Availability Zones
* **Internet Gateway** for public internet access
* **Route tables** for subnet routing
* **EC2** for application hosting
* **Auto Scaling Group** for single-instance recovery
* **Elastic IP** for stable public access
* **Route 53** for DNS
* **IAM** for least-privilege access
* **S3** for deployment artifacts and Terraform remote state
* **DynamoDB** for Terraform state locking
* **SSM Run Command** for deployment execution on the instance
* **CloudWatch** for logs, metrics, and alarms
* **SNS** for alert notifications

---

## Deployment Flow

1. Code is pushed to GitHub.
2. GitHub Actions workflow is triggered.
3. GitHub authenticates to AWS using OIDC federation.
4. AWS STS validates the GitHub identity token.
5. AWS issues short-lived credentials for the workflow.
6. Build artifacts are uploaded to S3.
7. SSM Run Command updates the EC2 instance.
8. Nginx serves the updated site.
9. CloudWatch monitors system and application health.

No long-lived AWS access keys are stored in GitHub.

---

## Infrastructure as Code

Terraform manages the AWS infrastructure for this project.

The Terraform configuration includes:

* VPC networking
* Subnets and routing
* EC2 launch template
* Auto Scaling Group
* IAM roles and instance profile
* Route 53 DNS records
* CloudWatch alarms
* SNS notification resources
* Remote backend configuration

Terraform remote state is stored in S3 with DynamoDB locking to reduce the risk of state conflicts.

---

## GitHub Actions and OIDC

This project uses GitHub Actions with OpenID Connect federation to authenticate to AWS.

Instead of storing static AWS credentials as GitHub secrets, the workflow requests a signed identity token at runtime. AWS validates that token against a scoped IAM trust policy and returns short-lived credentials.

Benefits of this approach:

* No long-lived AWS access keys in GitHub
* Short-lived AWS credentials
* Repository-scoped trust policy
* Branch-aware deployment controls
* Better alignment with least-privilege access

---

## Linux and Server Hardening

The EC2 instance is configured with a hardened baseline suitable for a small public web server.

Hardening steps include:

* SSH key-only authentication
* Root login disabled
* Firewall configuration with UFW
* Fail2ban for basic brute-force protection
* Unattended security updates
* Nginx reverse proxy / static serving configuration
* TLS certificates through Let’s Encrypt
* Automated bootstrap through cloud-init

---

## Monitoring and Operations

CloudWatch is used for basic operational visibility.

Monitoring includes:

* Instance health signals
* Log collection
* CloudWatch alarms
* SNS email notifications
* Deployment visibility through GitHub Actions

The environment is intentionally small, but it includes enough monitoring and automation to make failures easier to detect and recover from.

---

## Repository Structure

```text
.github/
  workflows/
    # GitHub Actions deployment workflows

devops-portfolio/
  # Website source and application files

docs/
  archive/
    # Historical notes and documentation

terraform/
  bootstrap/
    # One-time setup for remote state and OIDC resources

  modules/
    compute/
      # EC2, launch template, Auto Scaling Group, instance profile

    dns/
      # Route 53 DNS records

    monitoring/
      # CloudWatch alarms and SNS notifications

    networking/
      # VPC, subnets, internet gateway, route tables

  backend.tf
  main.tf
  outputs.tf
  provider.tf
  variables.tf
  terraform.tfvars.example

AWS-COST-ANALYSIS.md
ROADMAP.md
README.md
```

---

## Security and Reliability Practices

This project uses several security-minded and reliability-focused practices:

* Infrastructure managed through Terraform
* Remote Terraform state with locking
* OIDC authentication for GitHub Actions
* No static AWS deployment credentials in GitHub
* Least-privilege IAM roles where practical
* Automated server bootstrap
* SSH hardening
* Firewall and fail2ban configuration
* Automated TLS certificate management
* CloudWatch alarms and SNS notifications
* Version-controlled infrastructure changes

---

## What This Project Demonstrates

This project demonstrates practical experience with:

* AWS infrastructure design
* Terraform Infrastructure as Code
* GitHub Actions deployment automation
* OIDC-based cloud authentication
* Linux server administration
* Nginx web hosting
* TLS certificate automation
* Remote state management
* Basic monitoring and alerting
* Secure operational practices for a small public web server

---

## Current Status

This project is live and actively maintained as the infrastructure for my personal website. Future improvements may include additional monitoring, cleaner deployment separation, expanded documentation, and continued hardening.

---

## License

MIT
