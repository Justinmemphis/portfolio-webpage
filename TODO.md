# TODO — DevOps Portfolio

## Phases Summary

| Phase | Description | Status |
|---|---|---|
| 1 | Remote State Backend (S3 + DynamoDB) | **Complete** |
| 2 | Networking Module (VPC, subnets, IGW) | **Complete** |
| 3 | Compute Module (Launch template, ASG) | **Complete** |
| 4 | DNS Module | **Complete** |
| 5 | Security Hardening (discrete SG rules, IAM) | **Complete** |
| 6 | CI/CD (GitHub Actions, OIDC, auto-deploy via S3 + SSM) | **Complete** |
| 7 | Monitoring (CloudWatch alarms, SNS) | **Complete** |
| 8 | Server Hardening (unattended-upgrades, SSH, Certbot, log rotation) | **Complete** |
| 9 | Testing & Security Scanning | **Pending** |
| 10 | Polish & Content | **Complete** |
| 11 | Content & UX | **In Progress** |

---

### Phase 1: Remote State Backend ✓
S3 bucket + DynamoDB lock table deployed; Terraform state migrated successfully.

### Phase 2: Networking Module ✓
VPC (`10.0.0.0/16`), 2 public subnets (`us-east-1a`, `us-east-1b`), IGW, route tables.

### Phase 3: Compute Module ✓
Launch template, ASG (min/max 1), SG in new VPC, IAM instance profile. Site re-deployed; Certbot re-configured on new instance.

### Phase 4: DNS Module ✓
Route 53 hosted zone lookup, A record, and www CNAME extracted into `modules/dns/`. State migrated, `terraform plan` confirmed zero changes.

### Phase 5: Security Hardening ✓
Inline SG rules converted to discrete `aws_security_group_rule` resources. IAM policy scoped (`AssociateAddress` restricted to project EIP; `DescribeAddresses` kept at `*` per API requirement).

### Phase 6: CI/CD ✓
GitHub Actions: `fmt -check`, `validate`, `plan` on PRs; auto-deploy on merge to `main` via S3 + SSM Run Command (no port 22 required). OIDC auth (no hardcoded secrets). `index.html` force-copied before sync to work around `aws s3 sync` size-based skipping.

### Phase 7: Monitoring ✓
CloudWatch alarms (CPU high, status check failed, ASG health, disk usage) with SNS email notifications. CloudWatch agent installed via user data; `CWAgent` disk metrics verified in console. ASG group metrics enabled.

### Phase 8: Server Hardening ✓
Unattended-upgrades (security-only, auto-reboot 08:00 UTC / 2am Central), SSH hardening via sshd drop-in (no root login, no password auth, MaxAuthTries 3, idle timeout), Certbot auto-renewal timer, log rotation for CloudWatch agent and app logs. All in user data template.

### Phase 9: Testing & Security Scanning (Pending)

- [ ] Unit tests: Jest + React Testing Library for React components
- [ ] E2E tests: Playwright or Cypress smoke tests
- [ ] IaC security scanning: tfsec or checkov in CI pipeline
- [ ] `npm audit` in CI workflow
- [ ] Terraform native tests (`terraform test`) for module validation

### Phase 10: Polish & Content ✓

- [x] Change page title and favicon
- [x] Add Google Analytics (GA4) and Ahrefs analytics
- [x] Update portfolio project description to reflect all infrastructure work (Phases 1–8)
- [x] Update README with architecture summary

### Phase 11: Content & UX

- [x] Add portfolio as Featured item and Project on LinkedIn
- [x] Remove contact form (replaced with social links only)
- [x] Add resume to `public/` and wire up download links (nav, footer, hero)
- [x] Update portfolio project card to reflect SSM deploy, S3 artifacts bucket, and CI/CD auto-deploy

---

## Key Files

- `devops-portfolio/terraform/bootstrap/` — S3 + DynamoDB for state backend
- `devops-portfolio/terraform/backend.tf` — S3 backend config
- `devops-portfolio/terraform/modules/networking/` — VPC, subnets, IGW, route tables
- `devops-portfolio/terraform/modules/compute/` — Launch template, ASG, SG, IAM, user data template
- `devops-portfolio/terraform/modules/dns/` — Route 53 hosted zone lookup, A record, www CNAME
- `devops-portfolio/terraform/bootstrap/github_oidc.tf` — OIDC provider, CI IAM role + policies
- `.github/workflows/pr-checks.yml` — GitHub Actions CI/CD workflow
- `devops-portfolio/terraform/modules/monitoring/` — SNS topic, CloudWatch alarms
- `devops-portfolio/public/resume.pdf` — downloadable resume
- `MIGRATION-PLAN.md` — full migration plan with drift analysis
- `AWS-COST-ANALYSIS.md` — cost breakdown per phase

## Decisions Locked In

- No NAT Gateway (public subnets only)
- No ALB (keep EIP + Certbot)
- CI/CD runs `terraform fmt -check`, `terraform validate`, `terraform plan` on all PRs
- No hardcoded secrets — OIDC auth for GitHub Actions
- Bootstrap module uses local state (intentional — it manages the S3 backend itself). Apply bootstrap changes manually before CI can use them
- CI uses Node 25 to match local dev environment (npm 11)
- `ci.tfvars` has placeholder `key_name = "ci-plan-only"` — swap to real key pair name if plan drift noise bothers you

---

## Future Enhancements

- **Backup strategy**: EBS snapshots on a schedule via AWS Backup or lifecycle policy
- **Cost monitoring**: AWS Budgets alarm for monthly spend threshold
- **WAF / rate limiting**: Nginx rate limiting or AWS WAF if traffic grows
- **Blue/green deploys**: Instance refresh with launch template versioning for zero-downtime updates
