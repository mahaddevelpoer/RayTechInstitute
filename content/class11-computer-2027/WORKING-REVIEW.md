# Class 11 Computer Science ALP 2027: working review

Historical authoring checkpoint. The tasks listed below were subsequently implemented; see REVIEW.md for the current status and verification evidence.

User task, 27 November 2026: compare existing Class 11 Computer Science content against the supplied new textbook, remove ALP-excluded topics/exercise questions from exam preparation, create retained-only notes and MCQs, and add clearly typed old-paper study pages with answers supported by this book. Class 12 is a later separate batch; this task uses the supplied Class 11 book. No current-batch publication approval has been requested or obtained.

## Sources and local evidence

- User textbook: `C:/Users/HP/Downloads/Video/Upgrades/11th Class Computer Science Punjab Board New Syllabus Full Book PDF.pdf`, 144 PDF pages; cover/contents/authors occupy three pages, printed textbook page n is PDF n+3. It is an image-based scan. It contains nine chapters, printed pages 1-140, and an answer page at 141.
- User ALP: `C:/Users/HP/Downloads/Video/Upgrades/ALP-Notification-Grade-11_Redacted_Redacted.pdf`, 71 pages, notification PECTAA/C&C Unit/2026/1239 dated 6 November 2026 for session 2026-27/exam 2027. CS exclusions pages 43-44, paper structure 45-46, official model paper 47-51.
- QA: `D:/raytech-11cs-20261127/`. All 144 textbook pages are rendered (`book-NNN.png`) and OCRed (`book-NNN.ocr.txt`) with the bundled tesseract.js 7.0.0, three workers, cached English model. `alp-pages.json` contains actual selectable ALP text. `existing.json` is the original website Class 11 CS catalog snapshot. Book original extraction was unreadable; use OCR plus visual pages. Original input PDFs must not be rewritten.
- `exclusions.json` records all deleted sections and numbered questions plus the paper structure. It was visually checked against ALP pages 43-44. **Page ranges are locators, not blanket deletions:** retained material starts/ends on shared pages 9,13,35,45,74,79,82,92,97,106,108,133,135. Match section boundaries.

## Existing content audit

Website has chapters 1-3, 260 MCQs and four notes. Forty MCQs are explicitly marked Supplementary/excluded but still enter public quizzes: ten in Chapter 1 section 1.5 and thirty in Chapter 2 sections 2.8-2.10. Remaining 220 questions were read with their correct answers and are grounded in retained topics (70,70,80). Chapter 3's solvability/tractability remains retained; only formal section 3.3.3 is removed. Do not over-delete all of section 3.3 or all uses of range() because a specific exercise question was deleted. Keep Chapter 1 testing even though Chapter 2 testing is excluded.

Existing note IDs: `class11-nov12-chapter-1-study-guide`, `class11-nov12-chapter-2-study-guide`, `class11-nov12-chapter-3-study-guide`, `note-1792667992687` (old generic SDLC note whose external download points to a whole old PDF). Preserve IDs and live counters. Plan: replace first three with retained full guides, repurpose the generic SDLC note as a retained worked-project guide with a first-party PDF. Add chapters 4-9 and their guides, plus a separate clearly labelled model-paper solutions note. Avoid duplicate SEO titles for notes in the same chapter.

Authored files `chapter-1.mjs` through `chapter-9.mjs` now contain original retained topic notes and solved retained exercise questions. Chapters 4-9 each contain 30 original practice questions with precise section/page references. Combined with 220 retained legacy questions this should give 400 public practice MCQs. Exercise MCQs are solved separately inside chapter guides; they need not become duplicate public quiz records. Authors use `authoring.mjs` helpers. No catalog integration, PDFs, program verification or production build has yet been done. Need complete those steps before approval.

## Textbook issues handled in authored notes

