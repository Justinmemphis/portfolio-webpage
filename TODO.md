# TODO — Enterprise Terraform Migration

## Current Phase: 3 (Compute Module)

### Phase 1 Complete ✓
Remote state backend deployed — S3 bucket + DynamoDB lock table, state migrated successfully.

### Phase 2 Complete ✓
Networking module deployed — VPC (`10.0.0.0/16`), 2 public subnets (`us-east-1a`, `us-east-1b`), IGW, route tables.

### Phase 3 — In Progress (code written, needs apply)

Compute module files are written. Replaces raw `aws_instance` + inline SG with launch template, ASG (min/max 1), SG in new VPC, and IAM instance profile. No NAT, no ALB.

**New files created:**
- `devops-portfolio/terraform/modules/compute/main.tf` — AMI data source, SG, launch template, ASG, IAM role + profile
- `devops-portfolio/terraform/modules/compute/variables.tf`
- `devops-portfolio/terraform/modules/compute/outputs.tf`
- `devops-portfolio/terraform/modules/compute/user_data.sh.tpl` — extracted user data + EIP self-association via IMDSv2

**Modified files:**
- `devops-portfolio/terraform/main.tf` — removed old instance/SG/AMI, added `module "compute"` call, removed `instance` attr from EIP
- `devops-portfolio/terraform/outputs.tf` — updated to reference compute module outputs

#### Next Steps

1. **Init + Plan**
   ```bash
   cd devops-portfolio/terraform
   terraform init
   terraform plan
   ```
   Expect: destroy old instance + SG, modify EIP, create new SG + launch template + ASG + IAM resources. No change to networking or Route 53.

2. **Apply**
   ```bash
   terraform apply
   ```
   Brief downtime while old instance is destroyed and ASG launches a new one. DNS unaffected (EIP stays the same).

3. **Wait for ASG instance** (~2-3 min for instance to launch and self-associate EIP)

4. **Re-deploy build**
   ```bash
   cd devops-portfolio && npm run build
   scp -i ~/.ssh/<KEY>.pem -r build/* ubuntu@<EIP>:/var/www/portfolio/
   ```

5. **Re-run Certbot on the new instance**
   ```bash
   ssh -i ~/.ssh/<KEY>.pem ubuntu@<EIP>
   sudo certbot --nginx -d justinmemphis.com -d www.justinmemphis.com
   ```

6. **Verify** — site loads at https://justinmemphis.com

---

## Remaining Phases

| Phase | Description | Status |
|---|---|---|
| 1 | Remote State Backend | **Complete** |
| 2 | Networking Module (VPC, public subnets, IGW) | **Complete** |
| 3 | Compute Module (Launch template, ASG) | **Code Written — Needs Apply** |
| 4 | DNS Module | Pending |
| 5 | Security Hardening (discrete SG rules, IAM) | Pending |
| 6 | CI/CD (GitHub Actions: `fmt -check`, `validate`, `plan` on PRs) | Pending |
| 7 | Monitoring (CloudWatch alarms, SNS) | Pending |

---

## Key Files Created

- `devops-portfolio/terraform/bootstrap/` — S3 + DynamoDB for state backend
- `devops-portfolio/terraform/backend.tf` — S3 backend config
- `devops-portfolio/terraform/modules/networking/` — VPC, subnets, IGW, route tables
- `devops-portfolio/terraform/modules/compute/` — Launch template, ASG, SG, IAM, user data template
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
