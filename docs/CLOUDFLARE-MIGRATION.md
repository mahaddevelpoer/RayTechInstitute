# Cloudflare Pages migration

Authorised by the user on 5 November 2026. Keep Firebase Hosting available until the Cloudflare copy, custom domain, HTTPS and key user journeys have passed verification. Firebase Authentication, Firestore and Supabase are retained. No billing changes are authorised.

## Prepared

- Pages project: `raytechinstitute`, account `67c68fe5eb47fcda8d58c8b5e5862f09`.
- Temporary host: `https://raytechinstitute.pages.dev`.
- Static export retains production canonical URLs and sitemap origin.
- Security policies are translated from `firebase.json` into `_headers`.
- Temporary Pages hostnames have HTTP `X-Robots-Tag: noindex, nofollow`.
- Root `404.html` is required to prevent Pages SPA fallback concealing missing routes.
- Every exported asset must fit the 25 MiB limit, with at most 20,000 files.
- Full browser regressions run against the GitHub runner's preview instead of downloading the Firebase production site repeatedly.

## Deployment modes

The existing workflow accepts `hosting_target`: `artifact`, `cloudflare` or `firebase`. Until cutover, automatic production releases still default to Firebase. Artifact mode changes neither live site. After cutover set repository variable `HOSTING_PROVIDER=cloudflare`; do not change it before the custom domain is working.

Cloudflare deployment uses the GitHub Actions secret `CLOUDFLARE_API_TOKEN`, restricted to this account with Cloudflare Pages Edit permission. Do not place deployment credentials in public environment variables, repository files, browser code or chat. Runtime Edge secrets remain in Supabase.

## External setup required

- Scoped GitHub secret is configured and its Pages/DNS permissions have passed actual API checks.
- Domain has been added as zone `88e97a0f6ad15e2c6d0d3c035ccd3ee4`; activation is pending Hostinger nameserver changes to `monika.ns.cloudflare.com` and `nicolas.ns.cloudflare.com`.
- DNS staging preserved seven existing records and restored two missing Resend aliases (`results` and `send`) using their live values. Website A/CNAME records remain pointed at Firebase and were made DNS-only for a safe nameserver transition. Original DNS snapshots are retained as short-lived workflow artifacts. No nameserver change has been made by the agent.
- Attach the custom domain through Pages only after the temporary deployment passes.
- If testing Google sign-in on the temporary host, add that exact hostname to Firebase authorised domains. Production's existing authorised custom domain is preserved.
- Preview AI/competition calls may be rejected by existing exact-origin CORS restrictions. Do not loosen production origins to wildcards to conceal this; test signed-in production flows after controlled cutover.

## Cutover checks

Verify custom-domain TLS, nested routes, real 404, production canonical/sitemap values, JS/CSS MIME types, static images/PDFs, Python/PHP/JavaScript execution and sandbox restrictions, Codi prepared playback, Google sign-in, authorised admin operations and competition entry. Keep server-side credentials excluded from the export.

Do not disable/delete Firebase Hosting before these checks pass. Existing fallback remains available during DNS propagation. After acceptance, stop Firebase deployment jobs and retire Hosting serving separately from Authentication/Firestore.

## Verified evidence

- Build, source/security checks and full local export/browser checks: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/41965929561
- Cloudflare preview: https://raytechinstitute.pages.dev/ . Exact export revision `cbf7eee99363cbfab2ee183f5809697112a6edae`, 367 indexable production URLs, 1,666 exported files, approximately 172.34 MB uncompressed; largest file is the 18.31 MB PHP interpreter. Retired local neural voice worker is absent.
- Actual Cloudflare seven-route/security/404 checks, Python/PHP/JavaScript execution, HTML/CSS sandbox rendering, lesson navigation and mobile overflow checks: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/41967695534
- Read-only DNS review: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/41967985052
- DNS staging and preservation read-back: https://github.com/mahaddevelpoer/RayTechInstitute/actions/runs/41968267064
- Signed-in Google account and live AI generation were not exercised by the preview compiler check. Production domain and origin configuration remain unchanged until the controlled domain cutover.
