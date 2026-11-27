# Scoped article indexing verification

## Confirmed

The live sitemap baseline contained 638 article detail URLs. The frozen inventory contains 639 existing articles, including the previously withheld source-review page. The initial isolated build (45958447235) passed lint, type checking, source tests, academic integrity checks, SEO export checks and browser navigation checks. Its exported HTML verification confirmed 639 article pages with noindex, follow and no sitemap entries, plus four still-indexable academic resource samples.

The final source adds server metadata for the legacy /blogs/post/ endpoint and allows it to be crawled. This final build and live deployment still require verification before completion is recorded.

Future article eligibility is separate from the frozen list: educational category, editor-declared educational scope, an HTTPS source reference, and no existing source-review flag. The scope declaration is an editorial responsibility, not automated fact verification.

## Unknown

No Search Console evidence in this task establishes why clicks fell, whether Google has recrawled individual pages, or whether this change will improve rankings. A successful export/deployment does not prove Google removal or ranking recovery. Google processes noindex after crawling the page.

## Scope

Only article indexing and future editorial controls are changed. Existing archive content remains accessible. Class resources and academic URLs retain their indexing rules. No full-site security audit or new content batch is part of this release.
