# RayTech article research and publication handbook

Updated 11 November 2026. Follow this file together with AGENTS.md. Instructions here describe the existing repository workflow. Verify current state before a production change.

## Project and access

| Item | Value or location |
| --- | --- |
| Working checkout | D:\raytech-india-release |
| Repository | https://github.com/mahaddevelpoer/RayTechInstitute |
| Production website | https://raytechinstitute.com |
| Production branch | main |
| Current local branch | Check with git branch --show-current |
| Hosting | Cloudflare Pages, deployed through GitHub Actions |
| Cloudflare account ID | 67c68fe5eb47fcda8d58c8b5e5862f09 |
| Supabase project reference | btxrkhwyugzliswznkpx |
| Supabase endpoint | https://btxrkhwyugzliswznkpx.supabase.co |
| Public article table | public.blogs |
| Workflow | .github/workflows/deploy-firebase.yml |
| Content publication event | repository_dispatch, content-published |
| Public documents directory | public/documents/ |
| Public article images | public/images/editorial/ |

The IDs and URLs above are configuration. Private credential values belong in the existing CLI sessions and secret stores. Never paste a service-role key, Cloudflare API token or Firebase service-account JSON into this file, an article, a command log or a public commit.

### Authentication and credential names

1. Run `gh auth status` to check GitHub access. If unavailable, use `gh auth login` and let the owner complete authentication. The account needs repository push and Actions dispatch access.
2. Supabase access is implemented in `scripts/learning-cli-access.mjs`. `readLearningServiceKey()` retrieves the scoped service_role credential through the authenticated Supabase CLI and returns it in process memory. Reuse this helper. Do not print the CLI API-key response.
3. On Windows the helper normally resolves the Supabase CLI entry under `%APPDATA%/npm/node_modules/supabase/dist/supabase.js`. `SUPABASE_CLI_ENTRY` can supply an existing installation path. Failed authentication must be repaired through the CLI login flow.
4. GitHub Actions uses `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `YOUTUBE_API_KEY` and `CLOUDFLARE_API_TOKEN`. Names come from the workflow. Confirm them there when setup changes.
5. The workflow also references `FIREBASE_SERVICE_ACCOUNT_RAYTECHINSTITUTE` for the Firebase deployment option. Select the existing Cloudflare hosting path for ordinary current releases.
6. GitHub repository secrets are managed at Settings → Secrets and variables → Actions. Supabase Edge secrets support separate runtime functions. An ordinary manually researched article does not require calling a paid AI service or exporting Edge secrets.

## Start from the current state

Run these commands from the checkout. Check every exit code before a dependent operation.

```powershell
git status --short
git branch --show-current
git log -5 --oneline
git ls-remote origin refs/heads/main
gh auth status
```

Read AGENTS.md and the relevant queue's plan.json, STATUS.md and last release evidence. Preserve edits made by other people. If remote main moved, inspect the difference before pushing. Keep article releases limited to reviewed content, assets and necessary publication plumbing.

Existing standing user authorization covers finished, verified editorial publication. Latest requests can narrow or pause that authorization. Record the selected batch before any production insertion. The normal batch size is ten. An explicit request to publish fewer completed drafts authorizes that smaller batch.

## Research each search intent

1. Read the CSV as data. Preserve the original query, row and related-search breakdown.
2. Export the current article catalogue with `fetchCatalogRows()` from `scripts/catalog-fetch.mjs`, authenticated through `readLearningServiceKey()`. Save only id, title, slug and tags in an ignored artifacts snapshot for duplicate review.
3. Compare topic intent as well as exact titles. A season fixture guide can cover another search for that same season guide. A completed match recap can be a distinct intent when the earlier page only describes the tournament schedule.
4. Mark every input row with a disposition such as already covered, unclear, research pending, draft prepared or published. Store the existing canonical slug when covered. Combine overlapping queries into one focused article.
5. Search official publishers first. For examinations, use PECTAA and the actual board website. For sports, use the governing body, organiser or club. Open documents and check dates inside them.
6. Record event date, publication date, current status and exact entity. Resolve misleading old seasons and archived notices. A search snippet alone can miss amendments or show a provisional score.
7. For a PDF, read the notice and relevant annexures. Verify the reference number, date, grade, session, examination year and precise subject instructions. Visually inspect important pages.
8. Record each source URL and what it supports. If official access fails, describe the source limit in the research record. Keep claims proportional to the material actually verified.
9. Verify arithmetic independently. Preserve units, overs notation, percentage denominators, targets and margins. Distinguish examples created for teaching from reported events.
10. Leave a result pending when it is still pending. Recheck near publication if the story is moving.

## Write the article

Use English on the website and Roman Urdu for owner updates. Write the answer and confirmed development first, followed by relevant detail. Use natural prose and useful tables, examples and questions. Avoid repetitive filler, keyword stuffing and unsupported claims.

The current editorial batches require at least 2,000 body words before `## Sources`, excluding Markdown-only tokens, and 42 distinct relevant tags. This is a publication checklist used by these scripts. It does not imply an AI generation limit in the admin panel.

