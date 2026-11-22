# DIT first semester and ICT Chapter 1

## Prepared scope

- Correct the existing DIT class description to the PBTE post-matric two-year programme, first semester.
- Keep the existing class slug, Computer Science hub, chapter identities, notes and quiz records.
- Show the official five-subject, 35-module semester overview. Identify unpublished modules explicitly; do not create empty Operating Systems or Python resource pages.
- Add the ICT subject, Chapter 1 Introduction to Computers, full web guide and bundled PDF.
- Six syllabus sections, 60 original revision MCQs (10 per section), 12 solved short questions, 6 solved long questions and 5 practical activities.
- Separate practice section: 20 revision MCQs without answer highlights, 10 short questions and 3 long questions, followed by an answer key and written-answer references.

## Source and editorial checks

Official PBTE PDF: ICT Module 1 on page 7. The PDF is the course outline, not a supplied complete textbook. No question is attributed to an unverified past paper or advertised as guaranteed to appear in an examination.

Hardware terminology was cross-checked against IBM's hardware explanation. Technology chronology was cross-checked against the Computer History Museum semiconductor timeline. The notes avoid rigid generation dates and clarify overlapping classifications.

Each MCQ has four distinct options, one correct answer and an explanation. Correct positions are balanced: A 15, B 15, C 15, D 15. Wrong options were reviewed to address relevant misconceptions. The practice test reuses selected revision questions and says so explicitly.

## Rebuild locally

Run `python scripts/prepare-dit-ict-chapter.py` with the bundled Python runtime and its reportlab and python-docx dependencies. The checked generated JSON feeds the website. The source-merged catalog survives subsequent fresh database exports.

Use `node --test scripts/dit-ict.test.mjs scripts/dit-mcqs.test.mjs` for the new content and existing quiz checks. The legacy SQL import test requires LF line endings inside its multiline SQL literals; Git CRLF conversion changes those strings and can cause its guard to fail.

Final local verification: TypeScript strict check passed. The combined ICT, existing DIT MCQ and legacy import suite passed 14 of 14 tests. All 30 pages of the PDF were rendered and visually inspected. The new semester overview was server-rendered and its five subjects, resource counts and available-only links checked. A full Next.js production build remains unverified for the environment reasons below; the tests do not substitute for it.

The local `src/data/staticOverrides.ts` was refreshed read-only from production for preservation tests. It is a generated snapshot, not part of this authored source batch; the existing production build regenerates it from the database.

## Publication and unfinished work

This batch is local until current changes receive the publication approval required by AGENTS.md. No database records, deployment branches or publishing workflows have been changed.

The editable Word draft is under `artifacts/dit-ict/word-draft/`, outside the public folder. Its native layout has not been verified because LibreOffice is unavailable on this Windows runtime. It is not included as a student download. The independently generated PDF has its own visual verification.

Local production build limitation: the existing shared dependencies resolve Next.js across drives and its native SWC binary cannot load. An isolated locked dependency install was attempted but stopped with ENOSPC on C:. The task-created incomplete node_modules directory was removed and the original shared junction restored; no existing source-project dependency directory was modified. A complete build remains required before deployment.

Operating Systems, Python, ICT Chapters 2-7 and the networking practical module still require their own complete content batches. Existing MS Office and Networking chapter headings are not a certification that every theory/practical topic is covered.
