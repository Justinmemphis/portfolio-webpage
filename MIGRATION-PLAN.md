# Enterprise Terraform Migration Plan

Target: Refactor single-file Terraform into a modular, multi-environment, enterprise-grade layout with remote state, proper networking, and CI/CD.

Current state: flat `devops-portfolio/terraform/` directory with `main.tf`, `provider.tf`, `variables.tf`, `outputs.tf`, local `.tfstate`.

**Decisions locked in:**
- **No NAT Gateway** — public subnets only. Not justified for a single-instance portfolio site.
- **No ALB** — keep Elastic IP + Certbot. Saves $22.63/month with no functional loss at this scale.
- **Total cost delta for full migration: $0.00/month.**

---

## Phase 1 — Remote State & Project Scaffolding

### `terraform/backend.tf` (new)
**Rationale:** Local state is a single point of failure and blocks team collaboration. S3 + DynamoDB gives versioned, locked remote state.
**Drift:** None — Terraform migrates state in-place via `terraform init -migrate-state`.

### `terraform/bootstrap/` (new directory)
**Rationale:** Chicken-and-egg problem — the S3 bucket and DynamoDB table for state must exist before the main config can use them. Separate bootstrap root keeps this self-contained.
**Files:** `main.tf`, `outputs.tf`, `variables.tf`, `provider.tf`
**Drift:** None — net-new resources.

### `terraform/environments/` (new directory structure)
```
environments/
  dev/
    main.tf          # calls modules with dev-sized inputs
    terraform.tfvars
    backend.tf       # points to dev state key
  prod/
    main.tf
    terraform.tfvars
    backend.tf
```
**Rationale:** Environment parity. Dev mirrors prod at smaller scale. Eliminates "works on my machine" infra drift. Each env is an independent Terraform root with its own state file.
**Drift:** Prod state will be migrated from current local state. Dev is net-new.

---

## Phase 2 — Networking Module

### `terraform/modules/networking/` (new)
**Files:** `main.tf`, `variables.tf`, `outputs.tf`
**Resources:** VPC, public subnets (2 AZs), internet gateway, route tables.
**Rationale:** Current config uses the default VPC. An explicit VPC gives CIDR control, subnet isolation, and audit trail. Public subnets only — no NAT gateway needed.
**Drift/Replacement:**
- **`aws_security_group.portfolio`** — **REPLACED.** Will be recreated inside the new VPC (security groups are VPC-scoped). The old SG in the default VPC is destroyed.
- **`aws_instance.portfolio`** — **REPLACED.** Moving to a new subnet forces instance replacement.
- **`aws_eip.portfolio`** — **RE-ASSOCIATED.** EIP is detached from old instance and attached to new instance. Brief connectivity gap during switchover.

---

## Phase 3 — Compute Module

### `terraform/modules/compute/` (new)
**Files:** `main.tf`, `variables.tf`, `outputs.tf`, `user_data.sh.tpl`
**Resources:** Launch template, ASG (min 1 / max 1), instance profile + IAM role.
**Rationale:** Raw `aws_instance` blocks are not recoverable — if the instance dies, manual intervention is required. A launch template + ASG gives self-healing, immutable deploys, and a clear upgrade path to multi-instance if needed.
**Drift/Replacement:**
- **`aws_instance.portfolio`** — **DESTROYED.** Replaced entirely by `aws_launch_template` + `aws_autoscaling_group`. Full cutover.
- **`aws_eip.portfolio`** — **KEPT.** EIP remains and is associated to the ASG instance. DNS continues to point at the EIP.

### `terraform/modules/compute/user_data.sh.tpl` (new — extracted from `main.tf`)
**Rationale:** The 60+ line user data script is currently an inline heredoc inside `main.tf`. Extracting to a `templatefile()` improves readability, allows variable interpolation, and makes it testable in isolation.
**Drift:** Any change to user data content triggers instance replacement (expected and desired here).

---

## Phase 4 — DNS Module

### `terraform/modules/dns/` (new)
**Files:** `main.tf`, `variables.tf`, `outputs.tf`
**Resources:** Route 53 zone (data source), A record (EIP), CNAME record (www).
**Rationale:** DNS records are currently inline in `main.tf` and tightly coupled to compute. Extracting to a module decouples DNS from compute, making future changes (e.g. adding CloudFront later) non-disruptive.
**Drift/Replacement:**
- **`aws_route53_record.portfolio_a`** — **STATE MOVED** via `terraform state mv`. No destroy/recreate if handled carefully.
- **`aws_route53_record.portfolio_www`** — Same as above.

