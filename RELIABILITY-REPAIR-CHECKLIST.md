# Reported website repairs

Status key: unchecked, confirmed, fixed locally, verified live, needs owner details.
No percentage or blanket readiness claim replaces evidence.

## Priority 1: publishing and resources

- [ ] Gazette create, edit and delete: validation, database permissions, PDF detail page, listing and sitemap.
- [ ] Notes and past papers: PDF link, preview, download and optional AI description.
- [ ] Admin Python catalog: reconcile all database topics with exported/public topics.
- [ ] Attached lesson video: persist selected video, publish revision and show near the lesson top.
- [ ] Blog attachment/action link: editor fields, persistence and visible article action.
- [ ] Deployment: reproduce reported failure, preserve complete exports, serialize publishing and reduce avoidable waits.

## Priority 2: predictable behaviour and security

- [ ] Public errors: safe messages, no SQL/provider diagnostics, no private credentials.
- [ ] Interactive activities: selection, reset, next/back and state changes tested.
- [ ] Third-party checks: scoped Firebase, Supabase, YouTube and AI checks; distinguish quota/configuration/provider failures.
- [ ] Admin usability: explicit draft versus publish, clear topic counts, video save path and missing-data states.

## Priority 3: complete visual coverage

- [ ] Programming courses and language directories.
- [ ] Classes, subject selection and subject resource destinations.
- [ ] Notes, papers, MCQs, results/gazettes and blog resource pages.
- [ ] Privacy, terms, about and developer contact details; preserve legal text and use only verified identity details.
- [ ] Neutral charcoal dark theme, including forms, editors, PDFs and empty/error states.

## Verification gates

- [ ] Focused regression tests and type/lint checks.
- [ ] Cloud build and complete static-export checks.
- [ ] Published URLs, PDF/video links, sitemap and revision match.
- [ ] Mobile/desktop and light/dark screenshots reviewed.
- [ ] Final report distinguishes verified fixes from external-service limits and owner information still needed.

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
- Backend repairs are deployed. Frontend release, cloud browser checks and private-read migration are pending their release gates.
- A real signed-in owner write, cross-device progress and externally hosted PDF availability are not proven by service-role QA.
- Exact developer name, company and address remain owner-supplied details. About links only the verified public project/developer handle meanwhile.
