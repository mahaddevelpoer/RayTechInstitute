# 26 October 2026: supplied mobile PageSpeed report follow-up

See [PAGESPEED-LOCAL-REPORT.md](PAGESPEED-LOCAL-REPORT.md) for the observed 65/66 mobile baseline, confirmed causes, local fixes, 68 passing targeted tests and responsive component checks. No deployment or push was performed. Strict CSP/Trusted Types and framework-polyfill advisories remain open; a fresh production export and PageSpeed run are still required before claiming all warnings are cleared.

# SEO review and local fixes: 26 October 2026

## Scope and publication status

This is a technical and on-page review of release `0155d2ba89dbd107fe50495804fb0bc8ba4b430c`, using its downloaded 144-document HTML export, its 103 indexable pages, current read-only HTTPS responses and local source tests. The existing historical reports below are retained; their old release/source-sync statuses do not describe today's repository.

The owner requires explicit approval before each new publication. The rule is recorded in AGENTS.md. This change set has not been committed, pushed, dispatched, deployed or applied to production data. Live pages continue to serve the previously approved release. No new complete Next export was compiled locally, to avoid another heavy build on the owner's machine. Local source checks are not a substitute for the final export/browser checks before a future approved release.

Readiness: local changes prepared for review. No numeric SEO score, ranking promise or Core Web Vitals pass is claimed.

## Confirmed findings and fixes

| Area | Severity and confidence | Baseline evidence | Local fix or decision |
| --- | --- | --- | --- |
| Metadata uniqueness | Warning, Confirmed | Two duplicate title groups; 24 quiz descriptions identical; two course descriptions identical. | Lesson/quiz titles reserve their language and page-purpose prefix before shortening. Contextual descriptions and actual-generator tests cover 50 lesson, quiz and course metadata routes. |
| Social previews | Warning, Confirmed | 38 public pages had no Open Graph image; nine had no Twitter image. | Added a reviewed 1200 by 630 first-party PNG, explicit image defaults on resource pages, and complete social metadata on learning/directory/legal pages. Final new export validation remains pending. |
| Private indexing | Warning, Confirmed | Twelve admin HTML files inherited index/follow. A verified live X-Robots-Tag already says noindex/nofollow/noarchive. | Added a server metadata layout and preserved the original client authorization shell. No breach or new public access is claimed. Assignment gates and held/unverified articles retain their intentional noindex behavior. |
| Internal discovery | Warning, Confirmed | /quizzes/ was unreachable in the initial HTML link graph. No missing internal page target was found. | Added ordinary courses and programming-test links to the footer. Footer headings now use h2 rather than jumping to h4. Existing URLs are unchanged. |
| Honest descriptions and schema | Warning, Confirmed | Some class/notes metadata promised official, solved or complete coverage regardless of available content. Gazette collection metadata named boards as publisher of the website's directory. | Descriptions now refer to available resources. Directory publisher is RayTech Institute. Lesson and quiz JSON-LD reflects actual objectives, questions and answers, with breadcrumbs. Held articles are excluded from the blog directory's structured article list. No fabricated ratings, timing or search action was added. |
| Shared image delivery | Info, Confirmed | Avatar and banner JPEGs total 174,345 bytes. | New WebP variants total 41,406 bytes, a reduction of about 76%. Original JPEG URLs remain. Banner dimensions are corrected, and primary article images have explicit loading priority. This is a resource saving, not a measured LCP improvement. |
| Export regression protection | Info, Confirmed | The previous gate did not reject duplicate descriptions/titles, absent OG images or inherited admin HTML indexing. | Added those checks plus image alt/dimensions, canonical uniqueness and JSON-LD parsing. Synthetic good/bad exports prove the gate rejects the relevant regressions. |

## Checklist against the requested work

