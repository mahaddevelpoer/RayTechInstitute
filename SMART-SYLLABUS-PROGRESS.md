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

Source and local checks are ready. GitHub login has been renewed. Database insert, hosted CI build and live article/PDF/sitemap verification remain pending until recorded below. Do not describe this release as live before those steps pass.