- Chapter 1 exercise sprint question mixes broad Agile and specific Scrum; clarify the specific framework in original practice.
- Chapter 2 printed running-output comments have errors; authored programs use checked expected results. Long question 1 retains only b,d. Python page 40 has awkward numbering 2/3 and ambiguous stacked mathematical lines; explain the ambiguity, do not invent a corrected denominator. Its first clear separate expression is 5*(3+2**2)=35; the next is 6-2*3=0, so an intended quotient would be undefined. Ch2 exercise MCQ8 prints an abbreviated option Warm but actual output is Warm and breezy.
- Chapter 3 exercise MCQ5 asks for a search algorithm but supplies only sorting algorithms; record as issue, not an arbitrary answer. BFS/DFS memory depends on graph shape and implementation. The authored list-backed BFS demonstration does not claim pop(0) is a constant-time queue.
- Chapter 5 population variances 12.56 and 454 are correct for the printed datasets. Their standard deviations are approximately 3.5440 and 21.3073, unlike the printed approximations. Programs must independently check them.
- Chapter 6 printed short-question numbers have gaps: retained 3,4,6,8,9. ALP removes long question 4 even though serverless theory and short questions remain. Keep that distinction. Community cloud is supported by retained exercise 2 despite not appearing in the four-model theory list.
- Chapter 7 MCQ1 has several valid clauses (A,B,D) and MCQ9 several responsible behaviours; both are recorded as ambiguous. Avoid pretending the printed single-choice form has one valid option. Do not propagate outdated legal-bill/agency claims, guarantee antivirus detection or imply a padlock proves organisational authenticity.
- Chapter 9 section 9.1 is misprinted 8.1 in the main heading. Its business-plan overview remains retained, but do not teach detailed finance from 9.5.

## Old papers

Downloaded and OCRed archive scans from Ustad360, four pages each, two groups per PDF:

- `https://www.ustad360.com/wp-content/uploads/AppData/Local%20Past%20Papers/11th%20Class/Computer/2024/Computer-11%20(LHR-24).pdf`
- `https://www.ustad360.com/wp-content/uploads/AppData/Local%20Past%20Papers/11th%20Class/Computer/2024/Computer-11%20(GUJ-24).pdf`

Local names `paper-LHR-2024.pdf`, `paper-GUJ-2024.pdf`; rendered/OCR prefixes `paper-lhr-N`, `paper-guj-N`. These are **old-course** hardware, networks, Windows and MS Office papers. Do not call them current 2027-syllabus papers, guess papers or authenticated by the board merely because an archive labels them. Scans show old academic sessions and archive/handwritten board attribution. Some questions overlap retained new-book security, research, SDLC or charts; many have no answer in the provided new book. Mark unsupported ones as legacy/outside this supplied book, not invented answers.

For external copyright material, do not republish complete verbatim paper transcriptions/scans under a new watermark. Link the original archive PDF, provide a short clearly-labelled topic/question-summary index and original book-supported answers with page references. A full solved current official model paper can be transcribed from the **user-provided** ALP pages 47-51, with clear credit and "original worked solutions, not official marking scheme". Explain the old/new course mismatch honestly; user wants answers from this book.

## Remaining work

1. Check syntax and counts for all nine author files, verify every retained textbook exercise number and source page, execute all structured programs (currently Ch2/3/4/5), fix real errors.
2. Author all 15 objective, 27 short and five long current model-paper answers from the provided ALP. Many can reuse chapter short/long answers; model long Q5=Ch2 long6+odd program, Q6=Ch3 long5, Q7=Ch4 long5, Q8=Ch5 long4, Q9=Ch7 long1.
3. Prepare legacy old-paper study pages with faithful source attribution, brief typed summaries and supported answers; do not pass unsupported old-course questions into current quizzes.
4. Build a source/legacy audit manifest, generated catalog, first-party chapter PDFs, complete study book, MCQ bank, model solutions and project PDFs. Preserve original saved-note counters and keep non-Class-11 records untouched. Replace old chapter PDF bytes or redirect old download paths so excluded content is not still promoted as current exam preparation.
5. Add a compact Class 11 Computer study overview on the existing subject page with all nine chapters and links. Keep global shell small. Add note-specific unique SEO titles (generic chapter-only titles collide for multiple notes in Chapter 1).
6. Curriculum exclusion, identity/preservation, solution execution, PDF/text/visual and browser tests. Update DIT preservation tests to allow only explicitly reviewed Class 11 changes, preserving every non-target record. Existing class11 import tests mostly assert original fixture payloads and should remain unchanged.
7. Commit only intended source/generated/PDF/test files on `codex/11th-computer-book-alp`. **Never stage/revert pre-existing dirty `src/data/staticOverrides.ts` or `.agents/skills/seo/scripts/__pycache__/`.** Use artifact-only CI build before asking final current-batch publish approval per root AGENTS. Current live DIT release must remain intact.

Node/Python/Poppler runtime roots: `C:/Users/HP/.cache/codex-runtimes/codex-primary-runtime/dependencies/`. Windows Edge via Playwright `channel: 'msedge'`; CI Chromium. Keep TEMP/TMP and large intermediates on D. The repo `artifacts` junction points to D and must remain intact. No subagents unless explicitly authorised. No new deployment approval for this batch yet.
