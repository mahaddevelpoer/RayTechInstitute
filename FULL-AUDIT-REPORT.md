# Website discovery and security audit: 23 November 2026

Scope: homepage, class/subject/chapter discovery, representative academic resource routes, public crawl controls, application authentication/request boundaries and production dependencies. Source review and bounded read-only live checks were combined with local regression tests. This is not a destructive penetration test or a ranking assessment. Overall rating: confirmed improvements prepared; full export verification and production release pending. A numeric SEO score is not assigned because field performance and Search Console evidence are unavailable.

## Findings and implemented fixes

| Area | Severity | Confidence | Finding and evidence | Fix |
|---|---|---|---|---|
| Discovery | Warning | Confirmed | DIT subjects were behind client-state buttons in ClassesClientView; class-directory raw HTML lacked their anchors. | Added an initially rendered published-resource finder with ordinary subject/chapter links and class/topic filters. |
| Resource availability | Warning | Confirmed | AcademicDirectory generated notes, MCQ and past-paper links even when the matching count was zero. | Per-type availability is derived from the published catalogue; unavailable resources are clearly labelled. |
| Page identity | Warning | Confirmed | Every class h1 said Choose your subject; DIT search metadata exceeded repository length targets. | Class-specific headings, concise DIT class/ICT-note metadata; original routes and content titles preserved. |
| Data delivery | Warning | Confirmed | Several public home components and video player imported staticCatalog, pulling the global publication snapshot into the initial source graph. | Generated compact navigation, video-only questions and academic-only resource exports. Initial home diagnostic fell from about 3.64 MB to 93 KB gzip. This is not a field speed score. |
| Structured data | Info | Confirmed | WebSite publisher used a YouTube URL while organisation used the website URL. | Shared website organisation @id/url; retained YouTube under sameAs. |
| Admin access | Warning | Confirmed | secure-dispatch omitted explicit validSince token-revocation checking. | Project/expiry/UID/provider checks plus exact-token Google lookup and revocation-boundary enforcement. |
| Request work | Warning | Confirmed | secure-dispatch parsed an unbounded pre-authentication JSON body. | POST/JSON gates, streamed 2 MB limit, eight-second upload bound and safe status responses; preflight preserved. |
| Dependencies | Warning | Confirmed | Lockfile audit reported vulnerable Next and re2js releases. | Patched supported versions; follow-up production lockfile audit reports zero known advisories. |

## Healthy controls preserved

Eight representative live pages were checked. The live sitemap contained 761 unique apex URLs with public routes and no sampled admin/empty Chemistry entries. Checked DIT pages returned 200 with self-canonicals, one h1 and parseable JSON-LD. Empty Chemistry resources remained noindex; a missing route returned a real 404 and noindex. Tested private configuration/git/package paths returned 404. Public/admin pages supplied HSTS, framing, nosniff, referrer, permissions and CSP headers; unauthenticated admin verification returned 401.

Local tests covered administrator verification, actual request-handler rejection, SQL role isolation and atomic quotas, practice frame isolation, bilingual quiz behaviour and preservation of the seven ICT banks/PDFs. Complete export/browser gates and screenshots must pass before release readiness is reported.

## Unknowns and follow-ups

- No general live crawl/index blocker was confirmed. Public eligibility does not establish Google indexing or explain the reported traffic loss. Search Console evidence remains required.
- Anonymous PageSpeed returned 429; measured field LCP/INP/CLS remain unknown. Python skill helpers lacked requests; bounded Node HTTP checks supplied fallback evidence. A schema helper warning about the @graph envelope was a false positive; typed graph nodes parsed correctly.
- Durable trusted notification throttling, Firebase console MFA/API restrictions and complete live RLS policy inventory remain unverified or external work. CSP retains inline hydration support; its presence is not evidence of a demonstrated XSS exploit.
- Findings are implemented locally. The non-editorial website changes and secure-dispatch function are not deployed. See docs/student-access-security-20261123.md and ACTION-PLAN.md for validation and release boundaries.

## Earlier focused review retained below

# Focused keyword implementation review

## 30 October 2026 follow-up

Confirmed: the www TLS/canonicalisation finding from the supplied Rank Math PDF is resolved. CLI checks now return HTTPS www 301 to the apex, then apex 200, without bypassing certificate verification. The PDF's mobile-speed item says the test failed to execute; no new performance score is asserted.

Completed locally: all 79 trend drafts, seven categories, 26,908 prose words, 30 or more curated relevant terms per article, unique metadata/slugs, source links and twelve downloaded licensed network assets. No image generation, production content write or publication. See `docs/seo/analyzer-follow-up.md` and `content/editorial-drafts/trending-pk-20261030/validation.json` for evidence and limits. TypeScript and seven SEO regression tests passed.

Scope: report-driven review of resource-page and programming metadata templates, not a new full-site crawl or a ranking assessment. Source: user-supplied deep-research-report.md. The supplied Markdown contains 100 keyword rows; the linked 1,000-row CSV/XLSX and authenticated demand data were unavailable. All search-volume claims remain unverified.

## Confirmed findings and changes
1. Long class/subject titles were passed through buildSeoTitle, which can truncate the final resource intent. Added buildResourceSeoTitle to preserve Notes PDF, MCQs & Answers and Past Papers; applies to generated resource listings. Evidence: src/utils/seo.ts and the three resource generateMetadata functions.
2. Past-paper H1 said Official Board Past Papers across subjects; changed it to the actual class/subject and Past Papers. Notes H1 now includes the actual class as well. These headings describe available resources without manufacturing board coverage.
3. Empty notes, MCQ and past-paper listings inherited indexable metadata. Their listing templates now emit noindex/follow when the corresponding static resource array is empty; filled listings remain indexable. Existing export finalisation excludes noindex pages from sitemap. This is not a deletion of their URLs.
4. Gazette metadata omitted class in the search title. It now retains the year/class and Gazette purpose alongside board context.
5. Programming language hubs now explicitly describe tutorial/coding-practice intent. Course H1 and home introductory text identify programming courses, class notes, chapter MCQs and past papers. No class restriction is added to brand identity.

## Research boundaries
The Top 100 keyword-to-hub candidates are in docs/seo/research-keyword-map.csv. They are editorial candidates, not proof that a particular board PDF or pairing scheme exists. No duplicated city/board pages were generated. The report's inaccessible sandbox citations are not adopted as verified references. No official affiliation, search-volume figures, result dates, backlinks or ranking guarantees were invented.

## Validation
Project TypeScript passed. Existing metadata/schema tests passed (7 tests). Release pipeline will rebuild catalogs, regenerate sitemap, check metadata and private credentials, and verify live export before a successful release is reported. No new Core Web Vitals field score or Search Console ranking measurement was collected in this review.

6. Competition home and rules retained pre-launch noindex even after release. Removed that pre-launch restriction for these two useful public pages. Private/personal result and gameplay routes retain their existing indexing policy. Sitemap regeneration discovers the newly indexable canonical pages.
