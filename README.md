# AWS Infrastructure Portfolio — Terraform IaC

Production-style AWS infrastructure built entirely with Terraform and deployed via GitHub Actions using OpenID Connect (OIDC) federation.

This repository demonstrates secure cloud architecture, Infrastructure as Code best practices, and identity-based CI/CD automation. No manual AWS console configuration is required — the environment is fully reproducible from code.

Live Site: https://justinmemphis.com

---

## Project Overview

This project provisions and manages a complete AWS environment including:

- Custom VPC with public subnets across two AZs
- Internet Gateway and route tables
- EC2 Auto Scaling Group (min/max 1) behind an Elastic IP
- Route 53 DNS (A + CNAME records)
- IAM roles and policies (least privilege, OIDC-based)
- CloudWatch monitoring and alarms
- Remote Terraform state (S3 + DynamoDB locking)

All infrastructure is version-controlled and deployed through CI/CD.

---

## Architecture Diagram

```
Internet
  │
  ├── Route 53 (A + CNAME) ──► Elastic IP
  │                                │
  └── VPC 10.0.0.0/16             │
      ├── Public Subnet (us-east-1a)
      │       └── EC2 (ASG, t3.micro)
      │               Nginx + Certbot
      └── Public Subnet (us-east-1b)

Deploy:     GitHub Actions ──► S3 ──► SSM Run Command ──► EC2
Monitoring: CloudWatch Alarms ──► SNS Email
State:      S3 + DynamoDB Locking
Auth:       GitHub Actions ──► OIDC ──► AWS STS (no stored keys)
```

---

## Deployment Flow

1. Code is pushed to GitHub.
2. GitHub Actions workflow is triggered.
3. GitHub authenticates to AWS using OIDC federation.
4. AWS STS validates the identity token and allows role assumption.
5. Temporary AWS credentials are issued.
6. Terraform executes plan/apply.
7. Infrastructure updates are applied automatically.
8. Temporary credentials expire.

No AWS access keys are stored in GitHub.

---

## CI/CD & Identity Federation (OIDC)

This repository uses GitHub Actions with OpenID Connect (OIDC) to securely authenticate to AWS.

Instead of storing long-lived AWS credentials:

- GitHub requests a signed identity token at runtime.
- AWS verifies the token against a scoped IAM trust policy.
- AWS issues short-lived credentials via STS.
- Credentials automatically expire after the workflow completes.

Security benefits:

- No static AWS access keys
- Short-lived session credentials
- Repository and branch-scoped trust policy
- Principle of least privilege
- Infrastructure changes gated via pull requests

---

## Terraform Structure

```
terraform/
├── bootstrap/           # One-time setup: S3/DynamoDB state backend, GitHub OIDC provider
├── modules/
│   ├── compute/         # Launch template, ASG, IAM instance profile
│   ├── dns/             # Route 53 A + CNAME records
│   ├── monitoring/      # CloudWatch alarms, SNS
│   └── networking/      # VPC, public subnets, IGW, route tables
├── backend.tf
├── main.tf
├── outputs.tf
├── provider.tf
├── variables.tf
└── terraform.tfvars.example
```

Features:

- Modular Terraform design
- Remote state stored in S3
- DynamoDB state locking
- Environment reproducibility
- Idempotent infrastructure provisioning

---

## Security Design Principles

This project follows modern cloud security practices:

- Infrastructure as Code only
- Identity-based authentication (OIDC)
- Least-privilege IAM policies
- No manual configuration drift
- Short-lived credentials
- Pull request review before infrastructure changes

Manual console configuration is treated as technical debt.

---

## Key Engineering Patterns Demonstrated

- AWS networking architecture (VPC, subnets, routing)
- Auto Scaling compute design
- Load-balanced application hosting
- DNS integration with Route 53
- CI/CD-driven infrastructure lifecycle
- Identity federation with OIDC
- Remote Terraform state with locking
- Secure IAM trust relationships

---

## Why This Project

This repository demonstrates how modern AWS infrastructure should be built:

- Secure by default
- Fully automated
- Version controlled
- Identity-aware
- Reproducible

It reflects production-oriented cloud engineering practices rather than console-driven experimentation.
