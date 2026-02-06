# TODO — Enterprise Terraform Migration

## Current Phase: 6 (CI/CD)

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

---

## Remaining Phases

| Phase | Description | Status |
|---|---|---|
| 1 | Remote State Backend | **Complete** |
| 2 | Networking Module (VPC, public subnets, IGW) | **Complete** |
| 3 | Compute Module (Launch template, ASG) | **Complete** |
| 4 | DNS Module | **Complete** |
| 5 | Security Hardening (discrete SG rules, IAM) | **Complete** |
| 6 | CI/CD (GitHub Actions: `fmt -check`, `validate`, `plan` on PRs) | Pending |
| 7 | Monitoring (CloudWatch alarms, SNS) | Pending |

---

## Key Files Created

- `devops-portfolio/terraform/bootstrap/` — S3 + DynamoDB for state backend
- `devops-portfolio/terraform/backend.tf` — S3 backend config
- `devops-portfolio/terraform/modules/networking/` — VPC, subnets, IGW, route tables
- `devops-portfolio/terraform/modules/compute/` — Launch template, ASG, SG, IAM, user data template
- `devops-portfolio/terraform/modules/dns/` — Route 53 hosted zone lookup, A record, www CNAME
- `MIGRATION-PLAN.md` — full migration plan with drift analysis
- `AWS-COST-ANALYSIS.md` — cost breakdown per phase ($0.00 delta total)

## Decisions Locked In

- No NAT Gateway (public subnets only)
- No ALB (keep EIP + Certbot)
- CI/CD will run `terraform fmt -check`, `terraform validate`, `terraform plan` on all PRs
- No hardcoded secrets — OIDC auth for GitHub Actions

---

## Finishing

- [ ] Change the page title and favicon
- [ ] Add Google Analytics and website monitoring/testing software
- [ ] Server autopilot: unattended-upgrades, automatic security patches, log rotation, Certbot auto-renewal verification, disk usage alerts
