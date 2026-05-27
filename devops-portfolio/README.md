# DevOps Portfolio - Justin Carter

A cyberpunk-themed portfolio and blog built with Astro 5 and React, showcasing DevOps expertise and cloud infrastructure skills.

Live site: https://justinmemphis.com

## Tech Stack

- **Framework**: Astro 5 (static output, content collections for blog)
- **Components**: React 19 + TypeScript, mounted as Astro islands
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Fonts**: JetBrains Mono (self-hosted via @fontsource)
- **Styling**: Custom CSS with CSS variables — dark/cyberpunk theme, no CSS framework

## Local Development

Requires Node.js 25.

```bash
npm install
npm start       # dev server at http://localhost:4321
npm run build   # production build to build/
```

## Project Structure

```
src/
├── components/          # React components (islands)
│   ├── Navigation.tsx/css
│   ├── Hero.tsx/css
│   ├── Projects.tsx/css
│   ├── Skills.tsx/css
│   ├── Contact.tsx/css
│   ├── Footer.tsx/css
│   └── BlogSearch.tsx/css
├── content/
│   └── blog/            # Markdown blog posts
├── layouts/
│   └── BaseLayout.astro # Shared head, nav, footer, analytics
├── pages/
│   ├── index.astro      # Homepage
│   └── blog/
│       ├── index.astro  # Blog listing with search/filter
│       └── [slug].astro # Individual post
├── App.css              # Global CSS variables and theme
└── index.css            # Base body styles
```

## Publishing a Blog Post

Drop a `.md` file in `src/content/blog/` with this frontmatter:

```markdown
---
title: "Your Post Title"
date: 2026-05-03
excerpt: "One sentence summary shown in the listing."
tags: ["aws", "terraform"]
coverImage: "/blog/your-image.png"  # optional
---

Post content here...
```

Push to `main` — the CI pipeline builds and deploys automatically.

## Deployment

Fully automated via GitHub Actions (`.github/workflows/pr-checks.yml`):

1. Astro builds the site (`npm run build`)
2. Build output syncs to S3
3. SSM Run Command pulls from S3 to `/var/www/portfolio/` on EC2

No SSH key or open port 22 required. Auth uses OIDC federation.

## Contact

Justin Carter — Memphis, TN
- Email: jcarter82@gmail.com
- LinkedIn: [justin-carter-memphis](https://www.linkedin.com/in/justin-carter-memphis/)
- GitHub: [Justinmemphis](https://github.com/Justinmemphis)
