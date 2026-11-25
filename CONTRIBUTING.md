# Contributing

The Assay Index is a static site. There is no build step and no database. An assay is a JavaScript object, and a pull request that adds one gets merged into the catalog at [github.com/dhruvghulati/assay-index](https://github.com/dhruvghulati/assay-index). The live site at [assays.pplx.app](https://assays.pplx.app) is published from `main` after a merge.

## What belongs here

- An assay type used in drug development, with the instruments, steps and providers that run it.
- A provider added to an assay that already exists, when that provider publicly offers it.
- A correction to a name, a category, or a claim that is wrong.

## What does not

- Prices, turnaround times, or capacity numbers, unless the provider publishes that number on their own site and you link it.
- A provider you cannot point to on the provider's own website.
- Model comparisons, rankings, or "best CRO" claims.

## Add an assay

1. Fork the repo and branch off `main`.
2. Copy `js/assay.template.js` to `js/data-14-<topic>.js`. Keep the number higher than the existing data files.
3. Add one `<script>` tag for your file in `index.html`, after `js/data-13-gaps.js` and before `js/stages.js`.
4. If the category is new, add it in three places: the `CATEGORIES` map in `js/app.js`, the `BY_CAT` map in `js/stages.js`, and (only if you know the evidence) `js/validation.js`. Existing categories need none of this.
5. Open a pull request. The template fills in the checklist.

Run it locally before you open the PR:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`, search for your assay, and check the browser console is clean.

## Add a provider to an existing assay

Add the provider once to the `P` map (it lives in `js/data.js`, with later additions in `js/data-13-gaps.js`), then reference it with `pr("key", "what they actually run")`. Do not paste the same provider object into every assay.

## Rules for the text

- Say what the assay measures. Do not market it.
- Evidence describes the assay type, never a single provider. A tier in `js/validation.js` needs a public source.
- Keep provider notes factual and short, and only include a number when the provider publishes it.
