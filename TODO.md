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

**Follow-up complete:** CloudWatch agent confirmed running; `CWAgent` disk metrics verified in CloudWatch console.

### Phase 8 Complete ✓
Server hardening — unattended-upgrades (security-only, auto-reboot at 08:00 UTC / 2am Central), SSH hardening via `/etc/ssh/sshd_config.d/99-hardening.conf` (no root login, no password auth, MaxAuthTries 3, idle timeout), Certbot auto-renewal timer enabled, log rotation for CloudWatch agent and app logs. All in user data template.

---

## Phases Summary

| Phase | Description | Status |
|---|---|---|
| 1 | Remote State Backend | **Complete** |
| 2 | Networking Module (VPC, public subnets, IGW) | **Complete** |
| 3 | Compute Module (Launch template, ASG) | **Complete** |
| 4 | DNS Module | **Complete** |
| 5 | Security Hardening (discrete SG rules, IAM) | **Complete** |
| 6 | CI/CD (GitHub Actions: `fmt -check`, `validate`, `plan` on PRs) | **Complete** |
| 7 | Monitoring (CloudWatch alarms, SNS) | **Complete** |
| 8 | Server Hardening (unattended-upgrades, log rotation, Certbot verification) | **Complete** |
| 9 | Testing & Security Scanning (Jest/RTL, Playwright, tfsec, npm audit) | Pending |
| 10 | Polish & Content (page title, favicon, project descriptions, GA) | Pending |

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

## Phase 8 Complete ✓

Server hardening — unattended-upgrades (security-only, auto-reboot at 08:00 UTC / 2am Central), SSH hardening via sshd drop-in config (no root login, no password auth, MaxAuthTries 3), Certbot timer enabled, log rotation for CloudWatch agent and app logs. All changes in user data template; requires instance replacement to take effect.

## Phase 9 — Testing & Security Scanning

- [ ] Unit tests: Jest + React Testing Library for React components
- [ ] E2E tests: Playwright or Cypress for smoke tests
- [ ] IaC security scanning: tfsec or checkov in CI pipeline
- [ ] `npm audit` in CI workflow
- [ ] Terraform native tests (`terraform test`) for module validation

## Phase 10 — Polish & Content

- [ ] Change the page title and favicon
- [ ] Update portfolio project description to reflect all infrastructure work (Phases 1–7: remote state, VPC, ASG, DNS module, security hardening, CI/CD with OIDC, CloudWatch monitoring)
- [ ] Add Google Analytics
- [ ] Update README with architecture diagram or summary of what was built

---

## Suggested Future Enhancements

- **CD pipeline**: Extend GitHub Actions to auto-deploy build artifacts to EC2 on merge to main (SCP or SSM Run Command)
- **Backup strategy**: EBS snapshots on a schedule via AWS Backup or lifecycle policy
- **Cost monitoring**: AWS Budgets alarm for monthly spend threshold
- **WAF / rate limiting**: Nginx rate limiting or AWS WAF if traffic grows
- **Blue/green deploys**: Instance refresh with launch template versioning for zero-downtime updates
