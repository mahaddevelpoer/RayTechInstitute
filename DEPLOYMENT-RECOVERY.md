# Static deployment recovery

## Confirmed cause

The content-published GitHub run `39568633361` succeeded on 21 October 2026,
but checked out `6e0a376df2d71aa46a2b9609911a3c544dca54eb` (16 October).
The newer learning platform and admin course pages had only been deployed
from the local checkout, not committed to main. A video attachment correctly
triggered an Action, but that Action replaced Hosting with the old application.
HTTP checks confirmed `/learn/css/`, `/admin/courses/` and `/deployment.json`
returned 404, while the home page still returned HTML.

`index.txt` is a Next static App Router navigation payload, not an HTML page
renamed to text. Keep both the route's `index.html` and its navigation payload.
Do not rewrite every missing route or text file to the home page.

## Prevention

- Keep the deployed implementation in the default branch, including all build
  scripts, lesson content, runtime source and admin routes it requires.
- Build fresh public snapshots from Supabase. Fail on fetch/publication errors
  instead of silently deploying empty or stale learning data.
- Run tests and require both HTML and navigation payloads for every published
  lesson, quiz, assignment, course, language and critical admin route.
- Require the deployment manifest to match the workflow revision and catalog.
- Audit local export links and private credentials before Hosting deployment.
- Revalidate mutable content while preserving immutable hashed asset caching.
- Verify all live HTML pages against this exact export after deployment.
- Retain `deployment.json` as a GitHub artifact and serve it on Hosting so the
  deployed revision and workflow URL can be inspected without guessing.

Compilation and regression tests run on GitHub's runner, not concurrently with
large local builds on the user's memory-constrained computer. The Codi neural
runtime is retired from the default build; cloud voice uses server-held keys.

The database is authoritative for lesson video IDs. Attaching or removing a
video is reflected in the next snapshot build; publication does not require
manually editing generated HTML files or client database reads.