| Item | Status and practical limit |
| --- | --- |
| Sitemap and robots.txt | Confirmed baseline: actual sitemap and robots files downloaded; the existing finalizer derives URLs from exported canonical HTML and excludes protected/noindex routes. Preserve that generator. |
| Noindex | Keep private/admin, assignment gates and source-held content out of the index. Admin HTML source correction is staged locally. Do not remove all noindex directives blindly. |
| Canonical and HTTPS | Baseline canonical tags are unique HTTPS URLs. Live HTTPS returns 200 with HSTS and the existing security policy. New local origin validation rejects HTTP, credentials and non-origin paths. |
| Meta titles and descriptions | Duplicates fixed in local source and tested using the actual route generators. Subject/resource descriptions were made factual and bounded. |
| One h1 and heading hierarchy | No missing/extra h1 or main-content heading skip was found in the indexable snapshot. Footer levels improved locally. |
| Alt text and layout space | No missing alt attributes or image dimensions found in the indexable snapshot. New assets retain meaningful alt text and explicit dimensions. |
| Schema | Baseline JSON-LD parses. Contextual learning/quiz schemas added locally, answers checked against actual published banks, and inline script escaping tested. Schema does not promise a rich result. |
| Internal and broken links | Baseline has zero missing internal page targets; the programming-test directory gets an explicit inbound link. Third-party URL availability was not exhaustively rechecked. |
| Image compression | Shared logo/banner variants compressed and visually reviewed; a small correctly sized social card is present. External-hosted article images were not copied or recompressed. |
| Core Web Vitals | Unverified. Public mobile PageSpeed API returned HTTP 429. No field LCP/INP/CLS or fresh Lighthouse score is available. |
| Mobile responsiveness | Previously approved CI checked 15 routes at desktop and mobile widths. This batch keeps the existing responsive layout and tests metadata/assets; a fresh complete export/mobile browser pass remains part of the future release checklist. |
| Clean slugs | Existing class, lesson, quiz and document slugs are preserved. No unnecessary URL rename or redirect was introduced. |
| Open Graph image | Added locally and validated at 1200 by 630 pixels. It is not yet live. |
| Search Console | Pending by owner decision until raytechinstitute.com is purchased and serves HTTPS. Optional public HTML-token support is prepared but not fabricated or activated. |
| Backlink strategy | Written in SEO-BACKLINK-STRATEGY.md. No messages, account changes, paid placements or invented backlinks. |

## Evidence and verification

- Machine-readable baseline: `artifacts/seo-review-2026-10-26/baseline.json`.
- Live response evidence: `live-headers.json`, `admin-headers.json`, `robots.txt`, `sitemap.xml` and `pagespeed-mobile-limitation.json` in the same directory.
- Deduplicated findings: `findings-verified.json`, produced by the repository SEO skill's finding verifier.
- Targeted tests: actual metadata uniqueness/lengths, correct social URLs, real learning schema answers, private indexing layout, compressed image integrity, HTTPS-origin rejection and rendered footer links.
- Final local verification: 78 targeted tests passed, including admin access/authentication, note publishing, DOM sandbox and snapshot regressions. TypeScript passed and lint checked 321 source files successfully. The export-gate test was rerun successfully after correcting a lint false positive in its image-matching expression. Historical test totals below are not current acceptance evidence.
- Original pre-review report files were copied into the ignored evidence directory before this section was prepended.

## External and release work still required

The owner confirmed the domain purchase and Search Console registration have not happened yet. Follow SEO-DOMAIN-CHECKLIST.md after purchase. Do not change canonical origin, DNS, authentication origins or ownership state speculatively. After a later explicit publication approval, generate and verify the complete new export, check updated social metadata and mobile navigation, then verify the exact live revision. Field performance and actual indexing must be checked separately when data exists.

