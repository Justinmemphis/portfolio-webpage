# Portfolio Roadmap

Goals and initiatives for the portfolio site, ordered by priority. Infrastructure migration history lives in `docs/archive/`.

---

## 1. Blog (Highest Priority)

A blog section where posts can be written and shared via LinkedIn or other social platforms.

**Goals:**
- Route: `/blog` index listing all posts; `/blog/<slug>` for individual posts
- Posts written in Markdown, stored as flat files in `src/posts/` (no CMS, no database)
- Build-time rendering via a Markdown parser (e.g. `react-markdown` + frontmatter via `gray-matter`)
- Each post has frontmatter: `title`, `date`, `slug`, `excerpt`, `tags`
- Social sharing: Open Graph meta tags on each post page (title, description, image)
- RSS feed (`/rss.xml`) so readers can subscribe
- Responsive, readable typography — optimized for long-form reading
- Easy workflow: drop a `.md` file in `src/posts/`, rebuild, deploy

**Open questions:**
- Static generation vs. runtime fetch? (CRA doesn't support SSG natively — consider migrating to Vite + a simple static approach, or using `import.meta.glob` if switching to Vite)
- Image hosting for post images: S3 public bucket vs. checked into repo?

---

## 2. SEO Optimization

**Goals:**
- Add `<meta name="description">` and canonical `<link>` tags to all pages
- Structured data (JSON-LD): `Person` schema on homepage, `BlogPosting` schema on each post
- Open Graph and Twitter Card tags on all pages
- `sitemap.xml` generated at build time and submitted to Google Search Console
- `robots.txt` present and correct
- All page `<title>` tags unique and descriptive (not just "Justin Carter")
- Core Web Vitals: LCP, CLS, FID targets met (monitor via Search Console)
- Register site with Google Search Console and submit sitemap

**Baseline check:**
Run Lighthouse SEO audit and record current score before starting.

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

## 3a. CRA → Astro Migration (in progress)

Replacing CRA with Astro. Astro has first-class markdown/content support, built-in content collections, and can keep existing React components as interactive islands.

### Phase 1 — Core setup
- [x] Document migration steps
- [ ] Install `astro`, `@astrojs/react`, remove `react-scripts`
- [ ] Add `astro.config.mjs` (React integration, static output, `outDir: 'build'` to keep CI unchanged)
- [ ] Update `tsconfig.json` to extend Astro's base config
- [ ] Update `package.json` scripts: `start` → `astro dev`, `build` → `astro build`
- [ ] Migrate `public/index.html` → `src/layouts/BaseLayout.astro` (head tags, analytics, meta)
- [ ] Create `src/pages/index.astro` — homepage that mounts existing React components as islands (`client:load` / `client:visible`)
- [ ] Delete CRA-only files: `src/react-app-env.d.ts`, `src/reportWebVitals.ts`, `src/setupTests.ts`
- [ ] Verify dev server and production build work
- [ ] Confirm CI passes (GitHub Actions `npm run build` is unchanged)

### Phase 2 — Blog
- [ ] Define content collection in `src/content/config.ts` — schema: `title`, `date`, `slug`, `tags`, `excerpt`, optional `coverImage`
- [ ] Create `src/content/blog/` — drop `.md` files here to publish
- [ ] `src/pages/blog/index.astro` — listing page, sorted by date desc, with tag filter + search bar (React island using Fuse.js)
- [ ] `src/pages/blog/[slug].astro` — individual post page with `getStaticPaths`
- [ ] `src/layouts/BlogLayout.astro` — post layout with title, date, tags, reading time
- [ ] Images — `public/blog/` for post screenshots, referenced as `/blog/image.png` in markdown
- [ ] Open Graph meta tags per post (`title`, `description`, `og:image`)
- [ ] Add Blog link to Navigation component
- [ ] Write first post to validate end-to-end

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

## Reference

- [AWS-COST-ANALYSIS.md](AWS-COST-ANALYSIS.md) — cost breakdown per phase
- `docs/archive/` — completed migration plan, deployment guide, and infrastructure phase log
