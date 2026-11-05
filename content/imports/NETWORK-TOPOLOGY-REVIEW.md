# Network Topology import review

Source: Raytech_Network_Topology_chp # 2.docx, supplied on 5 November 2026.

Placement: Academic Programs / D.I.T / Semester 1 / Computer Science / Computer Networking / Chapter 2: Network Topology.

The stored chapter position is 4 because positions 1, 2 and 3 already identify Basic Terminologies, MS Office and Microsoft Word 2016. The existing book metadata shows this as Chapter 2 within Computer Networking. No existing chapter IDs, question IDs or URLs need to change.

## Completed

- Extracted all 100 questions, English and Urdu, with four bilingual options each.
- Preserved the ten source topic headings and their order, with ten questions in each topic.
- Compared all 100 selected options against the document's teacher answer key, including bilingual answer text.
- Checked any highlighted answers against the same key.
- Confirmed the existing live chapter catalog using a read-only request.
- Prepared a transaction that imports a new chapter and questions without changing existing material.
- Tested the transaction twice in an isolated local database: no duplicates, existing Office/Word chapters preserved, changed question content causes rollback.
- Verified that the shared book renderer places the chapter under Computer Networking with display number 2.
- Added a local preview option: TOPOLOGY_MCQ_PREVIEW=1 for scripts/preview-dit-topics.mjs. Combine with BOOK_MCQ_PREVIEW=1 to inspect existing notes alongside the new question bank.

## Publication status

Staged locally. No production database writes or deployment for this academic import. The generated transaction is artifacts/network-topology-review/publish-after-approval.sql. Article publication remains a separate authorised release.

This is a faithful import of the supplied question bank, not an independent certification that every question matches an official board syllabus. No extra questions or official-board claims were invented. No PDF conversion was requested in this turn.
