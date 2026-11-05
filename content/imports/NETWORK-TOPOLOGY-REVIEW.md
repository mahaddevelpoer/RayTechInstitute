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

Published on 5 November 2026 after the user's explicit approval. The guarded transaction imported all 100 questions and preserved all 265 pre-existing questions and four pre-existing chapters. An import-time text encoding issue was caught during database readback and corrected before deployment; all English and Urdu questions, options and answers were then matched against the source again.

Cloudflare deployment and automated release checks passed: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/42024079235 . Live verification returned HTTP 200 and matched all 100 questions, their bilingual options, topic names and correct answers. The canonical URL, single H1 and sitemap entry also passed. Live verification used the canonical hostname with verified TLS and Cloudflare DNS-over-HTTPS to avoid stale local DNS. Pending India article drafts were excluded from this release.

Live page: https://raytechinstitute.com/classes/dit-intermediate/dit-computer-science/mcqs/

Verification evidence: network-topology-live-verification.json in this directory.

This is a faithful import of the supplied question bank, not an independent certification that every question matches an official board syllabus. No extra questions or official-board claims were invented. No PDF conversion was requested in this turn.
