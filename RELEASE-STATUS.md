# Website release checks: 21 October 2026

## Scope

Preserved the existing English educational site, routes, classes, results,
gazettes, admin workflows, interactive lessons and browser interpreters.
Design direction: preserve the academic navy/teal identity, readable layouts,
consistent semantic themes and restrained, reduced-motion-aware transitions.
No new visual framework or decorative asset system was introduced.

## Changes verified in this release

- Direction-aware header visibility retains existing menu and focus behaviour.
- Both themes have tested body, secondary text, link and button contrast.
- Fixed selected-text contrast and visible keyboard focus in both themes.
- Extended dark styling to legacy success, warning and error colour variants.
- Retained empty, unlabelled ad reservations, without tracking/provider scripts.
  Real ads must remain distinguishable from teaching content when enabled.
- Removed unused imports, destructured values and callback parameters.
- Removed two unread video-player state values and their unnecessary updates.
- Strengthened export scanning for unknown provider credentials and legacy
  Supabase service-role JWTs, without printing credential values.
- Updated Transformers to 4.3.1. Production dependency audit reports zero
  vulnerabilities. Seven existing build-tool advisories remain unresolved.
- Kept the unfinished Codi voice experiment disabled and its generated assets
  out of the public export. Source work is preserved, not discarded.

## Evidence

- Full regression command: 134 primary tests and 46 post-tests passed.
- Release-security checks: 5 passed, including theme/header/secret-gate checks.
- Firestore emulator: 6 tests passed for owner-only access and validation.
- Strict TypeScript check passed with noUnusedLocals and noUnusedParameters.
- Custom lint passed across 233 source files.
- Production build passed: 138 generation entries, 134 index HTML routes,
  121 public-content pages and 93 indexable sitemap URLs.
- Checked 7,148 local references across 138 HTML files: zero broken targets.
- Scanned 382 exported files: no configured private credential matches.
- Live learning-table checks: authorized reads passed; anonymous reads denied.
- Live secure-dispatch/student-review preflight passed and unsigned requests
  were denied. Anonymous Firestore progress reads were denied as expected.

These are code, emulator and HTTP checks, not visual or signed-in acceptance
tests. No computer-control skill was used for this release.

## Explicit remaining limits

- There are 24 published lessons: 20 Python units and one foundation unit in
  each of HTML, CSS, JavaScript and PHP. This is not 100 finished lessons.
- Signed-in admin mutations, full AI generation/review and cross-device saved
  progress were not re-exercised with a real user session in this release.
- The local native SWC binary still produces a fallback warning. Compilation
  completes, but this machine's native compiler issue is not fixed.
- Cloudflare/registrar access has not been configured here. Follow
  CLOUDFLARE-SETUP.md and use records supplied by Firebase and Cloudflare.
- Browser inspection is intentionally not blocked or redirected. Client code
  is public; backend authorization, rules and secret handling provide security.
- Any credentials previously pasted into chat must be revoked/rotated by their
  owner if that has not already happened. No private credential is reproduced
  in this report.

## Publication confirmed

Firebase Hosting deployment succeeded on 21 October 2026 at
https://raytechinstitute.web.app. No GitHub push, DNS change, Edge Function
deployment or production database mutation was performed in this release.

All 134 live index HTML routes returned HTTP 200 and matched the corresponding
local export SHA-256 hashes. Homepage, admin login and the Python conversion
lesson returned CSP, SAMEORIGIN and nosniff headers; admin login also returned
noindex. The unfinished voice worker returns HTTP 404 as intended.
