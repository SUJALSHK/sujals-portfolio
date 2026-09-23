# Portfolio Production Checklist

This document records the production-readiness work completed for Sujal's Portfolio.

## Completed

- Reorganized shared styles, scripts, images, icons, and documents under `assets/`
- Replaced duplicate project-page code with shared project data and gallery rendering
- Replaced placeholder links with verified project URLs or clear “Coming Soon” states
- Added accessible navigation, visible keyboard focus, a skip link, and reduced-motion support
- Added an accessible featured-project carousel with pause and keyboard controls
- Optimized profile and project images as WebP assets
- Added page metadata, Open Graph tags, a favicon, sitemap, robots file, and custom 404 page
- Sanitized the downloadable resume for public distribution
- Added automated validation, production build, and GitHub Pages deployment workflows
- Verified the production build at desktop and mobile viewport sizes

## Ongoing content updates

- Add public demo and repository links for the Ghost Student Prevention System when ready
- Keep project descriptions, technologies, screenshots, and links current
- Replace the public DOCX resume with a PDF later if a final PDF version is prepared
- Review portfolio copy and resume content before each internship application cycle

## Release checks

Run these commands before publishing changes:

```bash
npm test
npm run build
npm run preview
```

Then verify the homepage, project gallery, all-projects page, external links, responsive layout, and browser console.
