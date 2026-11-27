# Educational page cleanup review

Ready behavior:
- One native scrollable shortcut list; 18 unique links instead of 36 marquee links.
- 29 bounded lecture summaries in the final refreshed snapshot with existing two-line display. Full modal descriptions keep their content and use the current site domain.
- One homepage H1 retained; the brand remains a span.
- Quick summary and truthful publisher on 47 note and 2 past-paper detail pages. Recorded note dates shown; no invented faculty attribution.
- Opening summary and actual lesson version on 20 Python lessons, while preserving Codi sentence playback, coding tools, quizzes and assignments.
- Seven Course schemas for course/language directories, LearningResource data for the two past-paper companions, existing note/lesson data retained.
- Two relevant Python comparison tables with official references.
- llms.txt contains 35 existing academic/site links. The file is rebuilt from published records and checked against exported files.
- All 639 legacy articles keep noindex and remain excluded from the sitemap.

Verification includes lint/type checks, the existing source/security/academic tests, HTML/schema/link checks, native navigation, prepared-audio playback, and mobile/desktop light/dark screenshots. A previous build caught missing Codi summary buttons; the final source restores them instead of weakening the playback check.

Publication: not deployed. This is a structural/UI/schema release, outside standing article-only publication approval. AGENTS.md says: "Do not deploy or publish until the user explicitly approves the current changes." Seek approval for this completed, verified batch before deployment or main-branch publication.

Search Console: Noor Ahmad was reported indexed in Google's stored view. A recrawl request test was started; the final outcome was not confirmed before Chrome disconnected. No claim of six/eight successful requests, instant removals, or temporary Removals submissions. The four supplied live pages already return noindex/follow.

See FULL-AUDIT-REPORT.md for evidence and corrections to FAQ/llms/AI-ranking claims, ACTION-PLAN.md for remaining external steps, and build-receipt.json for the exact reviewed artifact.

Final result: artifact-only run 45964031864 passed all source, security, academic, audio, HTML/link/schema and browser checks. Source revision: cbfe2f808e0e8fb0efd82734d5200d93c63b5513. Eight summary scenarios passed across 360/1366px and light/dark themes, without document-level overflow. Inspected note mobile light/dark and Python mobile light/desktop dark screenshots; layout and contrast are readable. Evidence: export/checks.json, export/browser-checks.json and the PNGs. The final snapshot refreshed to 29 lecture cards; baseline had 28.
