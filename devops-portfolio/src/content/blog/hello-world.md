---
title: "Hello World — Portfolio Site Migrated to Astro"
date: 2026-05-03
excerpt: "Migrated the portfolio from Create React App to Astro with a full blog setup. Here's what changed and why."
tags: ["astro", "devops", "meta"]
---

## Why Astro

The portfolio was running on Create React App, which is effectively abandoned. The bigger issue: I wanted a blog where I could drop markdown files and have them just work — dates, tags, search, images, the whole thing.

Astro has first-class content collections built in. Define a schema, drop `.md` files in `src/content/blog/`, and you get type-safe frontmatter, static page generation, and full markdown rendering with zero extra dependencies.

The existing React components (Hero, Projects, Skills, etc.) stay exactly as they are — Astro mounts them as interactive islands using `client:load` and `client:visible`. No rewrite needed.

## What Changed

- `react-scripts` removed, `astro` + `@astrojs/react` added
- `public/index.html` became `src/layouts/BaseLayout.astro`
- `src/pages/index.astro` replaces `App.tsx` as the entry point
- Blog lives at `/blog` with per-post pages at `/blog/[slug]`
- Search and tag/month filtering are a single React island (`BlogSearch.tsx`)

## Deployment

Nothing changed in CI/CD. GitHub Actions still runs `npm run build` and syncs the output to S3. Astro is configured to output to `build/` so the workflow is untouched.
