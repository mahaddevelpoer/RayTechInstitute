# Homepage and educational page audit

Scope: requested homepage navigation/video cleanup, notes and programming lesson summaries/schema, educational resource directory, and four identified legacy articles. Baseline obtained directly from live HTML on 27 November 2026. Evidence: baseline.json.

## Confirmed findings

- Homepage has one H1: Learn the concept. Then write the code. The RayTech header name is a span. No second H1 needs removal.
- Study shortcuts render two groups, 36 anchors for 18 shortcuts. They were intentional marquee copies, not two independent header mega menus. Replace with one unique, natively scrollable group.
- Homepage body includes three occurrences of the previous web.app domain from lecture descriptions. CSS line clamping does not remove long descriptions from the HTML. Render bounded clean summaries and normalize own-domain links in full modal descriptions.
- All four supplied legacy blog URLs return HTTP 200 with both robots and googlebot noindex, follow. Search Console initially reported Noor Ahmad as indexed. A Request Indexing action was started; final result was not confirmed. The browser session subsequently disconnected. Do not claim six/eight successful requests or Google removal.
- Notes already have LearningResource JSON-LD, and lesson pages have LearningResource/Quiz data. Course/language directories lack Course data; past-paper companions lack LearningResource data. Add structured data matching actual visible content without ratings, fake credentials, course fees or completion guarantees.
- Notes store actual lastUpdated dates. LearningTopic records have version numbers, not reviewed dates or faculty identities. Display recorded dates for notes, actual version for lessons, and RayTech Institute as publisher. Do not fabricate faculty review or set every page's content date to the build date.

## Corrections to supplied SEO claims

Google's current documentation says FAQ rich results stopped appearing on 7 May 2026 and its FAQ documentation was removed. Google AI search needs no special schema, AI files or optimization tricks. llms.txt is optional for other consumers and has no established Google ranking benefit. Implement it as a truthful resource directory; do not claim authority or top-20 placement from it.

An old URL in a lecture description does not by itself prove canonical confusion or traffic loss. Canonical/index reports are needed to establish that. Short clean summaries still improve visible quality and reduce redundant HTML.

Request Indexing is not an instant noindex-removal tool; it runs an eligibility test and noindex prevents indexing. Keep crawl access open. A Search Console request alone cannot prove removal. Urgent temporary Removals is a separate operation and is not submitted in this change.

Sources:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/updates (FAQ removal and llms.txt clarification)
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://support.google.com/webmasters/answer/9012289
- https://support.google.com/webmasters/answer/9689846
- https://schema.org/LearningResource
- https://schema.org/Course
- https://docs.python.org/3/library/stdtypes.html

## Unknowns

No ranking improvement, AI citation placement, Search Console removal, real-user INP/LCP/CLS or verified faculty review is established by source changes. Final release QA and approval are recorded separately.

## Final verified implementation

Confirmed by successful artifact build 45964031864: one homepage H1, one group with 18 unique shortcuts, 29 clean lecture cards, 47 note and two past-paper summaries with LearningResource data, 20 Python lesson summaries, seven Course schemas and 35 existing llms.txt links. All 639 legacy article noindex rules passed. Codi prepared playback, native navigation, academic PDFs and eight responsive summary scenarios passed. Screenshots are in export/. Build target was artifact only; no website deployment was performed. Chrome remains disconnected, so no further Search Console outcome is claimed.

Publication update, 27 November 2026: user approved this cleanup together with the official Google widget. Combined artifact 45967899465 deployed successfully in run 45969257902; live verification 45969543983 passed. Source revision: cb72aa1703129c0ad5dd61433fbfab43045e0371. Current live reports/screenshots: ../preferred-source-20261127/live/. Earlier not-deployed statements describe the original review stage. Search Console recrawl-request outcome remains unconfirmed and is separate from this successful website release.