Use one page H1 supplied by the template. Body headings start at H2 and follow a consistent hierarchy. Add relevant internal links to existing resources. Place compact source links at the end. Preserve historical dates and image context. Do not claim that metadata or publication guarantees search ranking.

### Metadata and record shape

Each draft folder normally holds article.md, post.json, images-candidates.json, images.json and review.json. The queue holds plan.json, research notes, validation and live release evidence.

post.json contains id, title, slug, category, excerpt, content, featuredImage, author, datePublished, readTime, tags and seo. Use an approved existing category. Use a stable lowercase hyphenated slug and unique ID. Check both against the live catalogue.

The seo object includes enabled, title, description, socialTitle, socialDescription, sources, internalLinks, authorUrl, socialImage, imageAlt and imageCaption as applicable. Existing validators require a 50–60 character SEO title ending in ` | RayTech Institute` and a 120–155 character description. Keep the social title useful when the article is shared.

## Images

1. Find two different relevant network images with a reusable licence. The owner prefers real images. Do not generate substitute images.
2. Retain source page, creator, licence and licence URL. Check image metadata and view the actual picture. Attribution does not replace permission to reuse.
3. Compare original image SHA1 values against all editorial image manifests, including `content/editorial-revisions/trending-pk-20261030/images.json`. Repeated photos across articles were a user-reported issue.
4. Record accurate alt text and captions. Label archival and illustrative material. Avoid presenting an unrelated player or venue as the current event.
5. Resize to at most 1280 by 960 within aspect ratio and encode WebP. The existing prepare script uses Sharp with concurrency one. Keep downloads bounded and avoid heavy local builds.
6. `scripts/prepare-november-article.mjs` supports the current dated queue and adds the inline image plus credits. Read its batch allowlist before using a new date. Re-running it rebuilds content from article.md.
7. View both final images or a labelled contact sheet. Store visual review as passed only after inspection.

## Attach a PDF with preview and download

Use `src/components/educational/ArticleAttachment.tsx` and `src/utils/documents.ts` as the existing entry points. BlogDetailClientView mounts the attachment when actionButtonUrl is supplied.

Copy the approved PDF into a descriptive path under public/documents/. Use its full production HTTPS URL in the article record. Same-site PDFs in that directory receive a same-site preview URL through documentLinks(). Other supported PDFs can use Google preview. Check the actual wording and behaviour because the current attachment component mentions Google even for hosted documents.

The database fields are `action_button_text` and `action_button_url`. Several old batch publishers hardcode both to null. A PDF article must preserve the requested attachment fields in its publication mapping. Inspect the publisher before using it. Put a visible PDF download link in the body and provide the attachment preview control. Verify the file's MIME type, length and PDF signature after deployment, then open the preview through the article's normal controls. Verify mobile access and a direct open/download fallback.

