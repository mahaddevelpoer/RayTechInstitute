# Legacy article unlisting

User request: keep all existing article pages accessible by their direct URLs, but remove ways to reach them through the public website.

The existing 639-article frozen inventory is the archive. Public Blogs & Updates cards, search and category results use reviewed educational article eligibility. Historical categories are removed from that public feed. New reviewed educational articles remain listable. The empty state points students to class resources.

Related-article selection excludes the archive, including recommendations on archive pages themselves. Archived destinations in Markdown render as readable text. Editor-supplied source/internal/action links are filtered, and smart-syllabus resource pages no longer offer links to their archived article companions. Academic PDF/resource pages stay available. Administrative management retains all records.

No article record, direct route, document or frozen noindex entry is deleted. Article static params are unchanged. The build checks every public exported HTML file for zero clickable anchors into the archive, and checks all 639 article HTML files still exist with noindex. Client/browser checks cover listing search/categories, stale browser cache, direct article visits and syllabus resources at mobile/desktop widths.

Status: local typecheck and focused tests recorded before the full isolated artifact build. No publication approval has been assumed from the previous release.

Final verification, 28 November 2026: artifact-only build 45971572375 passed all source, type, security, academic, SEO, audio, navigation, widget and browser checks. The complete export scan checked 853 public HTML pages and found zero anchors into the archive. All 639 archived article HTML pages remain present with noindex. Eight mobile/desktop scenarios passed for feed search/categories, stale browser cache, direct URL access (HTTP 200), absent archive recommendations and preserved syllabus resources. Screenshot and JSON evidence is in export/. New reviewed educational articles are covered by positive listing tests. This unlisting batch has not been deployed; prior publication approvals belong to earlier releases.

Publication update, 28 November 2026: user explicitly approved publication (kr do publish). Deployment run 46113135016 published artifact 45971572375. Read-only live run 46113366110 passed the exact source revision, every frozen direct article URL (HTTP 200), zero archive entry links across the sitemap/archive public page set, unchanged noindex/sitemap/crawl rules, eight listing/search/cache/direct-access/syllabus browser cases and 14 official Google widget/exclusion cases. Evidence and live screenshots: live/. No records or article routes were deleted.
