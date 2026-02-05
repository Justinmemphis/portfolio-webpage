# AWS Cost Analysis — Enterprise Migration

Region: us-east-1 | Billing basis: 730 hrs/month (24/7) | Prices as of Feb 2026
Account is **outside the 12-month AWS free tier**. Only always-free tier allowances are counted.

**Decisions locked in:** No NAT Gateway, no ALB. Total migration cost delta: **$0.00/month**.

---

## Current Baseline

| Resource | Unit Price | Qty | Monthly |
|---|---|---|---|
| EC2 t3.micro (on-demand) | $0.0104/hr | 730 hrs | $7.59 |
| EBS gp3 10 GB | $0.08/GB | 10 GB | $0.80 |
| Elastic IP (public IPv4) | $0.005/hr | 730 hrs | $3.65 |
| Route 53 hosted zone | $0.50/zone | 1 | $0.50 |
| Data transfer out | ~$0.09/GB | ~1 GB | $0.09 |
| **Current Total** | | | **$12.63** |

---

## Phase 1 — Remote State Backend

| Resource | Unit Price | Usage Estimate | Monthly |
|---|---|---|---|
| S3 storage (state files) | $0.023/GB | < 1 MB with versions | $0.00 |
| S3 PUT requests | $0.005/1K | ~100 requests | $0.00 |
| S3 GET requests | $0.0004/1K | ~200 requests | $0.00 |
| DynamoDB on-demand (locks) | per-request | ~60 lock/unlock ops | $0.00 |
| KMS API calls (S3 SSE) | $0.03/10K | ~300 calls | $0.00 |

KMS (20K req/month) and DynamoDB storage (25 GB) are always-free tier — no expiration.
S3 12-month free tier is expired, but actual cost at this usage is < $0.01/month.

| | Monthly Delta | Running Total |
|---|---|---|
| **Phase 1** | **+$0.00** | **$12.63** |

---

## Phase 2 — Networking (VPC, public subnets only)

| Resource | Unit Price | Qty | Monthly |
|---|---|---|---|
| VPC | Free | 1 | $0.00 |
| Subnets (public) | Free | 2 | $0.00 |
| Internet Gateway | Free | 1 | $0.00 |
| Route Tables | Free | 2 | $0.00 |

NAT Gateway skipped — saves $32.85/month ($394.20/yr).

| | Monthly Delta | Running Total |
|---|---|---|
| **Phase 2** | **+$0.00** | **$12.63** |

---

## Phase 3 — Compute (Launch Template + ASG)

| Resource | Unit Price | Qty | Monthly |
|---|---|---|---|
| Launch Template | Free | 1 | $0.00 |
| Auto Scaling Group | Free | 1 | $0.00 |
| IAM Role / Instance Profile | Free | 1 | $0.00 |
| EC2 t3.micro (unchanged) | — | — | $0.00 delta |

Same instance type, same volume. ASG is a management wrapper — no additional cost.

| | Monthly Delta | Running Total |
|---|---|---|
| **Phase 3** | **+$0.00** | **$12.63** |

---

## Phase 4 — DNS Module

Reorganization only. No new resources. EIP + Certbot retained.

| | Monthly Delta | Running Total |
|---|---|---|
| **Phase 4** | **+$0.00** | **$12.63** |

---

## Phase 5 — Security Hardening

| Resource | Unit Price | Qty | Monthly |
|---|---|---|---|
| Security Group | Free | 1 | $0.00 |
| IAM Roles / Policies | Free | 1 | $0.00 |
| SSM Parameter Store (std) | Free | < 10 params | $0.00 |

| | Monthly Delta | Running Total |
|---|---|---|
| **Phase 5** | **+$0.00** | **$12.63** |

---

## Phase 6 — CI/CD (GitHub Actions)

| Resource | Cost | Note |
|---|---|---|
| GitHub Actions | Free tier | 2,000 min/month (public) or paid plan |
| IAM OIDC Provider | Free | |
| IAM Role for CI | Free | |

No AWS cost. GitHub Actions billing is GitHub-side, not AWS.

| | Monthly Delta | Running Total |
|---|---|---|
| **Phase 6** | **+$0.00** | **$12.63** |

---

## Phase 7 — Monitoring

| Resource | Unit Price | Qty | Monthly |
|---|---|---|---|
| CloudWatch alarms | $0.10/alarm | 3 alarms | $0.00 |
| CloudWatch log ingestion | $0.50/GB | < 1 GB | $0.00 |
| SNS email notifications | Free | < 1,000/month | $0.00 |

All within always-free tier (10 CloudWatch alarms, 5 GB log ingestion, 1,000 SNS emails — none of these expire).

| | Monthly Delta | Running Total |
|---|---|---|
| **Phase 7** | **+$0.00** | **$12.63** |

---

## Summary

| Phase | Delta | Running Total |
|---|---|---|
| **Current** | — | **$12.63** |
| Phase 1: State Backend | +$0.00 | $12.63 |
| Phase 2: Networking | +$0.00 | $12.63 |
| Phase 3: Compute | +$0.00 | $12.63 |
| Phase 4: DNS | +$0.00 | $12.63 |
| Phase 5: Security | +$0.00 | $12.63 |
| Phase 6: CI/CD | +$0.00 | $12.63 |
| Phase 7: Monitoring | +$0.00 | $12.63 |

### Bottom Line

| | Monthly | Annual |
|---|---|---|
| Current cost | $12.63 | $151.56 |
| Post-migration cost | $12.63 | $151.56 |
| **Total increase** | **$0.00** | **$0.00** |

### Cost Avoidance (decisions already made)

| Skipped Resource | Monthly Savings | Annual Savings |
|---|---|---|
| NAT Gateway | $32.85 | $394.20 |
| ALB + ALB IPv4 (2 AZ) | $26.28 | $315.36 |
| EIP removal (not needed w/o ALB) | $0.00 | $0.00 |
| **Total avoided** | **$59.13** | **$709.56** |

### Future cost reduction opportunity

- **Reserved Instance**: A 1-year t3.micro RI (no upfront) drops EC2 from $7.59 to ~$4.97/month (-$31.44/yr).
