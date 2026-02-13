# DevOps Portfolio — Justin Carter

Production-grade AWS infrastructure and React portfolio site, built entirely with Terraform across 8 iterative phases. Designed to demonstrate real-world cloud engineering, infrastructure-as-code, and DevSecOps practices.

**Live site:** [justinmemphis.com](https://justinmemphis.com)

---

## Architecture Overview

A single EC2 instance behind an Auto Scaling Group serves the React frontend via Nginx with TLS. All infrastructure is defined in modular Terraform and deployed through a CI/CD pipeline with no hardcoded secrets.

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

## Infrastructure Highlights

| Phase | What Was Built |
|-------|---------------|
| 1. Remote State | S3 backend with DynamoDB locking — no local state files |
| 2. Networking | VPC with 2 public subnets, Internet Gateway, route tables |
| 3. Compute | Launch template, Auto Scaling Group, security groups, IAM instance profile |
| 4. DNS | Route 53 module — hosted zone lookup, A record, www CNAME |
| 5. Security Hardening | Discrete security group rules, least-privilege IAM policies |
| 6. CI/CD | GitHub Actions: lint, validate, plan on every PR. OIDC auth (zero secrets) |
| 7. Monitoring | CloudWatch alarms (CPU, disk, status checks, ASG health) with SNS alerts |
| 8. Server Hardening | Unattended security upgrades, SSH lockdown, fail2ban, UFW, Certbot auto-renewal |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Framer Motion |
| Styling | Custom CSS with CSS variables (dark/cyberpunk theme) |
| Infrastructure | Terraform (AWS provider ~> 5.0), modular design |
| Compute | EC2 (Ubuntu 22.04), Nginx, Let's Encrypt TLS |
| Networking | VPC, public subnets, Internet Gateway, Elastic IP |
| DNS | Route 53 |
| Monitoring | CloudWatch alarms, CloudWatch agent, SNS |
| CI/CD | GitHub Actions, OIDC federation (no hardcoded credentials) |
| State Management | S3 + DynamoDB |

## Project Structure

```
.
├── .github/workflows/
│   └── pr-checks.yml              # CI pipeline (React build + Terraform plan)
├── devops-portfolio/
│   ├── src/
│   │   ├── components/            # React components (Hero, Projects, Skills, etc.)
│   │   ├── App.tsx                # Root component
│   │   └── index.tsx              # Entry point
│   ├── public/                    # Static assets, favicon, index.html
│   ├── terraform/
│   │   ├── modules/
│   │   │   ├── networking/        # VPC, subnets, IGW, route tables
│   │   │   ├── compute/           # Launch template, ASG, SG, IAM, user data
│   │   │   ├── dns/               # Route 53 records
│   │   │   └── monitoring/        # CloudWatch alarms, SNS topic
│   │   ├── bootstrap/             # S3 backend + OIDC provider (local state)
│   │   ├── main.tf                # Root module composition
│   │   ├── backend.tf             # S3 state backend config
│   │   └── variables.tf           # Input variables
│   └── package.json
├── TODO.md                        # Phase tracker
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 25+ and npm 11+
- Terraform 1.x
- AWS CLI configured with appropriate credentials

### Local Development

```bash
cd devops-portfolio
npm install
npm start            # Dev server on localhost:3000
npm run build        # Production build
npm test             # Jest + React Testing Library
```

### Infrastructure

```bash
cd devops-portfolio/terraform
terraform init
terraform plan -var-file="terraform.tfvars"
terraform apply -var-file="terraform.tfvars"
```

The bootstrap module (`terraform/bootstrap/`) manages the S3 backend and OIDC provider using local state. Apply it manually before running the main configuration.

## CI/CD Pipeline

Every push to `main` and every pull request triggers:

1. **React** — install dependencies, lint, test, production build
2. **Terraform** — `fmt -check`, `validate`, `plan` (authenticated via OIDC, no secrets stored in GitHub)

## Contact

- **LinkedIn:** [justin-carter-memphis](https://www.linkedin.com/in/justin-carter-memphis/)
- **GitHub:** [Justinmemphis](https://github.com/Justinmemphis)
- **Email:** jcarter82@gmail.com
