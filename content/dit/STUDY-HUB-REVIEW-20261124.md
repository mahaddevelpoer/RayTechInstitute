# DIT resource access and printable question banks

Prepared locally on 24 November 2026. This batch is not deployed.

## Student-facing changes

The existing DIT class page now separates ICT, MS Office and Computer Networks by their actual syllabus/book positions. All five first-semester subjects have jump links. Available modules expose direct note-detail links, chapter-filtered practice and a document link. Existing chapter IDs, note IDs, stored chapter numbers and public URLs are preserved. The two legacy Drive documents are identified as external documents; no claim is made that their owners permit downloads.

Three printable subject banks contain the existing published questions, four options and their saved answers/explanations. They add no new examination questions. Answer keys follow the practice section for each chapter. Urdu is shaped by the browser, with independent paragraph direction. Every page has site branding; source wording is retained.

| Subject | Modules with material | MCQs | New bank pages |
| --- | ---: | ---: | ---: |
| Introduction to ICT | 7 / 7 | 488 | 122 |
| Introduction to MS Office | 5 / 5 | 490 | 197 |
| Computer Networks | 7 / 8 | 710 | 291 |
| Operating Systems | 0 / 6 | 0 | None |
| Introduction to Programming | 0 / 9 | 0 | None |

19 of 35 modules have some material. That is an availability count, not a certification of full theory/practical coverage. The 1,688 existing questions are reused, not claimed as newly authored in this batch.

## Source and completeness boundary

The official PBTE first-semester course-outline PDF supplied by Mahad was fetched read-only from PBTE on 24 November and parsed successfully: 31 pages. Its five technical subjects and module counts match content/dit/semester-one.json. The outline is not a full textbook. ICT study packs retain their previously reviewed sources. Legacy Office/Networking MCQs retain the catalog's wording and keys; this batch does not establish a textbook source for every legacy question or independently revalidate all legacy answers.

Missing content remains explicit. No empty Python or Operating Systems route is created, and revision questions are not labelled as authenticated past papers. The syllabus lists Kotlin within the Python libraries section; future teaching notes must clarify that Kotlin is a separate language rather than repeat that classification as a fact.

## Verification

- TypeScript strict check passed.
- 22 focused catalog, preservation, book-placement, Urdu, study-directory and new bank/HTML tests passed after the final navigation copy and bank regeneration.
- Each new PDF passed exact byte-size/hash validation. Every English question/option/explanation was found in extracted PDF text. Arabic letter counts were checked after Unicode normalization; this is a glyph-presence check, not an assertion that text extraction preserves RTL reading order.
- Representative final question and answer-key page PNGs were visually inspected. Browser printing fixed the reversed/unjoined Urdu seen in the rejected ReportLab draft. The earlier draft is not shipped.
- Four component-preview journeys at 360px and 1366px in light/dark mode passed: no horizontal overflow or page errors, usable task-link heights, unpublished Python modules without false resource links, and an actual downloaded ICT-bank SHA-256 match. Screenshots were visually reviewed. These are component previews, not a full Next.js production export or field-performance measurement.
- Evidence is local under artifacts/dit-study-20261124/. Public bank hashes, byte counts and page counts are in study-banks.generated.json.

## Rebuild

Run, in order:

1. node scripts/export-dit-study-banks.mjs
2. node scripts/print-dit-study-banks.mjs
3. python scripts/verify-dit-study-bank-pdfs.py
4. node --test --test-concurrency=1 scripts/dit-study.test.mjs scripts/dit-ict.test.mjs scripts/dit-mcqs.test.mjs scripts/study-directory.test.mjs
5. node scripts/review-dit-study.mjs

Printing currently uses the installed Microsoft Edge browser. Python verification uses pypdf, with optional pdftotext when installed. Re-render and visually inspect regenerated PDFs before release. A changed catalog fails the bank fingerprint check and requires regeneration/review. The generated live database snapshot in src/data/staticOverrides.ts is deliberately excluded from the authored changes.

## Remaining work before claiming DIT completion

- Author and verify all six Operating Systems modules, including the three practical modules. Windows installation/partitioning exercises require a disposable lab; supported-product advice must distinguish syllabus versions from current support status.
- Author and run the nine Python modules, including Turtle, Excel/pandas and the other named libraries. Review the official outline's classification mistakes rather than copying them into explanations.
- Complete the networking practical module and check practical coverage within existing theory chapters.
- Obtain and authenticate board/year/session-specific past papers before publishing them as past papers.
- Review all legacy Office/Networking theory coverage and source attribution; a bank of MCQs alone is not a complete textbook.
- Full static production build/export verification remains required before an approved live release. No new release, ad spend, AdSense integration, paid downloads or cash-prize competition has been activated.
