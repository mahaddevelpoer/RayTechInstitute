# Static navigation repair: 27 November 2026

Status: published and live verified. Mahad explicitly approved publication. Deployment run 45955361979 published artifact run 45954130912, application revision a27a02b3cc624f14814c5452a717c7f0572c4c41. Read-only verification run 45955792843 passed on the custom domain.

The reported URL `/classes/11th-class/computer-science/notes/index.txt?chapter=5` currently returns HTTP 200 `text/plain`, containing Next.js navigation data rather than a page. The clean notes URL returns HTML. Next 15's static-export router appends `index.txt` to its data requests. Its network/decoding exception handler returns that raw data URL as a document-navigation fallback. The ordinary non-200 and build-mismatch branches already normalise the path; a simulated HTTP 503 correctly returned to HTML, so the regression uses a connection failure to exercise the separate exception branch. The framework accepts text/plain in export mode, so the MIME type alone is not the diagnosis. The user's particular connection failure cannot be reconstructed retrospectively.

## Repair

- A build-time exact `next/link` alias uses a small native anchor component for this fully static HTML site. Links begin ordinary document navigation without waiting for an RSC data fetch or router hydration. Query strings, hash links, accessibility attributes, click callbacks, target/rel and normal browser controls remain supported. Native page navigation reloads the document; cross-page in-memory state is not retained. Existing persisted progress and theme/consent storage remain in use.
- The legacy public blog redirect also uses a document navigation. Administrator programmatic authentication routing is outside this repair.
- The Cloudflare export emits an exact 302 recovery rule for each real exported `index.txt`, pointing to its corresponding HTML route. The chapter query remains attached. No catch-all rewrite is introduced, unknown routes stay 404, ordinary text/license files and PDFs are unaffected. The original third-party article redirect remains in place.
- Local preview honours these exact redirect rules so the regression runs against the same route mapping as the hosting export.

## Verification

Unit checks cover the production alias, native anchors and URL objects, omitted router-only props, exact redirects and query preservation. Browser checks deliberately make page-data requests unavailable, click Chapter 5 and Chapter 2, check the selected chapter, exercise browser back, open the reported malformed URL, and test links with JavaScript disabled. Mobile/desktop light and dark journeys record navigation request start time. A separate read-only baseline reproduces the old failure with a failed page-data request. Source checks, full export checks and current DIT/Class 11 preservation gates remain enabled.

Baseline run 45954126248 reproduced the exact reported URL after an aborted page-data fetch. Successful artifact-only run 45954130912, source a27a02b3cc624f14814c5452a717c7f0572c4c41, passed the full release suite and the new navigation scenarios. Four width/theme journeys issued zero page-data requests, started native document navigation in 33-48ms in the CI browser, retained Chapter 5 and Chapter 2 selections, passed browser back, and recovered the direct malformed URL with its query intact. The JavaScript-disabled link check also passed. These timings measure request dispatch, not total page load or a visitor's connection. See build-receipt.json, baseline.json, checks.json and reviewed screenshots. Removing the application-level wait does not remove a visitor's network latency or prove any Google ranking change.

Primary references: installed Next.js `fetch-server-response.js`, [Cloudflare static redirects](https://developers.cloudflare.com/pages/configuration/redirects/), and [Cloudflare serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Live verification

The reported Chapter 5 URL returns 302 to the clean HTML route with chapter=5 retained. Chapter 2/search queries, root index.txt and DIT payload URLs also recover correctly. Unknown routes remain 404, robots.txt remains a real text file, the Chapter 5 PDF hash is unchanged and DIT retains 36 guide links. Four live width/theme journeys issued zero payload requests and started document navigation in 36-38ms in the verification browser; browser back, chapter switching, direct malformed-URL recovery and JavaScript-disabled navigation passed. These are dispatch measurements, not total-load guarantees. Screenshots and JSON evidence are in live/. No production content database records were changed.
