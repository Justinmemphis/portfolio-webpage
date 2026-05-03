# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- **Never push to any remote branch without explicit user approval.** Always ask before running `git push`.

## Project Overview

DevOps portfolio website for Justin Carter. React/TypeScript frontend with Terraform-managed AWS infrastructure. Terraform provisions the EC2 instance and networking; the React build is deployed automatically via GitHub Actions (S3 sync + SSM Run Command) on every push to `main`.

## Repository Layout

- `devops-portfolio/` — the actual application (React app + Terraform config)
  - `src/components/` — React components, each with paired `.tsx` and `.css` files
  - `terraform/` — AWS infrastructure (EC2, security group, Elastic IP, Route 53)
  - `build/` — production build output served by Nginx on EC2
- Root contains repo-level docs, LICENSE, and `.gitignore`

## Commands

All commands run from `devops-portfolio/`:

```bash
npm start          # Dev server on localhost:3000
npm run build      # Production build to build/
npm test           # Jest + React Testing Library
```

### Terraform (from `devops-portfolio/terraform/`)

```bash
terraform init
terraform plan
terraform apply
```

### Deploy build to EC2

Deployment is fully automated via GitHub Actions. On every push to `main`:

1. React app is built (`npm run build`)
2. Build output is synced to S3 (`aws s3 sync devops-portfolio/build/ s3://<DEPLOY_BUCKET>/`)
3. SSM Run Command pulls from S3 to `/var/www/portfolio/` on the EC2 instance

No SSH key or open port 22 required. Authentication uses OIDC federation (no stored AWS credentials).

To trigger a deploy, just push to `main`. The workflow is at `.github/workflows/pr-checks.yml`.

## Architecture

- **React 19 + TypeScript** with strict mode. CRA-based (react-scripts).
- **Framer Motion** for animations. **React Icons** for iconography.
- **Styling**: Custom CSS with CSS variables defining a dark/cyberpunk theme (no CSS framework). Component-scoped CSS files.
- **Terraform**: AWS provider ~> 5.0. Modular layout (`modules/networking`, `modules/compute`, `modules/dns`, `modules/monitoring`) with a `bootstrap/` root for OIDC and S3/DynamoDB state. EC2 (Ubuntu 22.04) in an ASG, Elastic IP, Route 53 A/CNAME. User data bootstraps Nginx, Node.js 20.x, Certbot, fail2ban, and UFW.
- **CI/CD**: GitHub Actions (`pr-checks.yml`) runs React tests/build and Terraform fmt/validate/plan on every push and PR. On merge to `main`, the deploy job syncs the build to S3 and runs SSM to update the EC2 instance. OIDC auth — no hardcoded secrets.

## Terraform Variables

Defined in `variables.tf`, values in `terraform.tfvars` (gitignored). Key required variable: `key_name` (AWS SSH key pair). See `terraform.tfvars.example` for template.

## ESLint

Configured in `package.json` extending `react-app` and `react-app/jest`.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for current goals and priorities. Archived docs (migration plan, deployment guide, infrastructure phase log): `docs/archive/`.
