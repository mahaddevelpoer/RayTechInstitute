# Prioritized implementation

1. Remove duplicate shortcut markup; preserve native scrolling, keyboard reachability and real academic links. High impact, small effort.
2. Render clean two-line lecture excerpts, preserving full descriptions in the modal with canonical own-domain URLs. High impact, small effort.
3. Put quick summaries ahead of lesson tools/videos and document bodies. Display recorded note dates and actual lesson versions with truthful publisher attribution. Medium impact, small effort.
4. Add matching Course and past-paper LearningResource JSON-LD. Retain existing note/lesson schemas. Add two relevant Python reference tables with primary references. Medium impact, small effort.
5. Generate llms.txt from published academic records and verify each link resolves in the static export. Optional discoverability aid; no Google ranking claim.
6. Run focused tests, full isolated artifact build and responsive browser verification. Then seek publication approval for this specific structural/schema change under AGENTS.md. Do not deploy yet.
7. Search Console follow-up is incomplete because Chrome disconnected before the initiated request result could be verified. Preserve current noindex and crawling access. Reconnect for a live test if further Console work is requested.

Status: items 1-5 implemented and validated. Item 6 checks completed successfully in artifact run 45964031864; only publication approval remains. Item 7 remains an external browser-access follow-up.

Publication update, 27 November 2026: user approved this cleanup together with the official Google widget. Combined artifact 45967899465 deployed successfully in run 45969257902; live verification 45969543983 passed. Source revision: cb72aa1703129c0ad5dd61433fbfab43045e0371. Current live reports/screenshots: ../preferred-source-20261127/live/. Earlier not-deployed statements describe the original review stage. Search Console recrawl-request outcome remains unconfirmed and is separate from this successful website release.
