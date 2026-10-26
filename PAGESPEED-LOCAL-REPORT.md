# Mobile PageSpeed review: local changes only

Date: 26 October 2026. Scope: the supplied PageSpeed report for the previously deployed homepage, plus local source, component, consent and responsive-layout checks. No release, push, workflow dispatch, live content mutation or deployment was performed.

## Observed baseline: confirmed

[Supplied mobile report](https://pagespeed.web.dev/analysis/https-raytechinstitute-web-app/qpxgkixj2f?hl=en&form_factor=mobile), read in the in-app browser. Its displayed performance score was 65; the user observed 66. Neither value describes these unpublished changes.

| Metric | Reported value |
| --- | --- |
| Performance / Accessibility / Best Practices / SEO | 65 / 95 / 100 / 100 |
| First contentful paint | 4.4 seconds |
| Largest contentful paint | 6.1 seconds |
| Speed Index | 5.4 seconds |
| Total blocking time | 0 milliseconds |
| Cumulative layout shift | 0 |
| Real-user field data | Unavailable |

Lab conditions: Moto G Power, slow 4G, Lighthouse 13.5.0. This is a single lab run, not evidence of real-user Core Web Vitals or a guaranteed future score.

## Findings and local disposition

| Finding and evidence | Local action / remaining limitation |
| --- | --- |
| Confirmed: cookie-banner paragraph became LCP, with 2,380ms element-render delay. The notice was inserted by a one-second timer. | Notice now exists in initial rendered HTML, with concise copy and no timed entrance. Saved consent hides it on hydration. Accept, decline and customization remain usable. Optional analytics defaults off; absent/invalid preferences cannot enable it. Actual LCP improvement still requires a production-export lab run. |
| Confirmed: Firebase auth iframe.js was about 93KiB, with a 30-minute third-party TTL and a critical-path duration of 2,057ms. Google API scripts added further work. | Auth was being imported by shared URL-sanitization utilities, analytics, video/admin helpers and optional notifications. App initialization is separated from Auth; analytics and notification SDKs load on consent/use. Unused Auth-dependent utility helpers were removed after checking their references. Anonymous homepage checks show no Auth/API/database/analytics requests after decline. Third-party cache headers cannot be changed locally. |
| Confirmed: unused JS estimate 123KiB; one 60ms task. | Admin video synchronization, database writes/catalog refresh, authenticated transport token loading and lecture modal are deferred. Public video checkpoints use the published snapshot; admin preview loads its saved editor catalog on demand. No compiler or admin SDK enters the initial homepage source bundle. The old unused-byte estimate and task duration must be remeasured after a future approved release. |
| Confirmed: two blocking CSS files, estimated 160ms savings. | Lesson workspace and tutor CSS moved to the learning layout. Home CSS moved to the homepage. Shared buttons/accent tokens remain global, preserving course, quiz, admin and error-page styling. Necessary CSS stays render-blocking to avoid unstyled educational content. |
| Confirmed: white small text on the emerald lesson button failed contrast. | Button now uses the tested primary theme tokens. Computed contrast passes AA in both themes. |
| Confirmed: footer gazette/YouTube colored text failed contrast on light backgrounds. | Theme-aware link colors, with visible hover/focus treatment. Computed contrast passes on actual rendered footer surfaces in both themes. |
| Confirmed: footer h4 skipped heading levels. | Earlier pending SEO changes already converted footer headings to h2; retained and checked. |
| Confirmed: repeated subject-link names led to different classes. | Accessible names now include the class and subject. Class-wide link text uses the actual class title, including D.I.T. |
| Informational: DOM inventory showed 1,007 elements, depth 14 and 28 children in the study strip. | Existing educational navigation and adaptive strip retained. The report's DOM inventory alone does not establish a broken page. Responsive checks show no document overflow; CPU/DOM costs still need release-level profiling if they remain material. |
| Confirmed: 9.9KiB estimated legacy JavaScript in framework chunks. | Remaining. Framework compatibility code was not deleted or bypassed. Requires a separately verified framework/browser-support change if still present in a fresh production report. |
| Confirmed: missing COOP security advisory. | Local Firebase configuration now supplies `Cross-Origin-Opener-Policy: same-origin-allow-popups`, preserving OAuth popup compatibility. Configuration tested; live headers intentionally unchanged. This is not strict cross-origin isolation. |
| Confirmed: CSP host allowlists, inline scripts and missing Trusted Types enforcement produced unscored security advisories. | Remaining. Existing CSP retained. No permissive Trusted Types policy, disabled security, or untested strict policy was added to silence the audit. A strict hash-based policy and Trusted Types require production-export hydration, sign-in, YouTube, Codi and compiler integration testing before enforcement. |
| Informational: limited/new browser-feature inventory. | Progressive enhancements and established compatibility behavior retained. Feature inventory is not itself a failed performance test. |

Google documents the popup-compatible COOP setting in its [identity setup guide](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid). A strict static CSP needs explicit script trust rather than simply deleting allowlist entries; see the [CSP implementation guidance](https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CSP).

## Verification: confirmed local results

- **68 targeted tests passed**, including six new PageSpeed regressions, existing administrator/student token checks, actual Supabase transport behavior, Codi direct-reading behavior, YouTube selection/player behavior, note save/PDF safety, gazette writes and SEO export-gate fixtures.
- TypeScript with unused-code checks passed; lint passed for all 325 scanned source files; `git diff --check` found no whitespace errors. Git emitted ordinary LF/CRLF conversion notices, not test or build failures.
- One headless Edge browser checked real homepage components at **375, 768 and 1,280px**, each in light and dark mode. No horizontal overflow or JavaScript page errors; affected footer/button text met 4.5:1 contrast; consent decline worked; no unwanted Auth/database/analytics network requests. External image requests were blocked by this isolated test; it does not certify remote image availability.
- Public video checkpoint regression confirms the video pauses, displays the question and shows answer explanation after the store-loading change. Provider calls are mocked for this component test.
- Source bundle diagnostic: **109,779 gzip JavaScript bytes** across its initial JS files, excluding Auth, analytics, Supabase, editor catalog, admin modules, modal and Python compiler. This uses esbuild and is **not** the final Next.js release size or Lighthouse score.
- Custom CSS source comparison, minified without Tailwind generation: previous universal set **50,646 bytes / 10,122 gzip**; current homepage set **28,002 bytes / 6,258 gzip**. This excludes generated Tailwind utilities and release chunking; it is not an estimate of the exact transfer size seen by PageSpeed.
- `npm run test:pagespeed` is available for lightweight repeatable regressions. The pending workflow contains the same source test for code changes; no workflow was dispatched.
- `scripts/pagespeed-mobile-check.mjs` is the optional one-browser component check. Ignored artifacts: `artifacts/pagespeed-review/bundle-graph.json` and `artifacts/pagespeed-review/mobile/checks.json`.

## Before claiming every warning is cleared

1. Resolve or explicitly accept the remaining framework-polyfill and strict CSP/Trusted Types advisories, with the appropriate compatibility tests.
2. Produce and check a fresh production Next export. No heavy full export was run in this batch to avoid overloading the user's system. Source/component checks do not replace it.
3. Only after explicit publication approval, deploy the reviewed release and rerun mobile PageSpeed on that exact release. Check LCP, unused JS, CSS savings and actual live headers again.
4. Search Console/custom-domain verification remains pending until the user buys and connects the domain.

**Status:** primary confirmed performance causes and reported contrast/heading/link-name issues have local fixes. Not published. A new performance score, zero remaining advisories, and full production readiness are not claimed.
