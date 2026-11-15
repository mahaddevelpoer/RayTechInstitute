# Trending PK 2026-11-15 batch 01 status

Local state: verified, unpublished. No push, database insert or workflow dispatch has been made.

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

## Gate: owner image approval

`imageVisualReview` is `pending` in every `review.json`. The publisher asserts `passed`, so publication is blocked until the owner visually approves all ten WebP files in `public/images/editorial/trending-pk-20261115-daily/`.

Files:

- portugal-denmark-cover.webp, portugal-denmark-inline.webp
- saff-pakistan-bangladesh-cover.webp, saff-pakistan-bangladesh-inline.webp
- faa-ground-stop-cover.webp, faa-ground-stop-inline.webp
- khunjerab-snow-cover.webp, khunjerab-snow-inline.webp
- nccia-call-centres-cover.webp, nccia-call-centres-inline.webp

The NCCIA cover and inline images are Islamabad city views, not raid photographs. Captions and credits say so.

## After approval

1. Set `imageVisualReview` to `passed` in each `review.json` and rerun validation.
2. Confirm no build is running.
3. Commit assets and draft records with `[skip ci]`.
4. Push to `main`.
5. Run `artifacts/pakistan-nov15-publish.mjs --articles=<five keys> --publish` after creating it from the verified publisher template.
6. Dispatch exactly one `content-published` workflow.
7. Verify the live revision, listing, images and sitemap; record the ledger.
