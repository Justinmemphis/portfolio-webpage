# AWS Infrastructure Portfolio — Terraform IaC

Production-style AWS infrastructure built entirely with Terraform and deployed via GitHub Actions using OpenID Connect (OIDC) federation.

This repository demonstrates secure cloud architecture, Infrastructure as Code best practices, and identity-based CI/CD automation. No manual AWS console configuration is required — the environment is fully reproducible from code.

Live Site: https://justinmemphis.com

---

## Project Overview

This project provisions and manages a complete AWS environment including:

- Custom VPC with public and private subnets
- Internet Gateway and route tables
- EC2 Auto Scaling Group
- Application Load Balancer
- Route 53 DNS
- IAM roles and policies (least privilege)
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
  │                          ┌─────┴─────┐
  │                          │  EC2 (ASG) │
  │                          │  Nginx     │
  │                          │  Certbot   │
  │                          └─────┬─────┘
  │                                │
  └── VPC 10.0.0.0/16             │
      ├── Public Subnet (us-east-1a)
      └── Public Subnet (us-east-1b)

Monitoring: CloudWatch Alarms ──► SNS Email
State:      S3 + DynamoDB Locking
CI/CD:      GitHub Actions ──► OIDC ──► AWS
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
├── backend/       # Remote state configuration (S3 + DynamoDB locking)
├── networking/    # VPC, subnets, route tables, Internet Gateway
├── compute/       # EC2, Launch Template, Auto Scaling Group, ALB
├── iam/           # IAM roles, policies, OIDC trust relationships
├── monitoring/    # CloudWatch alarms and metrics
├── variables.tf
├── outputs.tf
├── providers.tf
└── main.tf
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
