# Legacy article unlisting

User request: keep all existing article pages accessible by their direct URLs, but remove ways to reach them through the public website.

The existing 639-article frozen inventory is the archive. Public Blogs & Updates cards, search and category results use reviewed educational article eligibility. Historical categories are removed from that public feed. New reviewed educational articles remain listable. The empty state points students to class resources.

Related-article selection excludes the archive, including recommendations on archive pages themselves. Archived destinations in Markdown render as readable text. Editor-supplied source/internal/action links are filtered, and smart-syllabus resource pages no longer offer links to their archived article companions. Academic PDF/resource pages stay available. Administrative management retains all records.

No article record, direct route, document or frozen noindex entry is deleted. Article static params are unchanged. The build checks every public exported HTML file for zero clickable anchors into the archive, and checks all 639 article HTML files still exist with noindex. Client/browser checks cover listing search/categories, stale browser cache, direct article visits and syllabus resources at mobile/desktop widths.

Status: local typecheck and focused tests recorded before the full isolated artifact build. No publication approval has been assumed from the previous release.
