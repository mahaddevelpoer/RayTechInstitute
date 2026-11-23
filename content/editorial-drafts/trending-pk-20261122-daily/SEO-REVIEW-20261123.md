# Existing and pending article SEO review

The baseline audit covers 618 existing article records. No authored title, description or social metadata was found disabled. Six long titles need editorial review; 78 records lack an in-body contextual class/blog link; 84 lack an authored cover-alt field (the current renderer still supplies fallback alt text). These are review flags, not proof of ranking loss. Unsafe legacy examination claims retain source-review and noindex handling.

The new related-reading feature uses same-category candidates, at least two shared non-generic tags and a meaningful subject word in both article titles/excerpts. It excludes the current article, duplicate URLs and content requiring source review. A maximum of three titled, crawlable links is rendered per page. Baseline preview found 335 eligible articles and 744 links; the exported release must verify actual rendering. Broad matches such as a subscription guide against operating-system updates were rejected by the additional subject check.

Social image metadata now honours the authored image-alt setting, consistent with the article cover. No body text, publication dates, URL slugs or indexability rules are changed by these SEO fixes. Recommendation tests cover ranking, duplicate/self exclusion, broad-tag rejection, unsafe content and bounded stable output.

Fifth Circuit article: 2,101 validated body words, 42 tags, two visually reviewed licensed images, primary court opinion and constitutional text. Scoped insertion preserved 618 existing records. Hosting verification pending.

Google guidance consulted: https://developers.google.com/search/docs/fundamentals/seo-starter-guide and https://developers.google.com/search/docs/essentials/spam-policies. These changes improve navigation and descriptive metadata; they do not establish indexing, rankings or AdSense approval. Remaining article writing and manual old-content reviews remain incomplete.

Final source c7a480c79ff85ee9a497b2a8d516e6673cc53926 includes Fifth Circuit and Fossil Fuel guides. Artifact run 45121963254 passed all build, source and browser gates. Run 45121260352 failed the older TypeScript-target compatibility check and was not deployed; the helper was corrected and locally typechecked. Run 45121575956 was superseded to include both articles in one release. Reuse the final reviewed export; public hosting verification pending.

Deployment 45122680751 succeeded. All 13 new articles passed public verification against the reviewed revision, including canonical, sitemap, SEO, schema and exact image bytes. Old syllabus-page related links, authored social image-alt and preservation of legacy noindex were directly checked. Six desktop/mobile checks passed; the three mobile screenshots were visually inspected. Evidence: LIVE-BATCHES-1-10.json and SEO-LIVE-VERIFICATION-20261123.json. Remaining articles and flagged manual old-content reviews remain outstanding.
