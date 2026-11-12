# Batch 2 research and draft progress

The user requested the next complete ten-article release. All ten drafts are now written, visually reviewed and locally verified in batch-02-validation.json: 20,213 body words, twenty distinct licensed images and 420 tags. Production publication and hosting verification are separate steps; consult STATUS.md for their current outcome. The five-draft section below records the earlier checkpoint, not the current release size.

## Locally verified drafts

| Topic | Body words before Sources | Images | Distinct tags |
| --- | ---: | ---: | ---: |
| Lisa Su | 2053 | 2 | 42 |
| NYSE opening hours | 2016 | 2 | 42 |
| US Supreme Court guide | 2040 | 2 | 42 |
| Social Security 2032 | 2001 | 2 | 42 |
| The Mandalorian and Grogu | 2015 | 2 | 42 |

Evidence: `batch-02-progress-validation.json`. Total: 10,125 body words, ten unique licensed images and 210 tags. Images were visually inspected in `artifacts/us-nov12/batch02-first-five-review.png`. Original paragraphs remain in each `article.md`; `post.json` additionally includes one inline image and end credits. No external writing helper or subagent was used.

## Research notes for the final five drafts, now completed

### Rex Ryan

Primary: https://www.nashville.gov/departments/police/news/former-nfl-coach-surrendered-booking-morning

Dated 11 November 2026. Police say Ryan surrendered on six misdemeanor warrants concerning an alleged pedestrian collision the previous Thursday at 4th Avenue and Broadway. Two counts each of leaving the scene, failing to give information/render aid, and failing to obey a traffic-control signal; judicial commissioner set bond at $6,000. Attribute allegations to police; no conviction or unverified subsequent court outcome. Keep the incident account concise and do not expose pedestrian identities.

Career primary: https://www.newyorkjets.com/news/r-e-x-p-e-c-t-ryan-takes-jets-reins-2514816

The 19 January 2009 announcement is historical, not a new coaching appointment. Other reliable sources: https://apnews.com/article/1aca238187d338e2b1d9fce1aee7779e and https://www.pro-football-reference.com/coaches/RyanRe0.htm . Distinguish season record and postseason results. Do not invent legal advice to extend the story.

Wrong automated dinosaur candidate was replaced with an actual Rex Ryan archive portrait. The final portrait and Nashville street image passed visual review and have archive captions.

### Celtics versus Raptors

Official result: Boston 98, Toronto 93 on 11 November 2026.

https://www.nba.com/celtics/news/game-recap-keys-20261111-bostor

https://statsdmz.nba.com/pdfs/20261111/20261111_BOSTOR.pdf

https://www.landofbasketball.com/box_scores/2026/1111BOSTOR.htm

The NBA prose pages carry a small source allowance. The official scorer record was additionally verified through indexed records, including Tatum's 24 points and the completed quarter totals. The article uses original calculations rather than copying a recap. No full-video viewing is claimed. Jayson Tatum's Olympic archive photo and the older Toronto game photograph passed visual review and explicitly do not depict this fixture.

### Ayesha Curry

https://abc7news.com/post/ayesha-curry-star-holiday-rom-second-chance-premiering-roku/19987567/

ESPN staff report dated 28 October 2026: Second Chance Holiday premieres 5 November on The Roku Channel, with Curry and Matthew Daddario. Ayesha plays Chelsey. This is a leading role, not her first-ever screen appearance.

https://www.broadwayworld.com/bwwtv/article/THE-HOLIDAY-SPARK-and-SECOND-CHANCE-HOLIDAY-to-Stream-on-The-Roku-Channel-20261102

Film directed by Maxwell McGuire and written by Erin Muroski; verify details before using. Dated reporting of Stephen Curry's public support: https://sports.yahoo.com/articles/even-ignorance-behind-acting-works-012356336.html . Keep the onscreen role separate from private conduct. No marriage speculation or insults. The guessed Roku newsroom URL from earlier research was not established and must not be cited as a verified page.

Ayesha's premiere portrait passed visual inspection. An unrelated actress candidate and a visually unclear equipment candidate were rejected. The final inline image is a clearly identifiable Arriflex film camera, explicitly illustrative rather than attributed to this film's production.

### Nuggets versus Grizzlies

Official result: Denver 123, Memphis 118 on 11 November 2026.

https://www.nba.com/nuggets/news/nuggets-defeat-grizzlies-on-wednesday

https://www.espn.com/nba/game/_/gameId/401909970/nuggets-grizzlies

https://www.espn.com/nba/recap?gameId=401909970

Independent completed records from Land of Basketball and FantasyData additionally support the result, quarter totals and Denver shooting line. The article provides original labelled arithmetic and no injury or gambling claims. The Jamal Murray free-throw photograph and archive FedExForum image passed visual review.

### Isabelle Huppert

https://www.festival-cannes.com/en/p/isabelle-huppert/

Official listing includes Histoires paralleles in 2026 Competition, La Femme la plus riche du monde out of competition in 2025, Best Actress for The Piano Teacher in 2001, jury presidency in 2009 and jury membership in 1984. Confirm film-specific facts at the linked film records before expanding. Do not turn a 2025 premiere into a new 2026 premiere.

https://www.unifrance.org/annuaires/personne/18828/isabelle-huppert

https://www.luxfilmfest.lu/invites/isabelle-hupert/

No death, new award or specific cause for current search interest has been verified. The completed article is a public-work profile with original performance-study exercises, not an invented event report. Both archive portraits passed visual review and carry archive captions.

## Resume checks and release

Keep the first ten published articles and prior PK queue unchanged. Baseline is 521 published records in `artifacts/us-nov12/published-index-batch-2.json`. The full validator with `--batch-number=2` has passed. Perform publication dry run and readback, then dispatch one release. Verify exact live revision, metadata, images, sitemap and listing before recording published status. Do not mistake the historical partial progress report for the full validator's batch-02-validation.json.

The local full-record snapshot hit the original helper's 20-second timeout at 500 records per page. A one-record authenticated request succeeded. A local-only copy of the publication helper reduces the snapshot page size to 50 while retaining complete pagination, exact insert checks, full readback and preservation comparisons. No production API, timeout policy or public website feature was changed for this workaround.

## Completed release

All ten articles were saved and read back with 521 existing records preserved. Deployment 43264312677 succeeded for source d2f084a31b6c8e85be9f47fbb4278e8c6dd7f806. Exact-revision live checks passed for all twenty US articles, including both image files, metadata, listing and sitemap. Batch-specific proof is recorded alongside this file.