Check redactions before serving an uploaded PDF. Keep the approved document intact unless editing is explicitly requested. Record its hash so the served file can be compared with the approved source.

## Validate before saving production data

For the 7 November queue, reuse `scripts/verify-pakistan-nov7.mjs`, `scripts/publish-pakistan-nov7.mjs` and `scripts/record-pakistan-nov7-release.mjs`. These are queue-specific scripts. Read their expected plan shape and artifact paths before extending them to another queue.

Create a releaseBatches entry with number, keys, expectedSize, explicitUserAuthorization, state and validationFile. Each selected key must also have a groups entry with the draft slug. Keep prior release evidence intact.

The validator checks word count, tags, metadata, slug, heading hierarchy, source references, private credential patterns, unsafe HTML, inline image count, licence metadata, dimensions, global image uniqueness and known internal article links. Run it for the selected batch and inspect the JSON result.

```powershell
node scripts/verify-pakistan-nov7.mjs --batch-number=NUMBER
if ($LASTEXITCODE -ne 0) { throw 'Validation failed' }
node scripts/publish-pakistan-nov7.mjs --articles=KEY1,KEY2
if ($LASTEXITCODE -ne 0) { throw 'Dry run failed' }
git diff --check
```

Supply the validator's expected fresh catalogue snapshot. A dry run should report the reviewed count, the new count and zero overwrites. Investigate any collision. A retry must compare existing saved fields and preserve unrelated rows.

## Publish source, then save records, then dispatch once

Stage only the selected article folders, reviewed assets and necessary scoped scripts. Exclude artifacts containing raw database backups, credentials or unrelated work. Check the staged diff. Commit editorial source using `[skip ci]`, then push only after confirming the branch and remote state.

```powershell
git diff --cached --check
git commit -m "Publish reviewed article batch [skip ci]"
if ($LASTEXITCODE -ne 0) { throw 'Commit failed' }
git push origin HEAD:main
if ($LASTEXITCODE -ne 0) { throw 'Push failed' }
node scripts/publish-pakistan-nov7.mjs --articles=KEY1,KEY2 --publish
if ($LASTEXITCODE -ne 0) { throw 'Database save failed' }
gh api --method POST repos/mahaddevelpoer/RayTechInstitute/dispatches -f event_type=content-published
if ($LASTEXITCODE -ne 0) { throw 'Dispatch failed' }
```

The publisher must retain a pre-save backup in ignored artifacts, insert missing records, read them back field by field and confirm older records remain intact. Save the receipt. An insertion alone does not update the static public website. The content-published event builds a fresh static catalogue and deploys it.

## Monitor and verify the live release

```powershell
gh run list --repo mahaddevelpoer/RayTechInstitute --limit 6 --json databaseId,name,status,conclusion,headSha,event
gh run watch RUN_ID --repo mahaddevelpoer/RayTechInstitute --interval 15 --exit-status
```

Choose the build-and-deploy run matching the source commit and repository_dispatch event. A separate Codi audio workflow may run alongside it. Inspect failures with `gh run view RUN_ID --log-failed`. Fix the specific failure before retrying. Avoid repeated dispatches that waste build and hosting resources.

For the current queue, run the live verifier with selected article keys.

```powershell
node scripts/verify-november-publications.mjs --region=PK --batch=20261107-daily --articles=KEY1,KEY2 --cloudflare-resolver
```

Inspect `pending`, which must be empty. The ledger may include previously verified articles, so compare the selected keys and checked time. Confirm HTTP 200, both images, exact SEO title and description, canonical, one H1, BlogPosting schema, indexability, blog listing and sitemap. For PDF articles also check the actual served PDF and the preview interaction. The ordinary article verifier does not prove those extra attachment behaviours.

Once checks pass, record the release using its batch number and actual successful run ID. Commit and push evidence with `[skip ci]`. Check git status. Tell the owner the actual live URLs and remaining counts. Keep incomplete work described as incomplete.

