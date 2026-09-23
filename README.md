# Sujal's Portfolio

A responsive personal portfolio for Sujal Shakya, a computer science student focused on full-stack development, cybersecurity, and practical software projects.

Live site: [https://sujalshk.github.io/sujals-portfolio/](https://sujalshk.github.io/sujals-portfolio/)

## Technologies

- Semantic HTML5
- Modern CSS with responsive layouts and reduced-motion support
- Vanilla JavaScript
- GitHub Actions and GitHub Pages

## Features

- Responsive single-page portfolio with accessible navigation
- Featured-project carousel with keyboard support and pause controls
- Dedicated project gallery and full project collection
- Optimized WebP images and lazy loading
- Downloadable privacy-sanitized résumé
- SEO, Open Graph, favicon, sitemap, robots, and custom 404 metadata
- Automated validation, production build, and deployment workflow

## Project structure

```text
.
├── .github/workflows/       # GitHub Pages deployment
├── assets/
│   ├── css/                 # Shared stylesheets
│   ├── documents/           # Public résumé
│   ├── icons/               # Favicon
│   ├── images/              # Optimized portfolio images
│   └── js/                  # Shared scripts and project data
├── docs/                    # Supporting project documentation
├── projects/                # Project gallery routes
├── scripts/                 # Validation and production build scripts
├── 404.html                 # Custom not-found page
├── index.html               # Portfolio homepage
└── package.json             # Local commands
```

## Run locally

Requirements: Node.js 20 or newer and Python 3.

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000).

## Validate and build

```bash
npm test
npm run build
```

The production-ready site is written to `dist/`. Preview it locally with:

```bash
npm run preview
```

Then open [http://127.0.0.1:8080](http://127.0.0.1:8080).

## Deployment

Pushes to `main` run the GitHub Actions workflow in `.github/workflows/deploy-pages.yml`. The workflow validates the source, builds `dist/`, and deploys that artifact to GitHub Pages.

No production environment variables are required.
