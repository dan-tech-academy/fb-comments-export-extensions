---
type: brainstorm
date: 2026-03-27
slug: github-pages-landing
status: agreed
---

# Brainstorm: GitHub Pages Landing Page

## Problem
Need product landing page for FB Comment Scraper Chrome Extension. Host via GitHub Pages in same repo.

## Evaluated Approaches

| Approach | Verdict | Reason |
|----------|---------|--------|
| GitHub Actions + /site | **Selected** | Clean separation, no conflict with docs/, flexible |
| gh-pages branch | Rejected | Harder to maintain alongside code |
| /docs folder | Rejected | Conflicts with project docs convention |
| Root index.html | Rejected | Mixes with extension files |

## Agreed Solution

**Stack:** Pure HTML/CSS/JS (no build, no deps — consistent with project)
**Deploy:** GitHub Actions workflow → GitHub Pages from `/site` folder
**Type:** Single page landing

### Structure
```
site/
├── index.html
├── style.css
└── assets/

.github/workflows/
└── deploy-pages.yml
```

### Page Sections
1. Hero — banner, tagline, CTA
2. Features — 5 features from README
3. How It Works — pipeline diagram
4. Installation — 3-step guide
5. Demo — demo.svg
6. Footer — DanTech Academy sponsor, MIT

## Risks
- Need to enable GitHub Pages (source: GitHub Actions) in repo settings
- SVG assets reference — may need to copy or adjust paths

## Next Steps
- Create implementation plan
- Implement landing page + workflow
