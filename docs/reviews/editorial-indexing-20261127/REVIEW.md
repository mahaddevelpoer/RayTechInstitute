# Article indexing release

Mahad requested all existing articles noindex and future articles limited to Pakistan education or global educational updates; he confirmed new educational articles should index.

Frozen inventory: 639 existing IDs/slugs, including all 638 article URLs in the live sitemap and the existing source-review article. Old content remains accessible with noindex, follow. The export finalizer removes noindex URLs from the sitemap while robots.txt keeps article crawling open.

Future indexing requires an educational category, editor-declared Pakistan/global educational scope, an HTTPS source reference and passing the existing source-review check. Categories and prompts in the article editor follow this policy. Source references and declared scope require actual human review; these checks do not automatically establish factual correctness. Existing articles cannot regain index eligibility by editing their category, review fields or one identity field.

Academic resource routes retain their indexing. No article records, PDFs, credentials, billing settings or database schema are changed. Existing unrelated staticOverrides.ts and Python cache changes are excluded.

Validation: focused indexing tests and 28 metadata/notes/syllabus tests passed. Final local typecheck passed. Final isolated artifact build 45959320276 passed every source, export, browser, academic resource and download check. Its HTML check confirmed all 639 article pages noindex/follow and excluded from the sitemap, the legacy endpoint noindex, and four academic samples still indexable. Local lint detects a pre-existing em dash in the uncommitted production snapshot; clean-source CI supplies the release lint result.

Publishing scope: the current request explicitly applies noindex on the website; standing editorial publication approval covers the static release for these article metadata changes. No new articles are being written or published in this release.

Deployment 45960116394 succeeded. Read-only custom-domain verification 45960334684 confirmed exact source revision 007c1f375bd1771cbc4ede33ce55d853a25d1c5a, all 639 existing article pages noindex/follow and absent from the sitemap, legacy article endpoint noindex, article crawling allowed and four academic sample routes still indexable. Evidence: live/checks.json. Google recrawl and search removal remain external to deployment verification.
