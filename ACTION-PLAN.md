# 26 October 2026: supplied mobile PageSpeed report follow-up

See [PAGESPEED-LOCAL-REPORT.md](PAGESPEED-LOCAL-REPORT.md) for the observed 65/66 mobile baseline, confirmed causes, local fixes, 68 passing targeted tests and responsive component checks. No deployment or push was performed. Strict CSP/Trusted Types and framework-polyfill advisories remain open; a fresh production export and PageSpeed run are still required before claiming all warnings are cleared.

# SEO action checklist: 26 October 2026

Status: local review only. The explicit-approval rule in AGENTS.md governs every future publication. Earlier approvals do not authorize this batch. Older sections below are historical.

## Completed locally

- [x] Persist the rule against unapproved pushes, workflow dispatches, hosting/function/rule deployments and production-content writes that publish changes.
- [x] Audit the last successful 144-document export, including 103 indexable pages, using a repeatable read-only script.
- [x] Fix duplicated lesson/quiz titles and repeated quiz/course descriptions; exercise the actual generators for 50 routes.
- [x] Add the correctly sized share image and explicit social image metadata where missing.
- [x] Keep protected pages noindex and add proper server-rendered admin robots metadata without changing authorization behavior.
- [x] Preserve existing slugs and require an HTTPS canonical origin.
- [x] Add crawlable programming-course/test links and improve footer heading levels.
- [x] Add truthful contextual learning/quiz schema and correct resource descriptions/publisher identity.
- [x] Compress shared images, retain original asset URLs and reserve appropriate image dimensions.
- [x] Strengthen export checks for duplicate metadata, missing OG images, invalid JSON-LD, canonical count, image attributes and admin indexing.
- [x] Prepare the domain/Search Console checklist and an educational backlink strategy without external account changes or outreach.
- [x] Preserve and document baseline sitemap, robots, headings, alt attributes and zero broken internal page targets.
- [x] Run 78 focused tests, TypeScript and lint successfully. Keep the full new static export and browser checks visibly pending rather than claiming a production verification.

## Before a later approved publication

- [ ] Owner reviews the local change set and explicitly authorizes publication of this batch.
- [ ] Run the complete new static export and all export/security gates using the approved build environment. A fresh full local Next build has not been run on the owner's constrained machine.
- [ ] Check final canonical/OG/Twitter URLs, sitemap membership and intentional noindex behavior in the new HTML, including the admin metadata split.
- [ ] Verify mobile navigation/footer, primary images and the existing learning/quiz/document controls against that exact new build.
- [ ] Publish only after explicit approval, then verify the exact release revision and pages. Do not deploy simply because source tests pass.

## External setup and measurement

- [ ] Buy raytechinstitute.com, connect Firebase Hosting and wait for valid HTTPS before changing the canonical origin.
- [ ] Configure domain ownership and Search Console using the actual owner account and Google's actual verification values.
- [ ] Submit the real canonical sitemap after the custom domain is ready.
- [ ] Obtain a usable mobile lab report and later field LCP/INP/CLS. The public PSI API returned HTTP 429; no performance score is claimed.
- [ ] Recheck important third-party document/source links when preparing their next release; the current batch proves internal targets, not every external host's availability.
- [ ] Execute backlink outreach only if separately authorized. Record genuine placements, not projected links or guaranteed rankings.

See FULL-AUDIT-REPORT.md, SEO-DOMAIN-CHECKLIST.md and SEO-BACKLINK-STRATEGY.md for evidence, owner-dependent steps and scope limits.

---

# Release follow-up: 20 October 2026

1. Obtain source-sync approval and commit/push the reviewed website code/workflow so future automatic publishing cannot replace the manual live release with older source.
2. Owner checks the live header, both themes, menu boundaries and learning activities. Automated code/state/contrast checks passed, but this release intentionally did not use PC/browser automation.
3. Verify real user/admin sign-in, progress save/reload and a signed-in assignment submission. Live read-only/provider checks and owner-only Firestore emulator tests are not substitutes for those flows.
4. Connect the custom domain through Firebase and Cloudflare using the actual assigned DNS records and Full (strict). Preserve email/DNSSEC configuration, add exact authentication/CORS origins and test proxy/bot rules before relying on them.
5. Author and verify the 76 remaining language units. The live Python track contains twenty concise core lessons; other language tracks have their reviewed foundations.
6. Connect an ad provider only with clear separation/disclosure, consent handling where required and no overlap with learning/test/compiler controls. Empty reservations currently load no ads or tracking.
7. Keep the existing development-only dependency findings and Windows native SWC fallback warning tracked. Do not run a force upgrade without build and visual regression testing.

# Previous launch action plan: 16 October 2026

This section supersedes the historical roadmap below. No new public-database polling, SSR hosting migration or paid infrastructure is required by this change set.

## Before the result-day announcement

- [ ] Obtain an applicable official board notice confirming the date, time and examination session. The owner's 22 October date remains unverified in public copy.
- [ ] Review held AI articles/gazettes using named official sources. Remove fabricated statistics/impersonation before allowing indexing.
- [ ] Populate genuine notes and past papers; do not restore fake empty-PDF examples to make the catalog look fuller.
- [ ] Complete custom-domain DNS and Firebase HTTPS, then switch the canonical origin using the runbook below.
- [ ] Submit the canonical sitemap to Google Search Console. Inspect representative article/result/subject URLs; indexing and ranking are not guaranteed.
- [ ] Capture PageSpeed/Lighthouse lab results and later real-user performance. Do not mark field INP or result-day capacity passed from a build.
- [ ] Perform authenticated admin create/edit/delete/rebuild verification with an explicitly disposable record. Existing real articles were not deleted for testing.

