# Static navigation repair: 27 November 2026

Status: prepared locally; production export/browser verification pending. Not deployed. This batch needs its own explicit publication approval under the root AGENTS.md.

The reported URL `/classes/11th-class/computer-science/notes/index.txt?chapter=5` currently returns HTTP 200 `text/plain`, containing Next.js navigation data rather than a page. The clean notes URL returns HTML. The installed Next 15 static-export router appends `index.txt` to its data requests and falls back to navigating to that data URL when a request fails or its build ID differs. The framework accepts text/plain in export mode, so the MIME type alone is not the diagnosis. A failed data request or a stale client is a plausible trigger; the user's particular network failure cannot be reconstructed retrospectively.

## Repair

- A build-time exact `next/link` alias uses a small native anchor component for this fully static HTML site. Links begin ordinary document navigation without waiting for an RSC data fetch or router hydration. Query strings, hash links, accessibility attributes, click callbacks, target/rel and normal browser controls remain supported. Native page navigation reloads the document; cross-page in-memory state is not retained. Existing persisted progress and theme/consent storage remain in use.
- The legacy public blog redirect also uses a document navigation. Administrator programmatic authentication routing is outside this repair.
- The Cloudflare export emits an exact 302 recovery rule for each real exported `index.txt`, pointing to its corresponding HTML route. The chapter query remains attached. No catch-all rewrite is introduced, unknown routes stay 404, ordinary text/license files and PDFs are unaffected. The original third-party article redirect remains in place.
- Local preview honours these exact redirect rules so the regression runs against the same route mapping as the hosting export.

## Verification

Unit checks cover the production alias, native anchors and URL objects, omitted router-only props, exact redirects and query preservation. Browser checks deliberately make page-data requests unavailable, click Chapter 5 and Chapter 2, check the selected chapter, exercise browser back, open the reported malformed URL, and test links with JavaScript disabled. Mobile/desktop light and dark journeys record navigation request start time. A separate read-only baseline reproduces the old failure with a failed page-data request. Source checks, full export checks and current DIT/Class 11 preservation gates remain enabled.

Evidence and run receipts will be attached after verification. Removing the application-level wait does not remove a visitor's network latency or prove any Google ranking change.

Primary references: installed Next.js `fetch-server-response.js`, [Cloudflare static redirects](https://developers.cloudflare.com/pages/configuration/redirects/), and [Cloudflare serving pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).
