"""Prepare only the next eight local drafts; no production operations."""
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parent
module = runpy.run_path(str(ROOT / 'prepare-first-batch.py'))
ENTRIES = [
    {
        'key': 'mohammad-amir',
        'title': 'Mohammad Amir: International Record, Retirement Timeline and Bowling Figures',
        'seoTitle': 'Mohammad Amir - Record and Retirement | RayTech Institute',
        'slug': 'mohammad-amir-record-retirement-bowling-figures',
        'description': "Read Mohammad Amir's international record and dated retirement statements, then understand bowling figures without mixing league and national-team totals.",
        'tags': 'Mohammad Amir|Pakistan left arm fast bowler|271 international wickets|36 Tests|61 ODIs|62 T20Is|159 international appearances|December 2024 retirement|December 2020 statement|PCB retirement timeline|2024 T20 World Cup context|international versus franchise|Champions Trophy 2017|3 for 16 bowling|wickets runs notation|bowling average|bowling economy|bowling strike rate|legal balls|overs notation|3.4 overs|twenty two legal balls|wickets per match|compatible record categories|new ball role|middle overs role|late innings role|left arm angle|swing versus angle|early wickets|bowling opportunity|extras scoring|charged runs|credited wickets|scorecard filters|season versus career|squad versus appearance|completed match figures|tournament best spell|Cricket West Indies statistics|PCB official records|no new comeback claim',
        'photos': [
            ('5 Amir.jpg', 'Mohammad Amir in a historical 2017 photograph', 'Player photograph from 2017, not a new retirement announcement or a November 2026 match.'),
            ('MOHAMMAD AMIR.jpg', 'Mohammad Amir during Pakistan training at the Sydney Cricket Ground in January 2010', 'Historical training photograph, not evidence of a current Pakistan call-up.'),
        ],
        'limitations': ['Retirement statements are explicitly dated; no unverified later comeback, current contract or new retirement inferred.', 'Career figures use the PCB international sample; original bowling calculations are fictional examples.'],
    },
    {
        'key': 'george-russell',
        'title': 'George Russell: Mercedes, the 2026 Points Snapshot and F1 Results Explained',
        'seoTitle': 'George Russell - Mercedes and F1 Points | RayTech Institute',
        'slug': 'george-russell-mercedes-2026-points-results',
        'description': 'Read George Russell’s dated Mercedes profile and 2026 points snapshot, with clear distinctions between Grands Prix, Sprints, poles and team totals.',
        'tags': 'George Russell|Mercedes Formula 1|car number 63|2026 F1 snapshot|250 season points|216 Grand Prix points|34 Sprint points|fourth season position|three Grand Prix wins|five Grand Prix poles|Kimi Antonelli teammate|2017 junior programme|2018 Formula 2 title|2022 Mercedes line up|2022 Sao Paulo win|driver standings|constructor standings|individual versus team points|Sprint points|Grand Prix points|pole versus win|qualifying classification|grid changes|fastest lap distinction|race classification|gap to leader|interval to next car|timing screen labels|pit stop cycles|DNF context|compatible teammate comparison|season versus career|practice versus race|official F1 profile|Mercedes driver profile|dated statistics|race opportunity|no invented telemetry|no bonus rule assumption|session identity|Pakistan time zone checks|no future race prediction',
        'photos': [
            ('KingsLeonSilverstne040724 (28 of 112) (53838006028) (cropped).jpg', 'George Russell at a Silverstone event in July 2024', 'Historical driver photograph, not a 2026 podium or evidence of the current points total.'),
            ('George Russell, Silverstone 2021 (51348564487).jpg', 'George Russell at Silverstone in 2021', 'Earlier career photograph, not the current Mercedes line-up or a 2026 race result.'),
        ],
        'limitations': ['Season figures are a 3 November 2026 official-profile snapshot, not a live table.', 'No private contract term, team motive, unseen strategy or unverified scoring rule inferred.'],
    },
    {
        'key': 'icc-cricket-world-cup',
        'title': 'ICC Cricket World Cup 2027: Dates, Hosts and the New Format Explained',
        'seoTitle': 'ICC Cricket World Cup 2027 - Format | RayTech Institute',
        'slug': 'icc-cricket-world-cup-2027-dates-hosts-format',
        'description': 'Understand the announced 2027 ODI World Cup dates, three host countries, Super Series and Super 7, and why older format documents show different totals.',
        'tags': 'ICC Cricket World Cup|2027 ODI World Cup|2 October 2027|21 November 2027|South Africa host|Zimbabwe host|Namibia host|fourteen teams|fifty seven matches|October 2026 announcement|preliminary Super Series|three team round robin|twelve team group stage|two groups of six|thirty group matches|Super 7|twenty one matches|semi finals|World Cup final|older fifty four match plan|Super Six distinction|schedule version check|round robin pair counting|team appearances|one meeting per pairing|qualifier versus finals|intermediate qualification|host status distinction|seeded position|conditional fixture|knockout versus league|planned versus completed match|current official schedule|Pakistan viewing time|time zone labels|ticket offer verification|travel requirement distinction|no invented qualifier|no guaranteed team progression|dated tournament guide|ODI versus T20 World Cup|competition stage arithmetic',
        'photos': [
            ('Newlands Cricket Ground.jpg', 'Newlands Cricket Ground in Cape Town, South Africa', 'Historical South African cricket-venue illustration, not a 2027 match or a guarantee of a specific team appearance.'),
            ('Windhoek aerial.jpg', 'A historical aerial view of central Windhoek in Namibia', 'Host-country geographical context, not a stadium map, a current city survey or a live tournament photograph.'),
        ],
        'limitations': ['Follows the later 1 October 2026 ICC announcement rather than older planning assumptions.', 'No invented qualifier, future result, live progress count, ticket availability or travel entitlement.', 'Pairing arithmetic explains the announced structure; it is not an extra fixture announcement.'],
    },
    {
        'key': 'islamabad-traffic-police',
        'title': 'Islamabad Traffic Police: Online Licensing, Renewal and Service Checks',
        'seoTitle': 'Islamabad Traffic Police - Licence Help | RayTech Institute',
        'slug': 'islamabad-traffic-police-online-licence-services',
        'description': 'Find the official Islamabad licensing route, distinguish learner, renewal and duplicate services, and avoid outdated fees and unsafe document requests.',
        'category': 'world-affairs',
        'tags': 'Islamabad Traffic Police|ITP licensing|Islamabad DLIMS|learner permit|driving licence renewal|duplicate driving licence|licence verification|traffic challan service|official appointment guidance|18 October 2026 facility|courier delivery announcement|correct issuing authority|Punjab licensing distinction|Motorway Police distinction|vehicle category|current eligibility|official document requirements|existing record check|lost licence privacy|damaged card replacement|outdated fee screenshot|current payment instructions|official receipt|payment reference|application status|issued versus delivered|current office location|assessment versus application|online portal timeout|no transaction test|CNIC privacy|verification code safety|licence card redaction|trusted support route|application reference|no private payment transfer|official traffic division|APP service announcement|no guaranteed delivery time|no universal fee|record correction distinction|public service navigation',
        'photos': [
            ('Islamabad Traffic Police Toyota Prius 2016.jpg', 'An Islamabad Traffic Police Toyota Prius on a city street', 'Historical traffic-police vehicle photograph, not evidence of a new licensing policy or a successful application.'),
            ('Islamabad Highway.jpg', 'A view along Islamabad Highway', 'Historical road-context photograph, not a live traffic report, closure notice or driving-test route.'),
        ],
        'limitations': ['Portal retrieval timed out; no application submitted, fee paid or end-to-end success claimed.', 'No old fee, personal payment destination, universal eligibility rule or guaranteed delivery time.', 'Exact requirements remain with the responsible authority; no individual legal determination.'],
    },
    {
        'key': 'resident-evil-2026',
        'title': 'Resident Evil 2026: Film Identity, Story Setup and Viewing Checks',
        'seoTitle': 'Resident Evil 2026 - Film Viewing Guide | RayTech Institute',
        'slug': 'resident-evil-2026-film-cast-story-viewing',
        'description': 'Identify the 2026 Resident Evil film, its director and confirmed premise, then check viewing offers without confusing older films or regional availability.',
        'category': 'entertainment',
        'tags': 'Resident Evil 2026|Zach Cregger director|Austin Abrams Bryan|medical courier premise|Sony Pictures film page|Constantin Film credits|Shay Hatten writer|Paul Walter Hauser cast|Zach Cherry cast|Kali Reiss cast|Johnno Wilson cast|18 September 2026 release listing|home viewing options|Pakistan availability checks|rental versus subscription|authorised film services|stale coming soon label|film versus game|franchise project identity|spoiler light guide|original story description|cast versus character credit|no invented ending|no firsthand review claim|game to film adaptation|interactive versus linear medium|limited viewpoint|information and suspense|spatial orientation|shot framing|sound beyond frame|silence and attention|resource limits in storytelling|specific viewing observations|opinion versus production fact|regional classification|age rating verification|no local rating invented|historical actor photograph|cinema equipment illustration|no streaming transaction test|no reconstructed screenplay',
        'photos': [
            ('Austin Abrams-60123.jpg', 'Actor Austin Abrams at the 81st Venice International Film Festival', 'Historical actor photograph, not a Resident Evil scene or its 2026 premiere.'),
            ('Film projector and piano Ulucanlar Prison Museum Ankara 2025.jpg', 'A historical film projector and piano displayed in a museum in Ankara', 'Cinema-history illustration, not equipment from the Resident Evil production or a film still.'),
        ],
        'limitations': ['Spoiler-light researched guide, not a personal screening review or a plot reconstruction.', 'Home-viewing destinations do not establish Pakistan subscription inclusion or a tested transaction.', 'Stale production-page label is disclosed; no new postponement, local rating or uncredited role invented.'],
    },
    {
        'key': 'wbbl',
        'title': 'WBBL 2026: Season Dates, Next Fixtures and the Early Points Table',
        'seoTitle': 'WBBL 2026 - Fixtures and Standings | RayTech Institute',
        'slug': 'wbbl-2026-fixtures-season-points-table-guide',
        'description': 'Follow WBBL 2026 with dated fixtures, venue checks and a clear early-table explanation, while keeping women’s records and broadcast regions distinct.',
        'tags': 'WBBL 2026|WBBL12|Womens Big Bash League|29 October season start|5 December season end|Sydney Sixers Women|Perth Scorchers Women|Sydney Thunder Women|Adelaide Strikers Women|Melbourne Stars Women|Brisbane Heat Women|Hobart Hurricanes Women|Melbourne Renegades Women|Ninja Stadium Hobart|Drummoyne Oval Sydney|Junction Oval Melbourne|4 November fixture|5 November fixture|6 November fixture|early four point teams|net run rate ordering|matches played context|games in hand|women versus men records|T20 domestic cricket|squad versus playing eleven|legal ball notation|18.3 overs|111 legal balls|runs versus wickets margin|table timestamp|official match centre|Australian time zone labels|Pakistan stream verification|authorised broadcast offer|no universal free stream|completed versus upcoming|club city versus venue|season versus last match|qualification rules check|no live table claim|Cricket Australia season source',
        'photos': [
            ('2017–18 W Ashes A v E Test 17-11-09 Perry portrait (02).jpg', 'Ellyse Perry during the 2017-18 Women’s Ashes Test at North Sydney Oval', 'Historical women’s cricket photograph from a different competition, not WBBL 2026 action or a current team-selection claim.'),
            ('Junction Oval Shane Warne stand 20251017.jpg', 'The Shane Warne stand at Junction Oval in October 2025', 'Historical venue photograph, not a 2026 WBBL fixture or a live ground-conditions report.'),
        ],
        'limitations': ['Fixtures and early standings are the official page snapshot reviewed on 3 November 2026.', 'No current finals qualification, invented NRR reconstruction or Pakistan broadcast entitlement.', 'Scoring examples are original illustrations, not additional WBBL results.'],
    },
    {
        'key': 'auqib-nabi',
        'title': 'Auqib Nabi: New Zealand ODI Squad Update and His Red-Ball Background',
        'seoTitle': 'Auqib Nabi - New Zealand ODI Squad | RayTech Institute',
        'slug': 'auqib-nabi-new-zealand-odi-squad-update-2026',
        'description': 'Read Auqib Nabi’s confirmed New Zealand ODI squad update and Surrey background, with clear distinctions between selection, a debut and actual appearances.',
        'tags': 'Auqib Nabi|31 October 2026 BCCI update|New Zealand ODI series|first three ODIs squad|fourth and fifth ODI inclusion|right arm pacer|Jammu Kashmir cricket|Surrey September signing|three county fixtures|Yorkshire fixture|Sussex fixture|Glamorgan fixture|Ranji Trophy campaign|sixty red ball wickets|domestic versus international|squad versus appearance|debut category|India A distinction|first class cricket|County Championship|ODI role context|bowling opportunity|bowling average|bowling strike rate|legal balls per wicket|runs per wicket|rounded average limits|missing original inputs|bowling angle versus swing|no invented speed|no guaranteed playing eleven|official team sheet|predicted eleven distinction|completed bowling figures|current squad date|no private selection motive|format transition|compatible performance sample|venue and phase context|BCCI advisory|Surrey club announcement|no future wicket prediction',
        'photos': [
            ('Auqib Nabi bowling in a Ranji Trophy 2024-25 match against Meghalaya in Shillong.jpg', 'Auqib Nabi bowling in a Ranji Trophy match against Meghalaya in Shillong in 2024', 'Historical domestic bowling photograph, not his New Zealand ODI debut or evidence of a later match appearance.'),
            ('The Kia Oval - geograph.org.uk - 4645561.jpg', 'A historical view of the Kia Oval cricket ground', 'County-cricket venue context, not a photograph of Nabi playing one of the announced Surrey fixtures.'),
        ],
        'limitations': ['Squad update is not an appearance, debut or guaranteed starting-eleven decision.', 'Surrey announcement covers three fixtures, not an inferred whole-season contract.', 'No exact runs reconstructed from a rounded average or unpublished career inputs.'],
    },
    {
        'key': 'rohit-sharma',
        'title': 'Rohit Sharma: ODI Status, Retirement Formats and Batting Milestones',
        'seoTitle': 'Rohit Sharma - ODI Status and Records | RayTech Institute',
        'slug': 'rohit-sharma-odi-status-retirement-career-records',
        'description': 'Separate Rohit Sharma’s ODI selection from his Test and T20I retirements, then read the 264 innings and 2019 World Cup milestones in their proper context.',
        'tags': 'Rohit Sharma|ODI status|31 October 2026 squad|New Zealand ODI selection|T20I retirement June 2024|Test retirement May 2025|format specific retirement|264 against Sri Lanka|13 November 2014|2019 World Cup five centuries|historical innings record|tournament versus career|opening batter role|innings phases|batting average|batting strike rate|dismissals denominator|balls faced denominator|not out status|boundary contribution|singles and twos|score breakdown limits|opening partnership|individual score versus stand|captaincy versus selection|historical captain label|IPL versus ODI records|national versus franchise|World Cup selection distinction|related news identity|Virat Kohli headline distinction|no invented final World Cup claim|current squad versus eleven|recent form sample|one innings versus season|observed versus inferred plan|no private motivation claim|no live career counter|ICC retirement sources|BCCI squad source|historical batting milestones|dated cricket profile',
        'photos': [
            ('Rohit Sharma Batting.jpg', 'Rohit Sharma batting for India against the UAE at the WACA Ground during the 2015 World Cup', 'Historical ODI photograph, not the 2014 score of 264 or a November 2026 appearance.'),
            ('Rohit Sharma bowling 2014.jpg', 'Rohit Sharma celebrating Gary Ballance’s dismissal during the 2014 Southampton Test', 'Historical Test-match photograph, not a current match, an ODI innings or a new retirement announcement.'),
        ],
        'limitations': ['Test, T20I and ODI statuses remain separate and dated; no unverified ODI retirement inferred.', 'The linked last-World-Cup story was about Virat Kohli, not Rohit.', 'Historical achievements are not live career counters or guaranteed future tournament selection.'],
    },
]

module['ENTRIES'].clear()
module['ENTRIES'].extend(ENTRIES)
module['main']()