## Custom-domain cutover

1. Add raytechinstitute.com in the existing Firebase Hosting project; complete ownership verification and use the exact DNS records Firebase provides.
2. Wait for valid HTTPS on the domain. Verify the homepage and a deep static route before changing metadata.
3. Add the production domain to Firebase Authentication's authorized domains and the Edge Function's configured allowed-origin list, retaining required existing origins.
4. Set repository Actions variable NEXT_PUBLIC_SITE_URL to https://raytechinstitute.com and rebuild. Local .env.local can use the same value when producing that deployment.
5. Verify all exported canonicals, structured data and sitemap use the new origin. Set the preferred www/non-www redirect in hosting.
6. Verify Search Console domain ownership and submit https://raytechinstitute.com/sitemap.xml. Retain canonical consistency on the Firebase aliases.
7. Check admin AI, save/rebuild, image loading and Python under the deployed domain's CSP. Do not change DNS or credentials by guessing values.

## Evidence

The current change checklist, tests and live verification are in [LAUNCH-IMPROVEMENTS.md](./LAUNCH-IMPROVEMENTS.md). Older checked items below describe the previous release only.

---

# Historical roadmap (superseded where conflicting)

# Action Plan: Prioritized Optimization & Roadmap

**Platform**: RayTech Institute Educational Portal  
**Document**: Continuous Maintenance and Scalability Action Plan  
**Date**: October 15, 2026

---

## 1. Action Items by Priority and Impact

### Current Verification Gates

- [x] **Static SEO regression gate**: `npm run audit:seo` checks every generated public HTML page for title, description, canonical, JSON-LD and exactly one H1.
- [x] **Admin action authorization**: Browser-triggered AI, mutation, rebuild and broadcast actions require a verified Firebase ID token in the Edge Function.
- [x] **Compiler interaction quality**: Python compiler is resizable, viewport constrained, draggable and keyboard-friendly while remaining excluded from blogs and admin.
- [x] **AI response acceptance**: MCQs are schema-validated and article, gazette and notes content must meet minimum word thresholds before the admin UI receives it.
- [x] **Generated-link integrity**: Static builds fail when an exported page contains a missing internal route or asset target.
- [x] **Inline JSON-LD XSS hardening**: Structured-data strings are escaped before being inserted into inline script elements.

### Verification Still Requiring External Evidence

- [ ] Run Lighthouse or PageSpeed against the live Firebase domain and record LCP, CLS and INP. Source inspection cannot prove Core Web Vitals.
- [ ] Submit the current sitemap in Google Search Console and review coverage, canonical selection and rich-result warnings.
- [x] Configure `ADMIN_EMAILS` in Supabase Secrets with the verified project administrator email. The Edge Function now enforces the allowlist in addition to Firebase token verification.
- [ ] Configure the alternate `firebaseapp.com` Firebase host redirect/exclusion in Firebase Hosting/Console and submit only `https://raytechinstitute.web.app/sitemap.xml` to Search Console. Code-level canonicals now use the Firebase CLI default `web.app` host.
- [ ] Re-run Seobility's full website audit after the host redirect is active; review its duplicate-heading, internal-anchor, backlink and social-sharing findings separately from the static HTML gate.

### Immediate / Completed (Priority P0 - High Impact, Zero Effort Remaining)

- [x] **Full Static Export Build**: All 61 pages generated with Next.js SSG (`npm run build` exits 0).
- [ ] **Rich-result schema validation**: Run Google's Rich Results Test and Search Console enhancements report against the deployed canonical host; the repository gate currently checks JSON-LD presence, not search-engine eligibility.
- [x] **Canonical Tags & Title Format**: Self-referential absolute URLs and 50–60 character titles implemented across all indexable pages.
- [x] **Credential Isolation**: Supabase project credentials and private variables moved to `.env.local` and `.gitignore` verified.
- [x] **Compiler Exclusion**: In-browser Python compiler unmounted on `/blogs/*` and `/admin/*`.
- [x] **Brand Compliance**: Removed purple gradients, pill buttons, em dashes, emojis, and fake reviews.

---

### Ongoing Content Management (Priority P1 - High Impact, Low Effort)

1. **Dynamic Gazette Additions via Admin Panel**:
   - Access `/admin/gazettes` to publish new annual and supplementary result gazettes as Punjab examination boards release them.
   - Maintain accurate direct result check URLs and PDF download mirrors.
2. **MCQs Question Bank Expansion**:
   - Add additional topic-specific questions in `/admin/mcqs` for Physics, Mathematics, and Computer Science to expand practice breadth.
3. **Blog & Date Sheet Updates**:
   - Publish upcoming date sheets for 11th and 12th annual exams in `/admin/blogs` under the `date-sheets` category.

---

### Infrastructure & Deployment (Priority P2 - Medium Impact, Low Effort)

1. **Firebase / Vercel Static Hosting Deployment**:
   - Deploy the generated `out/` directory using `firebase deploy --only hosting` or git repository linkage.
   - Zero-server guarantee remains preserved with zero monthly compute costs.
2. **Supabase Realtime Sync (Optional Expansion)**:
   - Client store is currently pre-seeded and cached in browser storage with instant fallback. If multi-device synchronization is desired, Supabase table listener hooks can be enabled with the stored credentials.
3. **Search Console & Sitemaps**:
   - Submit `https://raytechinstitute.web.app/sitemap.xml` directly to Google Search Console, then review coverage and canonical selection for the 61 prerendered pages.
