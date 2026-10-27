# D.I.T Computer Science Microsoft Word 2016

Status: extracted, prepared and tested locally. No production import, deployment, push or publishing workflow was performed for this batch.

- Source: `Chp#2_MS_Word_2016.docx`, unchanged.
- Destination: D.I.T (`dit-intermediate`), Computer Science (`dit-computer-science`), new **Chapter 3: Microsoft Word 2016**.
- The document's source chapter number is 2. The website uses 3 because Chapters 1 and 2 already contain the networking and introductory MS Office banks. Stable question IDs preserve the source chapter identity.
- 100 questions in English and Urdu, grouped into the ten original topics with ten questions each. Highlighted options agree with all 100 rows of the document's answer key.
- Topics: Word Processing and Features; Word 2016 Interface; Document Creation and Saving; Basic Editing Operations; Font and Character Formatting; Paragraph Formatting; Page Layout and Printing; Tables in Microsoft Word; Urdu Language and Typing; Word Keyboard Shortcuts.
- The reviewed transaction is `artifacts/word-mcq-review/publish-after-approval.sql`. It creates the chapter and questions atomically, preserves the existing 140 questions, refuses conflicting chapter numbers or changed question identities and does not reset timestamps on repeat imports.
- Local preview: http://127.0.0.1:4183/classes/dit-intermediate/dit-computer-science/mcqs/ . Select Chapter 3.
- The 24-hour golden highlight uses original database timestamps after an approved import. Preview timestamps are simulated only in the local preview script.
- PDF: `C:/Users/HP/Desktop/Chp#2_MS_Word_2016.pdf`, 35 pages, all 100 questions and the answer key present. Every page was rendered for visual inspection, with RTL shaping and yellow answer highlights preserved. Original DOCX SHA-256 remained unchanged.

Validation includes 100/100 correctly scored shuffled answers across ten topic quizzes; both prior chapters still offer their eight and six topics; responsive checks at 360/768/1366px in light and dark themes; zero external preview requests; transactional repeatability/collision tests; source lint and TypeScript checks.