---

## Phase 5 — Security Hardening

### `terraform/modules/security/` (new)
**Files:** `main.tf`, `variables.tf`, `outputs.tf`
**Resources:** Security group with discrete `aws_security_group_rule` resources, IAM role + instance profile, SSM Parameter Store entries.
**Rationale:** Current config has one flat security group with inline rules. Enterprise pattern uses discrete `aws_security_group_rule` resources (easier to audit, no rule-count limits). IAM instance profile allows SSM Session Manager access, reducing SSH dependency.
**Drift/Replacement:**
- **`aws_security_group.portfolio`** — **DESTROYED and recreated** with `aws_security_group_rule` resources. Inline ingress/egress rules are incompatible with discrete rules — mixing them causes perpetual drift. Clean break required.

---

## Phase 6 — CI/CD Pipeline

### `.github/workflows/deploy.yml` (new)
**Rationale:** Manual SCP deploys are error-prone and unauditable. GitHub Actions provides build → test → deploy with approval gates.
**Drift:** None — not a Terraform resource.

### `.github/workflows/terraform.yml` (new)
**Rationale:** Terraform changes go through `fmt -check` + `validate` + `plan` on PRs, `apply` on merge. Prevents ad-hoc `terraform apply` from local machines. No hardcoded secrets — authenticates via OIDC (GitHub → AWS IAM role).
**Drift:** None.

---

## Phase 7 — Observability (Optional)

### `terraform/modules/monitoring/` (new)
**Files:** `main.tf`, `variables.tf`, `outputs.tf`
**Resources:** CloudWatch alarms (CPU, status check), SNS topic for alerts, CloudWatch log group.
**Rationale:** No monitoring exists. At minimum, a status-check alarm and SNS email alert ensures you know when the instance is down.
**Drift:** None — net-new resources.

---

## Drift & Replacement Summary

| Current Resource | Action | Reason |
|---|---|---|
| `aws_instance.portfolio` | **DESTROY + RECREATE** | New VPC/subnet, replaced by launch template + ASG |
| `aws_security_group.portfolio` | **DESTROY + RECREATE** | New VPC, inline → discrete rules |
| `aws_eip.portfolio` | **RE-ASSOCIATE** | Detach from old instance, attach to new |
| `aws_route53_record.portfolio_a` | **STATE MOVE** | Moved into DNS module, target unchanged (EIP) |
| `aws_route53_record.portfolio_www` | **STATE MOVE** | Moved into DNS module |
| `data.aws_ami.ubuntu` | **NO CHANGE** | Reused as-is in compute module |
| `data.aws_route53_zone.portfolio` | **NO CHANGE** | Reused as-is in DNS module |
| Terraform local state | **MIGRATED** | Moved to S3 backend |

**Downtime expectation:** The VPC migration will cause a brief outage (minutes) while the instance is replaced and the EIP is re-associated. DNS records do not change — the EIP stays the same — so there is no DNS propagation delay.

---

## File Deletion List

These files are removed once migration is complete:

| File | Reason |
|---|---|
| `terraform/main.tf` | Monolith replaced by modules + environment roots |
| `terraform/provider.tf` | Moved into each environment root |
| `terraform/variables.tf` | Split across modules and environment roots |
| `terraform/outputs.tf` | Split across modules and environment roots |
| `terraform/terraform.tfvars` | Replaced by per-environment tfvars |
| `terraform/terraform.tfstate` | Migrated to S3 |
| `terraform/terraform.tfstate.backup` | No longer relevant after S3 migration |

---

## Suggested Migration Order

1. **Bootstrap** — Create S3 bucket + DynamoDB table
2. **Migrate state** — `terraform init -migrate-state` to S3
3. **Networking module** — VPC, public subnets, IGW
4. **Security module** — SG with discrete rules, IAM
5. **Compute module** — Launch template, ASG
6. **DNS module** — Move records into module
7. **CI/CD** — GitHub Actions (`fmt -check`, `validate`, `plan` on PRs; `apply` on merge)
8. **Monitoring** — CloudWatch alarms, SNS
9. **Tear down old resources** — Remove old SG, old instance from state
