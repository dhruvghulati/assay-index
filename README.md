# The Assay Index

Searchable catalog of 162 drug-development assays across 12 categories and 48 providers, with a three.js 3D book hero. Live at https://assays.pplx.app

Each assay records what it tests, relevant drug types, instruments, consumables, protocol steps, providers, and market/capacity notes.

## Structure
- `index.html` — entry point (static, no build step)
- `js/data*.js` — assay catalog data
- `js/app.js` — router, search, filters
- `js/book3d.js` — three.js 3D book scene (loaded from CDN)
- `css/style.css` — design system

## Run locally
    python3 -m http.server 8000
