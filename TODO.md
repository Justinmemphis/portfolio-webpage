# TODO — Enterprise Terraform Migration

## All Phases Complete

### Phase 1 Complete ✓
Remote state backend deployed — S3 bucket + DynamoDB lock table, state migrated successfully.

### Phase 2 Complete ✓
Networking module deployed — VPC (`10.0.0.0/16`), 2 public subnets (`us-east-1a`, `us-east-1b`), IGW, route tables.

### Phase 3 Complete ✓
Compute module deployed — launch template, ASG (min/max 1), SG in new VPC, IAM instance profile. Site re-deployed and Certbot re-configured on new instance.

### Phase 4 Complete ✓
DNS module extracted — Route 53 hosted zone lookup, A record, and www CNAME moved into `modules/dns/`. State migrated, `terraform plan` confirmed zero changes.

### Phase 5 Complete ✓
Security hardening — inline SG rules converted to discrete `aws_security_group_rule` resources, IAM policy scoped (`AssociateAddress` restricted to project EIP, `DescribeAddresses` kept at `*` per API requirement).

### Phase 6 Complete ✓
CI/CD pipeline — GitHub Actions workflow runs React tests/build and Terraform fmt/validate/plan on pushes to `main` and PRs. OIDC auth via bootstrap module (no hardcoded secrets).

### Phase 7 Complete ✓
Monitoring — CloudWatch alarms (CPU high, status check failed, ASG health, disk usage) with SNS email notifications. CloudWatch agent installed via user data for disk metrics. ASG group metrics enabled. CI IAM policy updated with CloudWatch/SNS read permissions.

---

## Remaining Phases

| Phase | Description | Status |
|---|---|---|
| 1 | Remote State Backend | **Complete** |
| 2 | Networking Module (VPC, public subnets, IGW) | **Complete** |
| 3 | Compute Module (Launch template, ASG) | **Complete** |
| 4 | DNS Module | **Complete** |
| 5 | Security Hardening (discrete SG rules, IAM) | **Complete** |
| 6 | CI/CD (GitHub Actions: `fmt -check`, `validate`, `plan` on PRs) | **Complete** |
| 7 | Monitoring (CloudWatch alarms, SNS) | **Complete** |

---

## Key Files Created

- `devops-portfolio/terraform/bootstrap/` — S3 + DynamoDB for state backend
- `devops-portfolio/terraform/backend.tf` — S3 backend config
- `devops-portfolio/terraform/modules/networking/` — VPC, subnets, IGW, route tables
- `devops-portfolio/terraform/modules/compute/` — Launch template, ASG, SG, IAM, user data template
- `devops-portfolio/terraform/modules/dns/` — Route 53 hosted zone lookup, A record, www CNAME
- `devops-portfolio/terraform/bootstrap/github_oidc.tf` — OIDC provider data source, CI IAM role + policies
- `.github/workflows/pr-checks.yml` — GitHub Actions CI/CD workflow
- `devops-portfolio/terraform/modules/monitoring/` — SNS topic, CloudWatch alarms (CPU, status check, ASG health, disk)
- `MIGRATION-PLAN.md` — full migration plan with drift analysis
- `AWS-COST-ANALYSIS.md` — cost breakdown per phase ($0.00 delta total)

## Decisions Locked In

- No NAT Gateway (public subnets only)
- No ALB (keep EIP + Certbot)
- CI/CD will run `terraform fmt -check`, `terraform validate`, `terraform plan` on all PRs
- No hardcoded secrets — OIDC auth for GitHub Actions
- Bootstrap module uses local state (intentional — it manages the S3 backend itself). Apply bootstrap changes manually before CI can use them
- CI uses Node 25 to match local dev environment (npm 11)
- `ci.tfvars` has placeholder `key_name = "ci-plan-only"` — swap to real key pair name if plan drift noise bothers you

---

## Finishing

- [ ] Change the page title and favicon
- [ ] Add Google Analytics and website monitoring/testing software
- [ ] Server autopilot: unattended-upgrades, automatic security patches, log rotation, Certbot auto-renewal verification, disk usage alerts
- [ ] Enterprise testing: unit tests (Jest/RTL for React components), integration tests (API/component interaction), E2E tests (Cypress or Playwright), Terraform tests (terraform test or Terratest), security scanning (tfsec/checkov for IaC, npm audit in CI), load/smoke tests post-deploy
