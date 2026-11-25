# The Assay Index

Searchable catalog of 226 drug-development assays across 16 categories and 119 providers, with a three.js 3D book hero, a live 3D bench per assay (`js/lab3d.js`) and validation-evidence tiers A-D (`js/validation.js`). Live at [assays.pplx.app](https://assays.pplx.app).

Each assay records what it tests, relevant drug types, instruments, consumables, protocol steps, providers, and market/capacity notes.

## Structure

- `index.html` — entry point (static, no build step)
- `js/data*.js` — assay catalog data
- `js/app.js` — router, search, filters
- `js/book3d.js` — three.js 3D book scene (loaded from CDN)
- `css/style.css` — design system

## Run locally

```
python3 -m http.server 8000
```

## Contributing

Fork the repo, add an assay, and open a pull request. [CONTRIBUTING.md](CONTRIBUTING.md) covers the format, and [js/assay.template.js](js/assay.template.js) is a blank assay you can copy. Pull requests merge into this repo. The live site is published from `main` after review.

Licensed under [MIT](LICENSE).
