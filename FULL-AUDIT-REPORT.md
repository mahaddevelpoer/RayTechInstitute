# Focused keyword implementation review

Scope: report-driven review of resource-page and programming metadata templates, not a new full-site crawl or a ranking assessment. Source: user-supplied deep-research-report.md. The supplied Markdown contains 100 keyword rows; the linked 1,000-row CSV/XLSX and authenticated demand data were unavailable. All search-volume claims remain unverified.

## Confirmed findings and changes
1. Long class/subject titles were passed through buildSeoTitle, which can truncate the final resource intent. Added buildResourceSeoTitle to preserve Notes PDF, MCQs & Answers and Past Papers; applies to generated resource listings. Evidence: src/utils/seo.ts and the three resource generateMetadata functions.
2. Past-paper H1 said Official Board Past Papers across subjects; changed it to the actual class/subject and Past Papers. Notes H1 now includes the actual class as well. These headings describe available resources without manufacturing board coverage.
3. Empty notes, MCQ and past-paper listings inherited indexable metadata. Their listing templates now emit noindex/follow when the corresponding static resource array is empty; filled listings remain indexable. Existing export finalisation excludes noindex pages from sitemap. This is not a deletion of their URLs.
4. Gazette metadata omitted class in the search title. It now retains the year/class and Gazette purpose alongside board context.
5. Programming language hubs now explicitly describe tutorial/coding-practice intent. Course H1 and home introductory text identify programming courses, class notes, chapter MCQs and past papers. No class restriction is added to brand identity.

## Research boundaries
The Top 100 keyword-to-hub candidates are in docs/seo/research-keyword-map.csv. They are editorial candidates, not proof that a particular board PDF or pairing scheme exists. No duplicated city/board pages were generated. The report's inaccessible sandbox citations are not adopted as verified references. No official affiliation, search-volume figures, result dates, backlinks or ranking guarantees were invented.

## Validation
Project TypeScript passed. Existing metadata/schema tests passed (7 tests). Release pipeline will rebuild catalogs, regenerate sitemap, check metadata and private credentials, and verify live export before a successful release is reported. No new Core Web Vitals field score or Search Console ranking measurement was collected in this review.

6. Competition home and rules retained pre-launch noindex even after release. Removed that pre-launch restriction for these two useful public pages. Private/personal result and gameplay routes retain their existing indexing policy. Sitemap regeneration discovers the newly indexable canonical pages.
