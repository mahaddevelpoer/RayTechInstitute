# Smart syllabus release checklist

Checked 11 November 2026. Scope: verified Punjab subject resources for session 2026-27 and annual examination 2027.

## Completed locally

- Official PECTAA downloads listing corroborates the Grade 9 and Grade 11 source booklets, both dated 6 November 2026.
- Seven Grade 9 and eight Grade 11 subject PDFs extracted. All 127 page streams and media boxes match the originals; all 15 output hashes match the manifest. First and last pages visually inspected.
- Fifteen individual English subject articles, each with subject-specific source details, revision guidance, FAQs, official sources, a PDF attachment and two document images. They are approximately 1,400-1,500 words each, not 2,000-word chapters.
- Static syllabus directory and 15 subject resources. Subject buttons follow the shared published article record. A link is available from Classes even when a class has no matching subject yet.
- Admin Smart Syllabus editor uses existing authenticated article mutations. Add/edit/delete, PDF/source/image URLs, examination year, grade, subject and Markdown writing are supported. These are URL inputs, not a local-file upload service.
- Deletion removes generated article/resource links on the next successful static export; document seeds cannot resurrect deleted records.
- Unique metadata, canonical URLs, LearningResource/BreadcrumbList/ItemList schema. Existing export finalizer includes indexable pages in the sitemap.
- Existing public pages remain static. No new public database read or private browser credential.
- CI now includes smart-syllabus regression tests.

## Verification

- Lint and strict TypeScript checks passed.
- Source, publication-fetch, admin authorization/error-handling and credential-pattern tests passed.
- Browser automation at 360, 602 and 1280 pixels: directory cards, subject navigation, PDF preview toggle and actual PDF download passed; no horizontal overflow or page exceptions.
- All 15 resource metadata/canonical/schema checks passed in the isolated real-component harness.
- Admin edit/delete controls passed with an isolated store fixture. This is not a claim of a production-account end-to-end test.
- Browser harness made no external API calls. No heavy local Next.js production build was run.

## Official-source gaps

- Current Grade 10 ALP and Grade 9 Computer Science document were not verified in the checked official listing; no old-year substitutes were fabricated.
- Grade 11 Islamiat heading says 2026-27 but its first-page footer says 2025-26. Both resource and article flag the conflict and request school/board clarification.

## Hosting release

Published and live-verified. Source revision: 017af851fd1b0edca54f20e92f6a94727973c416.

- Full Cloudflare workflow 42996806710 succeeded, including source/security tests, static export, SEO gate and browser checks.
- Fifteen new article records inserted and read back exactly. No database rows deleted.
- Fifteen live articles, fifteen subject resources and fifteen PDFs returned correctly. PDF hashes and sitemap entries match the reviewed source/export.
- Live 360px and 1280px browser checks passed for navigation, PDF preview and successful PDF download, with no horizontal overflow or page errors. Public database reads observed: zero.
- Class and subject syllabus links verified live. Admin route has noindex.
- A pre-existing notes test fixture was repaired; a long-token metadata edge case was fixed. The initial full run 42995643192 then identified two existing identical overview articles and broken links. Both database rows remain; only the original is listed publicly and the duplicate URL now returns a verified 301. Broken links in the original were repaired. The failed run is retained in the evidence history.
- An initially dispatched content-only run 42995377122 was intentionally cancelled in favour of full source validation.

Public directory: https://raytechinstitute.com/smart-syllabus/
Admin editor: https://raytechinstitute.com/admin/smart-syllabus/
Evidence: content/release-evidence/smart-syllabus-2027.json

The source-verification gaps above remain explicit. This release does not claim a nonexistent Grade 10 or Grade 9 Computer Science document, resolution of the Islamiat footer conflict, guaranteed Google indexing/ranking, or a production-account end-to-end admin login test.
