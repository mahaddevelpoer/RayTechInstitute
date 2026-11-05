# November 5 editorial source notes

Source file: trending_PK_1d_20261105-1014.csv, 81 data rows. Baseline: 284 database article records retrieved read-only on November 5. The private snapshot and source CSV are kept outside tracked content.

## Classification

- 42 rows are grouped into 35 research intents. These include pending November 4 research rather than duplicate pages for those unfinished subjects.
- 22 rows point to existing coverage. Different query wording is not sufficient grounds for a new same-intent page.
- 17 rows are excluded under the user's standing instruction to skip unclear searches.
- Gold queries are a new intent. A loose substring search initially found the unrelated Quaid-e-Azam Trophy Gold division; that false match was corrected before drafting.

## Completed local drafts

- SSGC: 2,104 body words. Official bill portal, payment options, complaint routes and historical FAQ reviewed. Historical FAQ tariff tables are not used as current prices.
- BISP: 2,187 body words. Official 8171, free survey and complaint guidance reviewed. No current instalment amount or eligibility guarantee invented. Illustrative education photographs explicitly state they are not BISP beneficiary/event photographs.
- Iqbal Day: 2,042 body words. Monday November 9, 2026 checked against official mission calendars and the Cabinet Division holiday listing. School and examination arrangements distinguished from the general holiday. An old 2024 holiday press release was excluded as evidence for 2026.

Each has 42 unique relevant tags, a 50-60 character branded SEO title, a 120-155 character description, a validated existing internal article link, sources at the end, and two globally distinct licensed WebP assets. Six images inspected together in artifacts/november5-daily/contact-sheet.png. No image generation used.

These are local drafts, not database inserts or live releases. Publication script retains the minimum ten-reviewed-articles gate. The next release targets Cloudflare Pages, not Firebase Hosting.

## Football research leads, not completed articles

- Fenerbahce 3-2 Liverpool, November 4: Liverpool official report records Nyoni 25, Greenwood 29, Isak 69, Brown 73 and Muriqi 79. Liverpool led twice. Confirm final league-table position separately before using one. Sources: https://lfcbeta.liverpoolfc.com/matches/mens-team/fenerbahce-v-liverpool-uefa-champions-league-20261104 and https://www.liverpoolfc.com/matches/mens-team/fenerbahce-v-liverpool-uefa-champions-league-20261104 . The second URL returned cached pre-match content during research; do not treat that stale variant as the final report.
- AEK 2-3 Real Madrid, November 4: Madrid official report confirms Bellingham, Mbappe and Valverde, a comeback from 2-1 in the 75th minute, and twelve points from four matches. https://www.realmadrid.com/es-ES/noticias/futbol/primer-equipo/cronicas/cronica-aek-atenas-real-madrid-champions-03-11-2026 . URL slug contains November 3, but the article itself is dated November 4. Supporting first-party substitution/scoring context: https://www.realmadrid.com/en-US/news/football/first-team/latest-news/declaraciones-jugador-post-aek-atenas-rm-04-11-2026 . Verify exact minutes against match centre before authoring a goal timeline.
- Slavia Prague 1-2 Arsenal, November 4, half-time 0-2: https://www.slavia.cz/eng/match/7150 . Arsenal official fixture confirmation: https://help.arsenal.com/support/solutions/articles/101000593887-champions-league-group-phase . The title says group phase; use the actual current competition terminology in copy.
- Leipzig versus City: first-party dated fixture https://www.mancity.com/news/mens/rb-leipzig-v-city-match-preview-63929049 . Do not turn a search excerpt from City's general results page mentioning a penalty shootout into this league-phase result. A full dated match report is still required.
- Dortmund versus Betis: distinguish senior fixture from the clubs' same-day U19 Youth League fixture. League-publisher match report: https://www.bundesliga.com/de/bundesliga/news/borussia-dortmund-real-betis-balompie-sevilla-spieltag-4-spielbericht-highlights-39884 . Still read the complete report and match centre before asserting a final score.
- West Indies versus Bangladesh: the current search concerns the second Test scheduled November 5, not a newly beginning first Test. Official series fixtures: https://www.windiescricket.com/fixtures/team_id/4/ . The first Test was scheduled October 28-November 1: https://www.bssnews.net/sports/422419 . Do not publish a live score from a stale search excerpt.
- Lens versus Como, Porto versus Napoli and the remaining non-sport intents still need source research. A topic appearing in the CSV does not validate a score, death, product launch, election result or current price.

## Release checks still required

First batch now contains ten complete reviewed drafts, 20,692 body words, 42 distinct tags each and twenty globally distinct licensed images. Local content checks passed. Database insert/read-back and Cloudflare live verification are still required before marking the batch published. No claims of guaranteed indexing, rankings or clicks.
