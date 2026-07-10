# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Rules

- **Claude may push feature branches and open PRs on GitHub without asking.** The user reviews and approves/merges PRs on GitHub.
- **Never push directly to `main`.** Merging to `main` triggers a production deploy, so all changes must go through a PR.

## Project Overview

DevOps portfolio website for Justin Carter. Astro 5 frontend with React islands for interactive components, Terraform-managed AWS infrastructure, and a markdown-based blog. Terraform provisions the EC2 instance and networking; the site is deployed automatically via GitHub Actions (S3 sync + SSM Run Command) on every push to `main`.

## Repository Layout

- `devops-portfolio/` — the actual application (Astro site + Terraform config)
  - `src/components/` — React components (`.tsx` + `.css`), mounted as Astro islands
  - `src/content/blog/` — markdown blog posts with frontmatter
  - `src/pages/` — Astro page routes (`index.astro`, `blog/index.astro`, `blog/[slug].astro`)
  - `src/layouts/` — shared `BaseLayout.astro` (head, nav, footer, analytics)
  - `terraform/` — AWS infrastructure (EC2, security group, Elastic IP, Route 53)
  - `build/` — production build output served by Nginx on EC2
- Root contains repo-level docs, LICENSE, and `.gitignore`

## Commands

All commands run from `devops-portfolio/`:

```bash
npm start          # Dev server on localhost:4321
npm run build      # Production build to build/
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

- **Astro 5** for routing, static generation, and the blog. React components are mounted as interactive islands (`client:load` / `client:visible`).
- **React 19 + TypeScript** for interactive components. **Framer Motion** for animations. **React Icons** for iconography.
- **Blog**: markdown files in `src/content/blog/` with Astro content collections. Frontmatter schema: `title`, `date`, `excerpt`, `tags`, `coverImage`. Drop a `.md` file and rebuild to publish.
- **Styling**: Custom CSS with CSS variables defining a dark/cyberpunk theme. JetBrains Mono self-hosted via `@fontsource/jetbrains-mono`. No CSS framework.
- **SEO**: `@astrojs/sitemap` generates `sitemap-index.xml` on every build. JSON-LD Person schema on homepage, BlogPosting schema on each post.
- **Terraform**: AWS provider ~> 5.0. Modular layout (`modules/networking`, `modules/compute`, `modules/dns`, `modules/monitoring`) with a `bootstrap/` root for OIDC and S3/DynamoDB state. EC2 (Ubuntu 22.04) in an ASG, Elastic IP, Route 53 A/CNAME. User data bootstraps Nginx, Node.js 20.x, Certbot, fail2ban, and UFW.
- **CI/CD**: GitHub Actions (`pr-checks.yml`) runs Astro build and Terraform fmt/validate/plan on every push and PR. On merge to `main`, the deploy job syncs the build to S3 and runs SSM to update the EC2 instance. OIDC auth — no hardcoded secrets.

## Terraform Variables

Defined in `variables.tf`, values in `terraform.tfvars` (gitignored). Key required variable: `key_name` (AWS SSH key pair). See `terraform.tfvars.example` for template.

## ESLint

Configured in `package.json` extending `react-app` and `react-app/jest`.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for current goals and priorities. Archived docs (migration plan, deployment guide, infrastructure phase log): `docs/archive/`.
