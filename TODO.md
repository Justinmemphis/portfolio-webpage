# TODO — Enterprise Terraform Migration

## Current Phase: 1 (Remote State Backend)

### Next Steps

1. **Apply bootstrap** — creates S3 bucket + DynamoDB lock table
   ```bash
   cd devops-portfolio/terraform/bootstrap
   terraform init
   terraform plan
   terraform apply
   ```

2. **Copy bucket name from output** — will look like `devops-portfolio-tfstate-<ACCOUNT_ID>`

3. **Update backend.tf** — replace `ACCOUNT_ID_HERE` in `devops-portfolio/terraform/backend.tf` with your actual AWS account ID from the bootstrap output

4. **Migrate state to S3**
   ```bash
   cd devops-portfolio/terraform
   terraform init -migrate-state
   ```
   Type `yes` when prompted to copy existing state to the new backend.

5. **Verify migration**
   ```bash
   terraform plan
   ```
   Should show **no changes** — infrastructure unchanged, only state location moved.

---

## Remaining Phases

| Phase | Description | Status |
|---|---|---|
| 1 | Remote State Backend | **In Progress** |
| 2 | Networking Module (VPC, public subnets, IGW) | Pending |
| 3 | Compute Module (Launch template, ASG) | Pending |
| 4 | DNS Module | Pending |
| 5 | Security Hardening (discrete SG rules, IAM) | Pending |
| 6 | CI/CD (GitHub Actions: `fmt -check`, `validate`, `plan` on PRs) | Pending |
| 7 | Monitoring (CloudWatch alarms, SNS) | Pending |

---

## Key Files Created

- `devops-portfolio/terraform/bootstrap/` — S3 + DynamoDB for state backend
- `devops-portfolio/terraform/backend.tf` — S3 backend config (needs account ID)
- `MIGRATION-PLAN.md` — full migration plan with drift analysis
- `AWS-COST-ANALYSIS.md` — cost breakdown per phase ($0.00 delta total)

## Decisions Locked In

- No NAT Gateway (public subnets only)
- No ALB (keep EIP + Certbot)
- CI/CD will run `terraform fmt -check`, `terraform validate`, `terraform plan` on all PRs
- No hardcoded secrets — OIDC auth for GitHub Actions
