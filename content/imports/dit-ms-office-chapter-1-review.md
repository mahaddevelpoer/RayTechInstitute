# D.I.T Computer Science MS Office chapter

Status: publication approved by the owner on 27 October 2026. The chapter and sixty questions were imported atomically and read back successfully; existing Chapter 1 records were compared with the pre-import backup and remained identical. The website release includes automated live verification.

- Source: `Ms office Chp#1_MCQs.docx`, read without modifying the document.
- Destination: `dit-intermediate` / `dit-computer-science` / **new Chapter 2: MS Office**.
- Six topics, with 10 questions each in English and Urdu: Office Automation (OA), Office Automation Software, Open Source Software, Proprietary Software, Microsoft Office 2016, Microsoft Word Interface.
- Existing Chapter 1, Basic Terminologies, and its eight networking topics / 80 MCQs remain intact. Combined preview: two chapters, fourteen topics, 140 questions.
- The document labels its own source chapter as Chapter 1. `sourceChapterNumber` and the stable question IDs preserve that source identity; website `chapterNumber` is 2 to avoid colliding with the existing networking chapter.
- Every correct answer was checked against both the document's yellow-highlighted option and its independent answer-key table. Answer explanations reproduce the selected answer; no unsupported source explanations were invented.
- Production insertion used the reviewed atomic SQL transaction in `artifacts/office-mcq-review/publish-after-approval.sql`. Re-running creates no duplicate chapter/questions, preserves creation times and refuses to overwrite changed questions or an occupied chapter number. The before-state backup and verified counts are kept under the same ignored artifacts folder.
- The gold highlight uses the earliest question creation time in a topic, lasts less than 24 hours and expires in an already open page. New questions in an existing topic do not reset the topic's age. Missing legacy timestamps are not assumed to be recent.
- `created_at` already exists in the database schema. It is exported as optional `createdAt` in the static catalog. No database migration, public database polling or paid service is needed for this highlight.
- The new bank receives creation timestamps when the approved import actually runs, not when the local preview starts or the website rebuilds.
- Preview-only timestamps are simulated in `scripts/preview-dit-topics.mjs` when `OFFICE_MCQ_PREVIEW=1`.
- Local preview: http://127.0.0.1:4182/classes/dit-intermediate/dit-computer-science/mcqs/

Verification: all sixty Office questions scored correctly across six separate 10/10 quizzes with shuffled choices; the existing eighty-question bank passed separately. Exact 24-hour expiry was tested without reloading. Import repeatability, chapter-number collisions, rollback, RTL text, Previous/Next behavior and hidden answers until results are covered by tests. Responsive browser checks use 360, 768 and 1,366px in both themes.

This changes the existing MCQ listing, not its URL. The next approved static release must regenerate the catalog and keep canonical URLs, structured data and sitemap on `https://raytechinstitute.com`. Search Console discovery does not guarantee indexing or ranking.
