"""Prepare two sourced local articles without publication operations."""
import runpy
from pathlib import Path

ROOT = Path(__file__).resolve().parent
module = runpy.run_path(str(ROOT / 'prepare-first-batch.py'))
ENTRIES = [
    {
        'key': 'fatima-sana',
        'title': 'Fatima Sana: Pakistan Career, Emerging Award and Captaincy Explained',
        'seoTitle': 'Fatima Sana - Career and Captaincy | RayTech Institute',
        'slug': 'fatima-sana-pakistan-career-award-captaincy',
        'description': 'Explore Fatima Sana’s Pakistan debut, 2021 ICC emerging award and dated captaincy news, with clear explanations of bowling figures and all-round roles.',
        'tags': 'Fatima Sana|Pakistan women cricket|May 2019 international debut|South Africa debut tour|ICC emerging player 2021|January 2022 award announcement|PCB emerging recognition|2021 award year|24 wickets award sample|165 runs award sample|16 international appearances|Caribbean 2021 tour|five for thirty nine|unbeaten twenty eight|5 for 39 notation|bowling figures|wickets versus runs|all round contribution|lower order batting|batting opportunity|not out notation|ODI captaincy|dated captaincy appointment|Sri Lanka series squads|July 2026 announcement|Muneeba Ali captaincy context|format specific captain|bowling captain decisions|new ball options|field placement context|workload decisions|women versus men records|international versus domestic|award year versus calendar year|historical team photographs|Pakistan cricket development|primary PCB announcements|ICC award report|current form distinction|no invented private quotes|scorecard category checks|career milestone timeline',
        'photos': [
            ('Pakistan Womens Cricket Team (1).jpg', 'Pakistan women’s cricket team at the 2009 World Cup in Sydney', 'Historical Pakistan team context from 2009, before Fatima Sana’s international debut. This is not a portrait of her or the current squad.'),
            ('Gaddafi stadium farrah 1.jpg', 'A historical view of Gaddafi Stadium in Lahore', 'Pakistan cricket venue context, not a Fatima Sana appearance or a photograph of a specific women’s international match.'),
        ],
        'limitations': ['ICC award-year statistics are historical, not current career totals.', 'Captaincy statements retain their format and series dates; no permanent replacement inferred.', 'PCB pages were search-indexed but direct access returned 403; ICC award text was readable.', 'Context images are not a player portrait and do not claim her presence.'],
    },
    {
        'key': 'gurnoor-brar',
        'title': 'Gurnoor Brar: New Zealand ODI Squad News, Gujarat Titans and Bowling Role',
        'seoTitle': 'Gurnoor Brar - ODI Squad and Bowling | RayTech Institute',
        'slug': 'gurnoor-brar-odi-squad-gujarat-titans-bowling',
        'description': 'Read Gurnoor Brar’s dated New Zealand ODI squad update and Gujarat Titans role, without confusing missing statistics, match appearances or player names.',
        'tags': 'Gurnoor Brar|Gurnoor Singh Brar|New Zealand ODI squad|31 October 2026 announcement|BCCI squad update|first three ODIs|fourth and fifth ODIs|Gujarat Titans bowler|Indian Punjab cricket|Punjab association identity|right arm fast medium|left handed batting|bowling style classification|Harpreet Brar distinction|squad versus playing eleven|toss team announcement|completed match scorecard|match appearance evidence|international debut verification|historical auction category|current status versus old record|2022 IPL auction document|2026 franchise squad document|missing statistics|dash versus zero|season filter|career versus season|franchise versus international|bowling economy example|legal ball conversion|six overs four balls|forty legal deliveries|wickets and conceded runs|new ball role evidence|middle innings role|late innings context|measured speed evidence|no salary speculation|no fabricated debut date|historical Mohali venue|dated official roster|player identity checks',
        'photos': [
            ('Maharaja Yadavindra Singh International Cricket Stadium.png', 'Maharaja Yadavindra Singh International Cricket Stadium in Indian Punjab', 'Indian Punjab cricket venue context, not a Gurnoor Brar portrait, a New Zealand tour venue or evidence of his appearance at the ground.'),
            ('PCA Stadium, Mohali 1.jpg', 'A second historical view of the cricket stadium in Mohali', 'Distinct venue photograph illustrating Indian Punjab cricket. It does not show Gurnoor or establish an appearance at this ground.'),
        ],
        'limitations': ['The 31 October squad advisory confirms selection, not a specific match appearance.', 'Franchise statistical dashes remain unavailable values, not zero career totals.', 'Historical uncapped labels and auction values are not carried forward as current status or salary.', 'Venue photographs are explicitly contextual; no unrelated athlete is presented as Gurnoor.'],
    },
]
module['ENTRIES'].clear()
module['ENTRIES'].extend(ENTRIES)
module['main']()
