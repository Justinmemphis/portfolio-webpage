# Portfolio Roadmap

Goals and initiatives for the portfolio site, ordered by priority. Infrastructure migration history lives in `docs/archive/`.

---

## 1. Blog ✅ (largely complete)

A blog section where posts can be written and shared via LinkedIn or other social platforms.

**Implemented:**
- [x] Route: `/blog` index listing all posts; `/blog/<slug>` for individual posts
- [x] Posts written in Markdown, stored in `src/content/blog/` (Astro content collections — no CMS, no database)
- [x] Build-time rendering via Astro SSG and content collections (supersedes react-markdown/gray-matter approach)
- [x] Frontmatter schema: `title`, `date`, `excerpt`, `tags`, `coverImage`
- [x] Open Graph meta tags on each post page (title, description, og:image)
- [x] BlogPosting JSON-LD structured data on each post
- [x] Search bar + tag filter (React island using Fuse.js)
- [x] Responsive, readable typography with markdown body styles
- [x] Cover image rendered on post pages
- [x] Easy workflow: drop a `.md` file in `src/content/blog/`, push to main, auto-deploys
- [x] First post published to validate end-to-end

**Still pending:**
- [ ] RSS feed (`/rss.xml`) — use `@astrojs/rss`

**Resolved decisions:**
- Static generation: Astro SSG (no CRA/Vite needed)
- Image hosting: images checked into repo under `public/images/blog/`

---

## 2. SEO Optimization (largely complete)

**Implemented:**
- [x] `<meta name="description">` on all pages (via BaseLayout)
- [x] Open Graph and og:title / og:description on all pages; og:image on blog posts
- [x] `Person` JSON-LD schema on homepage; `BlogPosting` schema on each post
- [x] `sitemap.xml` generated at build time via `@astrojs/sitemap`
- [x] `robots.txt` present and correct
- [x] Unique, descriptive `<title>` tags on all pages

**Still pending:**
- [ ] Canonical `<link rel="canonical">` tag in BaseLayout
- [ ] Twitter Card meta tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [ ] Core Web Vitals: LCP, CLS, FID — monitor via Google Search Console
- [ ] Register site with Google Search Console and submit sitemap

---

## 3. Accessibility / Google Lighthouse

**Goals:**
- Hit Lighthouse Accessibility score ≥ 95 across all pages
- Audit checklist:
  - [ ] All images have meaningful `alt` text (or `alt=""` for decorative)
  - [ ] Color contrast ratios meet WCAG AA (4.5:1 for normal text, 3:1 for large)
  - [ ] Interactive elements (buttons, links) have visible focus indicators
  - [ ] Form inputs (if any) have associated `<label>` elements
  - [ ] Semantic HTML throughout: `<main>`, `<nav>`, `<section>`, `<article>`, `<header>`, `<footer>`
  - [ ] Keyboard navigation works for all interactive elements
  - [ ] Skip-to-content link at top of page
  - [ ] ARIA attributes only where native HTML falls short
  - [ ] Animations respect `prefers-reduced-motion`
  - [ ] All icons (React Icons) have `aria-label` or are hidden from screen readers via `aria-hidden`
- Run Lighthouse in CI (via `lighthouse-ci` GitHub Action) to prevent regressions

---

## 3a. CRA → Astro Migration ✅ (complete)

Replaced CRA with Astro. Astro has first-class markdown/content support, built-in content collections, and keeps existing React components as interactive islands.

### Phase 1 — Core setup ✅
- [x] Document migration steps
- [x] Install `astro`, `@astrojs/react`, remove `react-scripts`
- [x] `astro.config.mjs` (React integration, static output, `outDir: 'build'`)
- [x] `tsconfig.json` extended from `astro/tsconfigs/strict`
- [x] `package.json` scripts: `start` → `astro dev`, `build` → `astro build`
- [x] `src/layouts/BaseLayout.astro` (head tags, analytics, meta)
- [x] `src/pages/index.astro` — homepage mounts React components as islands (`client:load` / `client:visible`)
- [x] CRA-only files deleted (`react-app-env.d.ts`, `reportWebVitals.ts`, `setupTests.ts`)
- [x] Dev server and production build working
- [x] CI passes (GitHub Actions `npm run build`)

### Phase 2 — Blog ✅
- [x] Content collection defined in `src/content.config.ts` — schema: `title`, `date`, `tags`, `excerpt`, `coverImage`
- [x] `src/content/blog/` — drop `.md` files here to publish
- [x] `src/pages/blog/index.astro` — listing page, sorted by date desc, with tag filter + search (Fuse.js island)
- [x] `src/pages/blog/[slug].astro` — individual post page with `getStaticPaths`
- [x] Post layout with title, date, tags, cover image (inline in `[slug].astro`)
- [x] Images in `public/images/blog/`, referenced as `/images/blog/image.png` in markdown
- [x] Open Graph meta tags per post
- [x] Blog link in Navigation component
- [x] First post written and deployed

---

## 4. CI Pipeline Improvements

The Terraform infrastructure migration (Phases 1–8) is complete. Next priorities for the CI/CD setup:

### 4a. Testing & Security Scanning
- [ ] Unit tests: Jest + React Testing Library for React components
- [ ] E2E tests: Playwright smoke tests (homepage loads, nav works, resume download link resolves)
- [ ] IaC security scanning: `tfsec` or `checkov` in CI pipeline
- [ ] `npm audit` in CI workflow
- [ ] Terraform native tests (`terraform test`) for module validation

### 4b. Lighthouse CI
- [ ] Add `@lhci/cli` to dev dependencies
- [ ] Add GitHub Actions step: run Lighthouse against preview build and post scores as PR comment
- [ ] Set budget thresholds (fail PR if score drops below baseline)

### 4c. Blue/Green Deploys
- [ ] Use ASG instance refresh with launch template versioning for zero-downtime deploys
- [ ] Currently: new build syncs to S3, SSM Run Command pulls and restarts Nginx

### 4d. Staging Environment
- [ ] Add `environments/dev/` Terraform root (smaller instance type)
- [ ] CI deploys `main` to staging automatically; production deploy requires manual approval gate
- [ ] Separate S3 bucket + state key for dev

### 4e. Operational
- [ ] AWS Budgets alarm for monthly spend threshold
- [ ] EBS snapshot schedule via AWS Backup
- [ ] Nginx rate limiting for basic DDoS mitigation

---

## 5. Claude Code Project Skills

Custom slash commands to build for this repo's development workflow:

- [ ] `/new-post` — Scaffold a new blog post in `src/content/blog/` with frontmatter pre-filled (title, UTC date, empty excerpt/tags/coverImage). Prevents the timezone bug class and removes manual frontmatter setup on every new post.
- [ ] `/lighthouse` — Build the site locally and run `@lhci/cli` against the output to audit SEO, accessibility, and performance scores before pushing. Prototype for the CI Lighthouse integration in 4b; requires adding `@lhci/cli` to devDependencies.

---

## Reference

- [AWS-COST-ANALYSIS.md](AWS-COST-ANALYSIS.md) — cost breakdown per phase
- `docs/archive/` — completed migration plan, deployment guide, and infrastructure phase log
