# Reported website repairs

Status key: unchecked, confirmed, fixed locally, verified live, needs owner details.
No percentage or blanket readiness claim replaces evidence.

## Priority 1: publishing and resources

- [x] Gazette validation, real transactional create/read/edit/delete and permissions; existing detail routes, listing and sitemap exported. A real owner PDF submission remains an acceptance check.
- [x] Notes/papers document-link and preview logic, safe source/download links and optional AI descriptions. Live note CRUD passed with rollback; no genuine notes or papers are currently saved.
- [x] Admin Python catalog: protected live catalog and public export both contain 20 topics; focused admin UI selection/publish test passed.
- [x] Attached lesson video: correct selected topic ID in save test, persisted videos shown at the top of their actual public lessons. Python currently has no persisted video to display.
- [x] Blog attachment/action no longer hidden by prose review; safe URL and opt-in document preview implemented.
- [x] Complete export/revision gates, serialized publishing, pending-run reuse and content-only validation. Current cloud release succeeded; original historical missing-pages report was not reproduced in this release.

## Priority 2: predictable behaviour and security

- [x] Public error boundary, safe mutation/provider messages, private-key export gate and anonymous database denial checks.
- [x] Activity state resets on topic/version changes; focused activity, selection/reset and original teaching controls tests passed.
- [x] Scoped Firebase rules/denials, Supabase, YouTube, Gemini and Nemotron checks passed. Dots stalled; approved Gemini streaming fallback passed live and unit probes.
- [x] Explicit draft/publish copy, language/topic counts and search, video save button, dashboard task links and publish retry.

## Priority 3: complete visual coverage

- [x] Programming courses and language directories redesigned and tested live.
- [x] Classes, subject selection and subject resource destinations redesigned and tested live.
- [x] Resource navigation, PDF preview/actions, MCQ labels/targets and results ordering repaired; resource routes tested live. Externally hosted PDF availability remains outside the site guarantee.
- [ ] Privacy/terms reading layout and About are live, original legal content retained. Exact developer name/company/contact/address still needs owner details; none invented.
- [x] Neutral charcoal theme tokens and legacy compatibility; desktop/mobile screenshots reviewed, lesson/editor contrast and responsive tests passed. Embedded third-party documents retain their own rendering.

## Verification gates

- [x] Focused regression suites, full cloud source suite, TypeScript and lint passed.
- [x] Cloud build, export/link/credential gates and Firebase release passed: 99cefd6bf8307b4adb981ad87509771316274aaf.
- [x] All 135 live HTML routes match the exact export; sitemap contains 94 indexable URLs including About and gazettes; persisted video placement matched its catalog.
- [x] Fourteen key routes passed desktop/light and mobile/charcoal checks with no public database reads, horizontal overflow or runtime errors. Downloaded screenshots visually reviewed.
- [x] Evidence limitations are recorded below; no blanket 100% readiness claim.

## Constraints

Preserve unrelated user changes. Do not run heavy local Next builds on the user's PC.
Use code/browser automation tests on the cloud runner, not PC-control automation.
Never publish test content as genuine educational material, fabricate statistics, or expose credentials.

## Evidence recorded before release, 22 October 2026

- Live catalog: 24 published topics, including all 20 Python topics. The protected admin catalog agrees with the database.
- Real database transaction: note and gazette insert/read/update/delete passed, with ROLLBACK and no permanent QA content.
- Focused admin UI test: select Python, display 20 topics, attach video to the selected Python topic, publish the correct identity and preserve the topic list after reload.
- Resource and provider regression suite: 12 tests passed. TypeScript and lint passed (292 source files).
- Live scoped checks: 12 Supabase tables, YouTube channel uploads, GitHub access, Gemini generation/streaming and free Nemotron review responded successfully.
- Dots did not respond during the bounded live probe. Owner-approved Gemini Flash Lite streaming fallback is implemented and tested; Stop cannot trigger fallback.
- Existing gazette links point to board HTML homepages, not actual PDFs. A valid public PDF or supported Drive document is required for a PDF preview.
- The latest persisted new lesson video belongs to PHP, not Python. Do not silently move an owner's video to another language.
- Backend and frontend repairs are deployed. The private-read migration is applied; all nine anonymous table probes were denied while the protected catalog remained available.
- A real signed-in owner write, cross-device progress and externally hosted PDF availability are not proven by service-role QA.
- Exact developer name, company and address remain owner-supplied details. About links only the verified public project/developer handle meanwhile.
- Firestore rules emulator passed; actual unauthorized progress requests returned 403. Compiler browser tests denied parent DOM, persistent storage and network access.
- Transactional note/gazette CRUD passed again after the private-read migration, still with rollback.
- Temporary protected learning-qa endpoint was deleted after verification; a follow-up request returned 404.
- Successful release evidence: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/39750256830
- After the private-read migration, a fresh content-only rebuild also passed: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/39750901544 (all nine build catalogs fetched, 135 live HTML matches, 14 responsive resource routes, no public database reads).
