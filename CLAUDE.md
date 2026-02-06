# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- **Never push to any remote branch without explicit user approval.** Always ask before running `git push`.

## Project Overview

DevOps portfolio website for Justin Carter. React/TypeScript frontend with Terraform-managed AWS infrastructure. The two are independently managed — Terraform provisions the EC2 instance and networking, while the React build output is deployed separately via SCP.

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

```bash
cd devops-portfolio && npm run build
scp -i ~/.ssh/<KEY>.pem -r build/* ubuntu@<ELASTIC_IP>:/var/www/portfolio/
```

The EC2 user data script configures Nginx automatically. GitHub Actions CI/CD is planned to replace the manual SCP step.

## Architecture

- **React 19 + TypeScript** with strict mode. CRA-based (react-scripts).
- **Framer Motion** for animations. **React Icons** for iconography.
- **Styling**: Custom CSS with CSS variables defining a dark/cyberpunk theme (no CSS framework). Component-scoped CSS files.
- **Terraform**: AWS provider ~> 5.0. Resources: EC2 (Ubuntu 22.04), security group, Elastic IP, Route 53 A/CNAME records. User data script bootstraps Nginx, Node.js 20.x, Certbot, fail2ban, and UFW.
- **CI/CD**: GitHub Actions runs React tests/build and Terraform fmt/validate/plan on pushes to `main` and PRs. OIDC auth (no hardcoded secrets).

## Terraform Variables

Defined in `variables.tf`, values in `terraform.tfvars` (gitignored). Key required variable: `key_name` (AWS SSH key pair). See `terraform.tfvars.example` for template.

## ESLint

Configured in `package.json` extending `react-app` and `react-app/jest`.

## TODO

See [TODO.md](TODO.md) for the full task list.