## Recovery rules

- Database saved but deployment failed. Keep the last good public release. Diagnose the failed run, preserve the saved records and retry through an idempotent publisher or the correct release workflow.
- Live page missing. Check database slug, build catalogue, export manifest, hosting revision and routing. A browser refresh cannot create a missing static file.
- Image missing. Check its committed public path, case, HTML reference and live status. Do not substitute a reused image to make the validator pass.
- Sitemap missing the article. Check the exported sitemap and selected hosting revision. A passing HTTP request for the sitemap alone does not prove the article URL is included.
- Preview fails. Check documentLinks(), the attachment fields, MIME type, CSP and actual document response. A link to a board homepage is not a PDF attachment.
- CI browser check fails after deployment. Read the exact failure. Keep the original failed run recorded. If the existing read-only verification workflow is appropriate, run it against the same export artifact and retain both IDs. Do not call a failed run successful.
- Sensitive data appears in a staged change. Unstage the affected file and remove the exposure before publishing. If a private credential was already made public, revoke it through its provider and replace the relevant secret.

## Current handoff

The last verified release published Everton–Coventry and FATA–Lahore Whites. The 7 November queue has 22 published articles covering 24 CSV rows, 11 already-covered rows, 15 unclear skips and 10 remaining review rows. Older queues retain 230 India review rows and 38 Pakistan review rows. These are review counts, not confirmed counts of new articles to write.

The active priority is the supplied Grade 11 ALP notification article with PDF preview and download. Its local source is `C:\Users\HP\Downloads\Video\Upgrades\ALP-Notification-Grade-11_Redacted_Redacted.pdf`. The first page has now been extracted successfully. It contains 71 pages, notification PECTAA/C&C Unit/2026/1239 dated 06.11.2026, academic session 2026–27 and BISE Annual Examination 2027. It records committee approval on 05.11.2026. The official PECTAA downloads page timed out during initial checks. Complete annexure reading, visual review and official corroboration before publishing a subject-specific exclusion list.

Bundled Python at `C:\Users\HP\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe` has pypdf and pypdfium2 available. Use pypdf for text and pypdfium2 for page rendering. The system Python initially lacked these packages. Reuse bundled dependencies before installing more software. The article and attachment have not yet been published.

## Smart syllabus handoff update: 11 November 2026

The subject release is documented in SMART-SYLLABUS-PROGRESS.md. Source manifests are in src/data/smart-syllabus.json; manuscripts and reviewed article rows are in content/smart-syllabus-2027. Rebuild rows with node scripts/build-smart-syllabus-articles.mjs, verify with node --test scripts/smart-syllabus.test.mjs, then use scripts/publish-smart-syllabus.mjs in dry-run mode before --publish. That publisher preserves attachment URLs, refuses overwrites and verifies all saved fields plus preservation of existing rows. Public resources derive from tagged published blog records; source manifests never restore a deleted record. Admin users manage them at /admin/smart-syllabus/.

Official PECTAA downloads now responds and corroborates both booklets. There are 15 verified subject extracts. The Grade 11 Islamiat footer has a year conflict, explicitly flagged in the published writing. Grade 10 and Grade 9 Computer Science still require a current verified source. Ignore the earlier initial-timeout note as a description of current connectivity.

The smart syllabus release is now live and verified at revision 017af851fd1b0edca54f20e92f6a94727973c416, full Cloudflare run 42996806710. See content/release-evidence/smart-syllabus-2027.json. Use scripts/verify-smart-syllabus-live.mjs with the expected full revision SHA, then scripts/check-smart-syllabus-live-browser.mjs for public controls. The identical overview record blog-1794137592576 is retained for history but excluded from public static listings; its old URL permanently redirects to the original overview. Edit the original overview, blog-1794136001771, for future overview changes. Its two broken internal links have been repaired.
