# Student access and security review: 23 November 2026

Status: implementation and focused local checks completed; complete export/browser verification pending. No production website, function, database policy or content mutation has been made for this change.

## Student journeys

- Homepage search submits an ordinary GET request to the class directory. Students can search class, subject, chapter or published MCQ topic names, choose a resource type and open the matching subject or chapter.
- The initial class-directory HTML contains real links to subjects with published material, including DIT. Filters narrow actual catalogue entries; empty classes/resources are labelled rather than advertised as available.
- Notes, MCQ and paper links are generated only when that resource type exists. Programme semester context, book-specific chapter numbering, original URLs, resource IDs and PDF files are preserved.
- Current published academic inventory: five subjects with resources, 23 notes and 1,968 questions, including all seven ICT chapters and 488 ICT questions. These counts are generated from the catalogue rather than entered in UI copy.

## Data and performance

Public navigation uses a compact generated manifest of class/subject names, counts, chapter labels and topic names. It contains no question bodies, answers or article content. The public header, home sections, study strip and video player no longer import the entire production catalogue. Public resource clients use separately generated academic exports; note/article bodies and the administrator store stay outside those directory imports. Only display punctuation is normalised in that generated copy; stored sources are unchanged.

The existing esbuild diagnostic measured approximately 3,642,499 gzip bytes in the initial home graph before the remaining global imports were removed, and 92,514 afterwards. This is a source-graph regression measurement, not a Next release size, PageSpeed score or field Core Web Vitals measurement.

## Security and SEO

The secure-dispatch source now checks method/media type, bounds streamed request bodies to 2,000,000 bytes and limits upload reading to eight seconds. Administrator verification checks the token's project, expiry and UID, verifies the exact token with Google and enforces the user's revocation boundary before applying the existing verified-email allowlist.

Next is patched to 15.5.29 and re2js to a version outside the reported vulnerable range. The production lockfile audit returned zero known advisories on this review date. New source/handler tests cover these request and session boundaries. Authentication, SQL role isolation, quotas, practice isolation, quiz scoring, Urdu text and PDF preservation were also checked locally.

Class h1 headings identify the class. DIT class and ICT note search titles use concise explicit templates without changing saved titles or URLs. Root organisation and publisher share a website identity; YouTube remains a sameAs link. Canonical, robots, empty-page noindex and real-404 behaviour are preserved. New browser checks require crawlable links, query-driven filtering and usable 360px/1366px light/dark layouts.

## Release boundary

The repository requires approval for the current non-editorial changes before live deployment. The website export and the secure-dispatch function are separate releases; deploying the website alone does not install the authentication fix. First build a reviewable non-publishing artifact and inspect its screenshots, then request final approval for those concrete changes. The existing dirty src/data/staticOverrides.ts is an external production snapshot and is deliberately excluded from the commit.

## Remaining external verification

Search Console indexing, selected canonicals, manual actions and traffic causes need account-side evidence. Anonymous PageSpeed returned 429, so field LCP/INP/CLS are unknown. Notification registration still needs a trusted durable edge/database limiter for protection across instances; its current Origin-based memory limiter is not user authentication. Firebase console MFA, API restrictions and a complete live RLS policy inventory were not verified. None of these checks establishes that a site is invulnerable or guarantees search placement.