References: [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [Core Web Vitals](https://web.dev/articles/vitals), [Search Console setup](https://developers.google.com/search/docs/monitor-debug/search-console-start).

---

# Live release verification: 20 October 2026

This checkpoint supersedes older launch-readiness claims. Confidence: confirmed for the specific automated checks below, not a claim that every real-user flow is error-free.

- Firebase Hosting live deployment completed at https://raytechinstitute.web.app. All 134 index HTML routes returned HTTP 200 and matched the local exported HTML byte-for-byte. Public `.env` returned 404.
- Static build exported 24 reviewed lessons across five languages, including 20 concise Python core units. There are 76 unwritten units in the requested five-language, twenty-topic-per-language scope. Do not market the full curriculum as complete.
- Technical SEO audit passed 121 public content pages, 93 indexable sitemap URLs and single-title/description/canonical/h1 checks. No search-ranking or live Core Web Vitals measurement is claimed.
- Local link audit checked 7,148 references across 138 HTML files, with no missing local target. Export credential scan checked 380 public files with no configured private credential or private-token-pattern matches.
- All 180 regular/posttest checks passed, plus six real Firestore emulator rule checks. TypeScript and lint across 222 source files passed. The first emulator attempt used Java 17 and was rejected; rerunning with the already installed OpenJDK 25 passed. The existing Windows native SWC warning remains; WASM compilation succeeded.
- Live read-only integration checks confirmed database reads, own-channel YouTube selection, GitHub metadata access, OpenRouter connectivity and a synthetic assignment-model response, and production-origin student endpoint preflight. Temporary protected QA was removed with absence confirmed. Firebase Auth project configuration returned 200 and includes the live Hosting domain. These do not prove a real owner's sign-in, save/restore or signed-in assignment submission.
- Header now hides after deliberate downward scroll and returns on upward scroll; state-transition tests cover noise, top-of-page and menu preservation. Theme is consistently class-based; navigation and primary/secondary text plus solid-button token contrast checks pass AA. No PC-control or browser automation was used in this release, at the owner's request, so fresh visual interaction checks remain manual.
- Design scope: preserve the existing academic navy/teal identity, native sans-serif stack and 6-8px control radii. Header motion is restrained and reduced-motion-aware; existing learning/editor information architecture is retained. Design dials for these public-shell changes: variance 3, motion 3, density 5.
- Empty advertisement reservations are present without visible placeholder labels or tracking. Real ad rendering is not enabled and must remain distinguishable from educational content.
- Developer-tool redirects were not added: they cannot keep delivered HTML/JavaScript secret and would interfere with a programming-learning site's debugging workflows. Private service/provider credentials stay out of the public export; Firebase public configuration and the Supabase public client key are not service-role credentials.
- GitHub main still has older source. Approval to commit/push the tested pending website changes was requested; no Git push occurred in this checkpoint. A future rebuild from old main could replace the manual Hosting release until source synchronization is completed.
- Cloudflare/registrar settings were not changed. The custom-domain lookup did not resolve in this environment; account/domain setup and DNS validation remain separate steps in CLOUDFLARE-SETUP.md.

# Previous launch audit: 16 October 2026

This section supersedes older claims below. The retained previous report is historical, not acceptance evidence for this change set.

## Scope and findings

Educational relevance: approximately 80-85% by qualitative judgment before this work, not a measured readiness score. Classes, subjects, notes, MCQs, past papers and lectures fit the purpose. Repeated promotion, empty sample PDFs and unsupported AI result statements did not.

Confirmed issues addressed:

- Empty catalog tables reverted to sample content, so deletions could appear ineffective. Build reads now distinguish empty success from failure and paginate every table.
- Notes and past papers rendered duplicate page shells. Ownership is now server-only, with a generated HTML regression check.
- Result content contained board-official impersonation and repeated unsourced statistics. Known affected bodies are withheld and noindexed, originals retained for review.
- PDF homepages were labelled downloads. Full resource pages now distinguish documents, supported previews and external source websites.
- MCQs exposed a correct-answer count too early. Results stay hidden until submission; previous answers remain editable.
- Python ran on the UI thread. A lazy worker now supports cancellation and execution timeout.
- Admin save success implied immediate publication. The UI now distinguishes saved data, rebuild requests and request failures.
- Sitemap generation depended on catalog assumptions. It now derives from indexable exported pages, with no fabricated last-modified dates.

## Verification and remaining evidence

See [LAUNCH-IMPROVEMENTS.md](./LAUNCH-IMPROVEMENTS.md) for the complete numbered change list and final acceptance evidence. Build and browser results are recorded there rather than inferred from source.

The current official Punjab result date was not verified. The owner reports 22 October; this is clearly labelled in the new board-wise guide. All nine Punjab boards are grouped, FBISE is separate.

DNS for raytechinstitute.com returned NXDOMAIN during this audit. Canonical origin is configurable, but web.app remains active until the custom domain has valid DNS and HTTPS.

Search rankings, external source uptime, load capacity and real-user Core Web Vitals are not established by these tests. No 100% readiness or top-20 ranking guarantee is made.

---

# Historical report (15 October; superseded where conflicting)

# Full Audit Report: Educational Platform & Agentic SEO Verification

**Project**: RayTech Institute Digital Educational Portal & Archive  
**Domain**: `https://raytechinstitute.web.app`
**Audit Date**: October 15, 2026
**Auditor**: Codex repository audit
**Status**: Active verification report. Claims below are evidence-backed only.

---

## 1. Executive Summary

A comprehensive, multi-phase technical SEO audit, aesthetic compliance review, and security audit was executed across the entire codebase and static production build (61 generated routes in the current build).

- **Structured-data coverage**: JSON-LD is present on the generated public pages; semantic rich-result eligibility still needs Google Rich Results Test/Search Console evidence.
- **Core Web Vitals Target**: INP $\le 200\text{ ms}$ (Google modern interactivity standard), LCP $\le 2.5\text{ s}$, CLS $\le 0.1$.
- **Security Hardening**: Credential containment, verified admin authorization, brute-force lockout, XSS-safe rendering, and strict security headers.
- **Brand Compliance**: 0 purple gradients, 0 pill buttons (`rounded-full`), 0 emojis, 0 em dashes (`—`), 0 fake metrics.

---

## 2. Audit Findings with Confidence Levels

| Area                | Check Item                          | Status           | Confidence | Evidence & Verification                                                                                                 |
| ------------------- | ----------------------------------- | ---------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Structured Data** | JSON-LD presence                    | **PASSED**       | Confirmed  | `npm run audit:seo` detected JSON-LD blocks on the generated public pages; external rich-result validation remains open |
| **Structured Data** | Deprecated / Retired Schema Removal | **PASSED**       | Confirmed  | Retired `Dataset` schema removed and replaced with modern `CollectionPage` + `LearningResource`                         |
| **Structured Data** | Restricted Schema Avoidance         | **PASSED**       | Confirmed  | Zero unauthorized `FAQPage` or `HowTo` tags across all routes                                                           |
| **On-Page SEO**     | Self-Referential Canonical URLs     | **PASSED**       | Confirmed  | Explicit `<link rel="canonical" href="..." />` rendered on every page                                                   |
| **On-Page SEO**     | Title Tag Length & Syntax           | **PASSED**       | Confirmed  | Current generated public pages use descriptive titles within the repository gate's 30-65 character range                |
| **On-Page SEO**     | Meta Description Length             | **PASSED**       | Confirmed  | Current generated public pages use descriptions within the repository gate's 100-165 character range                    |
| **On-Page SEO**     | Single `<h1>` Hierarchy             | **PASSED**       | Confirmed  | Strict nesting (`<h1>` $\rightarrow$ `<h2>` $\rightarrow$ `<h3>`) without multiple H1 tags                              |
| **AEO / GEO**       | AI Overview Summaries               | **PARTIAL**      | Likely     | Summary blocks exist on content pages; search-engine display cannot be guaranteed from source inspection                |
| **Interactivity**   | INP Metric Compliance               | **NOT MEASURED** | Open       | Requires Lighthouse or real-user data from the deployed site                                                            |
| **Brand Identity**  | Anti-Vibe Aesthetic Standards       | **PASSED**       | Confirmed  | Navy/Charcoal `#0F172A`/`#1E293B`, crisp copper/teal accents, professional `rounded-md`/`rounded-lg` buttons            |
| **Architecture**    | Python Compiler Isolation           | **PASSED**       | Confirmed  | Pyodide WebAssembly runs in-browser; strictly excluded from `/blogs/*` and `/admin/*` via `CompilerMount.tsx`           |
| **Security**        | Secret & API Key Containment        | **PASSED**       | Confirmed  | Supabase and private variables locked in `.env.local`; `.gitignore` blocks `.env*`, `*.key`, `*.pem`, `out/`            |
| **Security**        | Admin Authentication Barrier        | **PASSED**       | Confirmed  | Firebase ID token verification, verified-email check, configured admin allowlist, and client login rate limiting        |
| **Security**        | HTTP Security Headers               | **PASSED**       | Confirmed  | `X-Frame-Options: SAMEORIGIN`, `nosniff`, `HSTS`, `Referrer-Policy` defined in `firebase.json`                          |

---

## 3. Detailed Technical Analysis

## 4. Current Verification Addendum

The previous report contained several claims that were broader than the available evidence, including a 48-page count, a separate schema validator result, and a claim that every form used `sanitizeInput`. Those claims are not treated as proof. The current verification path is:

| Area                           | Current result                     | Confidence | Evidence                                                                                                                                       |
| ------------------------------ | ---------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Production build               | Passed                             | Confirmed  | `npm run build` generated 61 static pages, then ran the strict SEO and exported-link audit with no failures                                    |
| SEO regression gate            | Added                              | Confirmed  | `npm run audit:seo` checks title, description, canonical, JSON-LD presence and one H1 per generated page                                       |
| Public routes                  | Passed                             | Confirmed  | Home, classes, blogs and MCQ routes returned HTTP 200 after Firebase deployment                                                                |
| Admin mutations                | Passed                             | Confirmed  | Live Edge Function insert, read and delete test returned create=true, readCount=1, afterDeleteCount=0                                          |
| Edge Function authorization    | Hardened                           | Confirmed  | Browser actions require a verified Firebase ID token and the configured `ADMIN_EMAILS` allowlist; unauthenticated ping returned HTTP 401       |
| Python compiler                | Improved                           | Confirmed  | Resizable panel, viewport bounds, drag cleanup, accessible controls and mobile-safe dimensions implemented                                     |
| Markdown links                 | Hardened                           | Confirmed  | Rendered links pass through `sanitizeUrl`; protocol-relative URLs are rejected                                                                 |
| Inline structured data         | Hardened                           | Confirmed  | JSON-LD now uses `serializeJsonLd`, escaping script-breaking characters before insertion into inline `<script>` blocks                         |
| AI output quality              | Hardened                           | Confirmed  | Model discovery fallback, minimum word-count acceptance, unique-question MCQ validation, distinct options, and explanation-length checks added |
| Exported navigation            | Passed                             | Confirmed  | The build audit resolves every internal HTML link against an exported route or asset and fails on missing targets                              |
| Dependency audit               | Current production dependency scan | Passed     | `npm audit --omit=dev --audit-level=high` reports `0 vulnerabilities`                                                                          |
| Google rich-result eligibility | Needs ongoing review               | Likely     | Metadata and JSON-LD are present, but third-party Search Console and Core Web Vitals data are not available from this workspace                |

The remaining SEO performance measurements require real-user or Lighthouse data from the deployed domain. They must not be described as passed until measured.

The production dependency scan is currently clean. Re-run it after dependency upgrades because audit results are time-sensitive.

### 4.1 Seobility Review

Seobility was run against `https://raytechinstitute.web.app/`, which Firebase CLI identifies as this project's default hosting URL. The canonical host is now standardized to `web.app` across metadata, structured data, robots.txt, and the generated sitemap. The alternate `firebaseapp.com` alias should still be excluded or redirected in Firebase/Search Console where host-level controls are available; this cannot be enforced by a path-only static-hosting rule in `firebase.json`.

The report's duplicate-heading warning is now covered by `npm run audit:seo`, which reports duplicate heading text per page as a warning. The current generated homepage has one H1 and no duplicate heading text. Seobility's remaining recommendations about backlinks, social sharing and a full external crawl require third-party data and are not claimed as completed by this repository audit.

### 3.1 Schema.org Validation Analysis

- **Problem Discovered & Resolved**: During initial validation, `out/results-gazettes/index.html` triggered a blocking error in `validate_schema.py` because `@type: 'Dataset'` was retired for rich search features in late 2025.
- **Remediation**: The schema was updated to a valid `CollectionPage` with nested `LearningResource` entities. The current repository gate checks JSON-LD presence; semantic validation remains an external verification item.
- **Implemented Schemas**:
  - Homepage: `EducationalOrganization` + `WebSite`
  - Classes Directory: `BreadcrumbList`
  - Notes Pages: `BreadcrumbList` + `LearningResource`
  - MCQs Tests: `Quiz` with detailed `Question` and `Answer` children
  - Gazettes Portal: `CollectionPage` with `LearningResource` items
  - Blogs & Bulletins: `Blog` and `BlogPosting` with author attribution and ISO 8601 timestamps

### 3.2 Security Hardening Verification

- **API Key & Database Credential Sanitization**:
  - Supabase URL (`https://btxrkhwyugzliswznkpx.supabase.co`) and Anon Key configured exclusively in `.env.local`.
  - Firebase config values verified safe for public client initializers.
  - `.gitignore` hardened to guarantee that `.env.local`, `.env`, `*.key`, and `out/` are never exposed or tracked.
- **Authentication & Anti-Brute-Force**:
  - Cryptographic password hashing utilizing SHA-256 with dynamic per-instance salts.
  - Rate limiting tracker enforces a 60-second lockout window if an attacker fails 5 consecutive attempts.
  - XSS sanitization helper (`sanitizeInput`) escapes HTML tags and prevents script injection in all admin forms.

### 3.3 Core Web Vitals & Asset Optimization

- **LCP Target ($\le 2.5\text{ s}$)**: System font stack and Google Fonts preconnect (`fonts.googleapis.com`, `fonts.gstatic.com`).
- **CLS Target ($\le 0.1$)**: Explicit aspect-ratios (`aspect-[16/9]`, `aspect-[4/3]`) defined on all featured cards, previews, and modals.
- **INP Target ($\le 200\text{ ms}$)**: The compiler is deferred until opened and uses in-browser WebAssembly. Real-user or Lighthouse measurement is still required before claiming the target is met.
