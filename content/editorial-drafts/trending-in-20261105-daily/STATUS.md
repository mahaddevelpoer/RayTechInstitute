# India trends, November 5, 2026

The user's latest priority is this India CSV before the 23 unfinished Pakistan topics. The Pakistan plan is unchanged; its hash is recorded in plan.json.

## Current state

- 421 input rows, compared against 296 existing published article records.
- 14 rows have explicit same-intent published coverage. No duplicate article was written for those fixtures or aliases.
- 38 vague rows are skipped under the standing instruction about unclear queries.
- 356 rows still need editorial intent review. They have not been declared duplicates or discarded because of language. Raw topic and breakdown are retained.
- 13 rows belong to the first ten selected article topics. Six articles are fully drafted and locally checked; four are not written yet.
- No India articles have been inserted into the database or deployed. The standard ten-article release is still incomplete.

## Six complete local drafts

Voyager 1, KTET hall ticket, UIDAI Aadhaar services, 5G, BSNL and Sensex. Together: 12,174 body words, 42 related tags each, and twelve globally distinct licensed WebP assets. The contact sheet is artifacts/india-november5/contact-sheet.png. Historical, illustrative and foreign-location images are explicitly captioned.

Local checks: minimum body length; title and description lengths; unique slugs; headings; sources; internal article links against the live baseline; image dimensions, format and global source-hash uniqueness; no active HTML or private-credential patterns. The India image URL prefix was corrected before verification. Public application code and credentials were not changed.

## Finish the first batch next

1. CBSE Class 10 2027 date-sheet guide. Read https://www.cbse.gov.in/cbsenew/Examination_Circular.html . The checked page includes 2026-27 private-candidate forms, but a subject-wise 2027 timetable was not verified. Do not call an old 2026 PDF a 2027 date sheet, and do not announce a release or an unreleased status without resolving the actual current notice.
2. SSC CGL 2026 answer-key guide. Official entry: https://ssc.gov.in/ . Secondary pages report a Tier-I release, but the exact official CGL 2026 notice was not retrieved. Do not confuse CGL 2025 Tier-II documents published during 2026 or Constable GD 2026 keys with this examination. Do not invent objection fee, deadline or marking rules.
3. CSIR-UGC NET guide. Official 2026 bulletin is linked from https://csirnet.nta.nic.in/document-category/information-bulletin/ . Read the actual bulletin before stating cycle dates, eligibility, subject structure or marking rules.
4. Delhi-NCR AQI guide. Group Delhi, Noida and Gurugram queries while explaining local station differences. Primary sources: https://www.airquality.cpcb.gov.in/AQI_NCR/ , https://aqi.delhi.gov.in/about , and https://ncdc.mohfw.gov.in/uploads/pdf/air18.pdf . Do not fabricate live AQI, current restrictions or a school closure. Identify India's AQI scale, station and timestamp. Retain current official health advice rather than inventing medical guidance.

Image candidates for the four pending drafts are cached in artifacts/india-november5/image-api. They still require selection and visual review. Search results sometimes include unrelated images; metadata alone is insufficient.

## Checked sources for the completed drafts

- Voyager: NASA's one-light-day projection is November 18, not already completed on November 5. Published timing 02:16:07 PST converts to 15:46:07 IST. Interstellar entry in 2012 is a different milestone. https://science.nasa.gov/mission/voyager/where-are-voyager-1-and-voyager-2-now/ and https://science.nasa.gov/blogs/voyager/2026/10/29/nasas-voyager-1-conserves-power-resolves-brief-communications-pause/
- KTET: official portal checked on November 5 displays admit-card download from November 4 and examination dates November 14-15. https://ktet.kerala.gov.in/ and https://pareekshabhavan.kerala.gov.in/ . No category-specific session time was invented.
- UIDAI: official services and September 2026 updated guidance checked. https://uidai.gov.in/kn/aadhaar-online-services and https://uidai.gov.in/en/updating-data-on-aadhaar . Features and requirements can differ by task. No universal fee or private application route was asserted.
- 5G: https://www.itu.int/en/mediacentre/backgrounders/Pages/5G-fifth-generation-of-mobile-technologies.aspx and https://www.itu.int/en/ITU-R/Documents/FAQ-IMT-2024.pdf . No operator-specific speed, handset compatibility or coverage guarantee.
- BSNL: https://selfcare.bsnl.co.in/home.html and https://www.pib.gov.in/PressReleasePage.aspx?PRID=2299484&lang=2&reg=48 . Web portal and mobile/broadband contexts kept distinct; no copied tariff or current outage claim.
- Sensex: https://www.bseindices.com/Downloads/BSE_Indices_Methodology.pdf , https://www.bseindia.com/ and https://investor.sebi.gov.in/ . Educational examples only, no fabricated live price or personal investment recommendation.

## Release path

Complete all ten before publishing. Use scripts/verify-india-november5.mjs for local validation. Image preparation supports --batch=20261105-daily --region=IN and checks both regional catalogs for duplicate image hashes. Publishing and live-verification drivers must be extended to the India root before use; the default November 5 publisher is still Pakistan-specific. Do not accidentally republish Pakistan's 12 completed articles or mutate its 23-topic queue.

The release destination remains Cloudflare Pages. Source and private database records must be read back before dispatching the static build. Verify the new live pages, image pairs, exact metadata, canonical URLs, listing and sitemap. Local DNS may still return old Firebase records; use the existing canonical-hostname Cloudflare verification route if necessary, retaining normal TLS verification. Firebase Hosting must not be removed or redeployed as part of this editorial batch.
