# Pakistan 15 November editorial queue

Batch 1 is published and live verified. No unrelated UI, schema or permission changes were made.

## Release record

- Input: 86 rows.
- Batch 1 published 5 new articles covering rows 2, 5, 17, 26, 50 and 51.
- Four rows were already covered by existing published articles: rows 4, 6, 44 and 79.
- Batch 1: 5 articles, 11,182 body words, 210 tags and 10 distinct licensed images.
- Exact-revision live HTML, image bytes, metadata, listing and sitemap checks passed.
- Revision: e7861f6779fab4eeebc8e028df36d225ad6c47fe.
- Workflow: 43678714053 (served by the content-published build for the concurrent John Langford batch).
- No extra dispatch was made. The serving build started after these database rows were inserted, and exact-revision checks confirmed all five articles were live in it.

## Articles

| Key | Slug | Body words | Images |
| --- | --- | --- | --- |
| portugal-denmark | portugal-denmark-1-4-nations-league-november-2026-result | 2342 | 2 |
| saff-pakistan-bangladesh | pakistan-bangladesh-1-0-saff-semi-final-2026-first-final | 2186 | 2 |
| faa-ground-stop | faa-ground-stop-november-2026-flight-cancellations-explained | 2255 | 2 |
| khunjerab-snow | khunjerab-pass-snow-november-2026-containers-stranded-kkh | 2215 | 2 |
| nccia-call-centres | nccia-154-arrests-islamabad-rawalpindi-call-centres-november-2026 | 2184 | 2 |

## Checks completed

- `node scripts/verify-pakistan-nov11.mjs --batch=20261115-daily --region=PK --batch-number=1` passed.
- Body words >= 2000 per article, exactly one inline image and two images per article.
- Unique slugs and IDs against 584 existing articles.
- SEO title 50-60 characters ending ` | RayTech Institute`; description 120-155 characters.
- Exactly 42 unique tags per article.
- No em dashes, no H1 in markdown, no script/iframe/embed/object/style tags.
- Heading nesting, source blocks, image dimensions and WebP format checked.
- No image sha1 reused elsewhere in editorial drafts.
- Owner visually approved all ten WebP files on 15 November 2026.

## Remaining rows

- 47 rows are research-pending.
- 3 live-match rows are verification-held: 1, 3 and 86.
- 26 generic or ambiguous rows are skipped for insufficient context.
- Published rows: 2, 4, 5, 6, 17, 26, 44, 50, 51 and 79.

## Sensitive NCCIA note

The NCCIA cover and inline images are Islamabad city views, not raid photographs. Captions and credits say so explicitly.
