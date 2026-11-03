"""Assemble reviewed local drafts. No production requests or publishing."""
import html
import json
import math
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
METADATA = REPO / 'artifacts/november-publish/batch-20261103-metadata.json'

ENTRIES = [
    {
        'key': 'over-rate',
        'title': 'Over Rate Explained: Why Pakistan Was Fined After the Final',
        'seoTitle': 'Over Rate - Pakistan Fine and Stop Clock | RayTech Institute',
        'slug': 'over-rate-pakistan-fine-stop-clock-explained',
        'description': "Pakistan's five-per-cent over-rate fine explained: what happened, how timing differs from run rate, and why the stop clock is a separate rule.",
        'tags': 'over rate|Pakistan over rate fine|Sri Lanka tri series final|Lahore ODI final|2 November 2026|match fee fine|five per cent penalty|one over short|time allowances|Jeff Crowe|Shaheen Shah Afridi|ICC Code of Conduct|Article 2.22|slow over rate|overs per hour|run rate difference|required run rate|bowling economy|legal deliveries|six ball over|overs notation|19.4 overs|decimal overs error|minutes to hours|adjusted playing time|medical time allowance|umpire reviews|fielding side timing|stop clock cricket|sixty second interval|between overs|Test stop clock|two warnings|five run penalty|financial sanction|winning team fined|match referee decision|match date versus release|playing conditions edition|official disciplinary report|penalty interpretation|cricket timing rules',
        'photos': [
            ('Cricket Umpires Equipment 1.jpg', 'Cricket umpiring equipment arranged for inspection', 'Umpiring-equipment illustration; not a photograph of the Pakistan tri-series sanction.'),
            ('Cricket Umpires ball counters.jpg', 'Mechanical ball counters used in cricket umpiring', 'Ball-counting equipment illustrates legal-delivery tracking; it is not the electronic stop clock.'),
        ],
        'limitations': ['The Pakistan sanction follows the dated ICC announcement. Worked timing calculations are original illustrations, not an official reconstruction.', 'Do not treat a historical stop-clock announcement as a complete rulebook for every format.'],
    },
    {
        'key': 'quaid-e-azam-trophy',
        'title': 'Quaid-e-Azam Trophy 2026-27: Gold, Silver, Teams and Schedule',
        'seoTitle': 'Quaid-e-Azam Trophy 2026-27 - Schedule | RayTech Institute',
        'slug': 'quaid-e-azam-trophy-2026-27-gold-silver-schedule',
        'description': 'Check the Quaid-e-Azam Trophy 2026-27 Gold and Silver structure, opening fixtures, finals, promotion route and the PCB-announced viewing options.',
        'tags': 'Quaid e Azam Trophy|Quaid-e-Azam Trophy 2026-27|QeAT Gold|QeAT Silver|Pakistan first class cricket|PCB domestic schedule|3 November 2026|Gold final December|Silver final December|Gold eight teams|Silver twelve teams|two tier structure|Silver promotion|Karachi Blues|Faisalabad regional team|FATA cricket|Lahore Whites|Islamabad regional team|Peshawar regional team|Multan regional team|Sialkot Blues|defending champions|Lahore Whites versus FATA|Diamond Cricket Ground|Babar Azam domestic cricket|Shaheen Shah Afridi FATA|Islamabad cricket fixtures|Abbottabad cricket|Rawalpindi cricket|Karachi Silver venues|tapmad cricket stream|Tamasha cricket stream|PCB roster announcement|first innings lead|second innings target|multi day scorecard|first class statistics|domestic cricket pathway|tier standings|regional team identity|schedule amendments|sixty ninth edition',
        'photos': [
            ('RWPCS3.jpg', 'Rawalpindi Cricket Stadium during PSL V in March 2020', 'Historical Rawalpindi cricket setting, not a photograph of a 2026 Quaid-e-Azam Trophy fixture.'),
            ('National Stadium Karachi.jpg', 'National Stadium in Karachi', 'Historical Karachi cricket setting, not an identification of a particular Silver fixture venue or a current match.'),
        ],
        'limitations': ['The later detailed PCB announcement takes precedence over the earlier season-calendar outline.', 'No live score, result, current table, subscription price or invented bonus-point rules.', 'Simple first-innings and target calculations are illustrative, not actual tournament scores.'],
    },
    {
        'key': 'pakhtakor-vs-al-nassr',
        'title': 'Pakhtakor vs Al-Nassr: 2-6 Result, Scorers and Standings Context',
        'seoTitle': 'Pakhtakor vs Al-Nassr - Result Guide | RayTech Institute',
        'slug': 'pakhtakor-al-nassr-2-6-result-standings-november-2026',
        'description': "Al-Nassr beat Pakhtakor 6-2 on 2 November 2026. See the scorers, Ronaldo's absence and the dated West Region standings after the Tashkent fixture.",
        'tags': 'Pakhtakor vs Al Nassr|Pakhtakor 2 Al Nassr 6|2 November 2026|AFC Champions League Elite|2026-27 West Region|Tashkent football|Pakhtakor Central Stadium|matchday four|Al Nassr standings|Pakhtakor standings|Al Nassr six points|Pakhtakor two points|dated table snapshot|Joao Felix brace|Abdullah Al Hamdan|Abdulelah Al Amri|Abdulrahman Ghareeb|Angelo goal|Flamarion goal|Dostonbek Khamdamov|Ronaldo absence|halftime 1-3|fulltime 2-6|goal timeline|four goal margin|eight total goals|goals for and against|league versus continental table|games in hand|Al Wasl postponed fixture|match status completed|home team score order|Asian club football|Saudi club away win|Uzbek club football|official AFC result|regional qualification context|scorer transliteration|first half advantage|second half scoring|football result verification|historical match report',
        'photos': [
            ('Pakhtakor Markaziy Stadium.jpg', 'Pakhtakor Markaziy Stadium in Tashkent in August 2012', 'Historical photograph of the reported venue, not the 2 November 2026 match.'),
            ('Pakhtakor Markaziy Stadium 4.jpg', 'Pakhtakor Central Stadium photographed in October 2026', 'Venue photograph dated 23 October 2026, before the reported Al-Nassr fixture.'),
        ],
        'limitations': ['Positions and points are the dated post-match report, not a live table.', 'No invented assists, possession, xG, player ratings, reasons for Ronaldo absence or qualification guarantee.'],
    },
    {
        'key': 'oman-vs-netherlands',
        'title': 'Oman vs Netherlands: Seven-Wicket Win and League 2 Standings Context',
        'seoTitle': 'Oman vs Netherlands - League 2 Result | RayTech Institute',
        'slug': 'oman-netherlands-2-november-2026-result-league-2',
        'description': 'Netherlands beat Oman by seven wickets in Dubai. Read the completed score, Ackermann’s figures and why League 2 standings differ from ODI rankings.',
        'tags': 'Oman vs Netherlands|Netherlands seven wicket win|2 November 2026|ICC CWC League 2|match 144|ICC Academy Dubai|Oman 182 all out|Netherlands 183 for 3|36 overs chase|49.2 overs notation|Colin Ackermann|four for twenty three|player of the match|Cedric de Lange 79|Zach Lion Cachet 68|Max O Dowd 29|Netherlands chose to field|League 2 standings|ODI rankings difference|World Cup qualification pathway|2027 Global Qualifier|October table snapshot|current standings source|completed scorecard|chasing target 183|seven wickets remaining|eighty four legal balls|fourteen overs unused|bowling economy 2.3|legal ball conversion|tournament net run rate|partnership versus innings|fifty over cricket|Dubai tri series|Oman ODI cricket|Netherlands ODI cricket|official ICC result|scheduled versus completed|scorecard timestamp|qualification versus finals|innings rate calculation|match identity',
        'photos': [
            ('Colin Ackermann.jpg', 'Colin Ackermann photographed in April 2025', 'Historical player photograph, not the November 2026 Oman match or its award presentation.'),
            ('Netherlands cricket team.jpg', 'Netherlands players celebrating a wicket against Canada in July 2010', 'Historical Netherlands team photograph from a different fixture in Rotterdam, not the Dubai match against Oman.'),
        ],
        'limitations': ['Readable current official standings unavailable; no live rank reconstructed from stale snapshots.', 'Only completed match facts reproduced; innings rate arithmetic is derived and is not tournament NRR.'],
    },
    {
        'key': 'cyber-attacks',
        'title': 'Cyber Attacks: A Practical Account and Device Safety Guide',
        'seoTitle': 'Cyber Attacks - Student Account Safety | RayTech Institute',
        'slug': 'cyber-attacks-student-account-device-safety',
        'description': 'Understand phishing, unique passwords, MFA, updates and recovery with practical student examples, trusted guidance and a manageable security routine.',
        'category': 'technology',
        'tags': 'cyber attacks|student online safety|Pakistan student cybersecurity|phishing messages|fake scholarship message|school account protection|email recovery|account inventory|independent verification|unexpected attachments|document permissions|unique passwords|password reuse risk|password manager|multifactor authentication|unexpected login prompt|one time code privacy|recovery codes|trusted update channel|supported software|end of life software|automatic updates|browser updates|backup recovery|file version history|cloud sync versus backup|shared lab computers|sign out sessions|private browsing limits|connected applications|app permissions|exposed password response|active session review|financial provider contact|school support reporting|incident evidence|outage versus attack|HTTPS identity limits|weekly security routine|FBI online safety|NIST phishing guidance|FTC text scam guidance',
        'photos': [
            ('Yubikey 4 (34434755012).jpg', 'Two YubiKey 4 hardware authentication devices', 'Historical hardware-authentication illustration, not a required purchase or a guarantee against every attack.'),
            ('Phishing1.png', 'Diagram illustrating phishing through misleading search results', 'Conceptual phishing diagram from 2020, not evidence of a current attack against a school or Pakistani service.'),
        ],
        'limitations': ['General defensive account and device guidance; no new breach or named attacker is alleged.', 'US agency reporting services are not presented as Pakistan reporting destinations.', 'Fictional school-message example; no passwords, executable examples or offensive instructions.'],
    },
    {
        'key': 'glenn-maxwell-retirement',
        'title': 'Glenn Maxwell Retirement: Australia Career Ends, BBL Continues',
        'seoTitle': 'Glenn Maxwell Retirement - BBL Continues | RayTech Institute',
        'slug': 'glenn-maxwell-retirement-international-bbl-2026',
        'description': "Glenn Maxwell's international retirement explained: separate the 2025 ODI decision, November T20I news and his continuing Melbourne Stars BBL role.",
        'tags': 'Glenn Maxwell retirement|Maxwell international retirement|November 2026 cricket|T20I retirement|ODI retirement June 2025|Australia cricket career|Melbourne Stars|BBL continues|2027-28 Stars contract|first class retirement|List A retirement|149 ODIs|130 T20Is|seven Tests|2897 T20I runs|five T20I centuries|2015 ODI World Cup|2023 ODI World Cup|2021 T20 World Cup|Cricket Australia announcement|ICC retirement report|format distinctions|international versus franchise|T20 versus T20I|earlier retirement discussions|dated career timeline|all rounder contribution|off spin bowling|fielding contribution|batting versatility|match appearances|innings versus dismissals|career statistics categories|batting average denominator|contract versus selection|confirmed squad checks|historical retirement headline|recycled sports news|franchise cricket records|national team farewell|no transfer speculation|primary cricket sources',
        'photos': [
            ('Glenn Maxwell.jpg', 'Glenn Maxwell photographed in October 2011', 'Historical player portrait, not a photograph from the 2026 retirement announcement.'),
            ('2018.02.03.22.38.28-Glenn Maxwell-0003 (25557926667) (cropped).jpg', 'Glenn Maxwell batting in an Australia versus New Zealand T20 in 2018', 'Historical international batting photograph, not a November 2026 match or a Melbourne Stars fixture.'),
        ],
        'limitations': ['Current status reviewed on 3 November 2026; earlier ODI and open T20I discussions remain separately dated.', 'Continuing contract is not a guaranteed starting-eleven appearance; no private motive, transfer or new role inferred.'],
    },
]


def clean(value):
    return html.unescape(re.sub('<[^>]+>', '', value)).strip()


def main():
    pages = json.loads(METADATA.read_text(encoding='utf8'))['query']['pages'].values()
    by_title = {p['title']: p for p in pages if p.get('imageinfo')}
    extra = REPO / 'artifacts/november-publish/batch-20261103-extra-metadata.json'
    if extra.exists():
        by_title.update({p['title']: p for p in json.loads(extra.read_text(encoding='utf8'))['query']['pages'].values() if p.get('imageinfo')})
    second = REPO / 'artifacts/november-publish/batch-20261103-second-metadata.json'
    if second.exists():
        by_title.update({p['title']: p for p in json.loads(second.read_text(encoding='utf8'))['query']['pages'].values() if p.get('imageinfo')})
    next_batch = REPO / 'artifacts/november-publish/batch-20261103-batch2-metadata.json'
    if next_batch.exists():
        by_title.update({p['title']: p for p in json.loads(next_batch.read_text(encoding='utf8'))['query']['pages'].values() if p.get('imageinfo')})
    used = set()
    for path in (REPO / 'content').rglob('images.json'):
        try:
            for item in json.loads(path.read_text(encoding='utf8')):
                if not isinstance(item, dict):
                    continue
                for image in [item, item.get('cover', {}), item.get('inline', {})]:
                    if image.get('sha1'):
                        used.add(image['sha1'])
        except (ValueError, TypeError):
            continue
    prepared = []
    for entry in ENTRIES:
        directory = ROOT / entry['key']
        text = (directory / 'article.md').read_text(encoding='utf8')
        words = len(text.split('## Sources')[0].split())
        tags = entry['tags'].split('|')
        assert words >= 2000, (entry['key'], words)
        assert len(tags) == len(set(t.lower() for t in tags)) == 42
        assert 50 <= len(entry['seoTitle']) <= 60, (entry['key'], len(entry['seoTitle']))
        assert 120 <= len(entry['description']) <= 155, (entry['key'], len(entry['description']))
        sources = re.findall(r'\]\((https?://[^)]+)\)', text.split('## Sources')[1])
        photos = []
        for role, (filename, alt, caption) in zip(['cover', 'inline'], entry['photos']):
            info = by_title['File:' + filename]['imageinfo'][0]
            meta = info['extmetadata']
            creator = clean(meta.get('Artist', {}).get('value', ''))
            licence = meta.get('LicenseShortName', {}).get('value', '')
            assert creator and re.search(r'CC BY|CC0|Public domain', licence)
            # A rerun may own its already prepared images; exclude just those.
            existing = directory / 'images.json'
            own = {i['sha1'] for i in json.loads(existing.read_text(encoding='utf8'))} if existing.exists() else set()
            assert info['sha1'] not in used - own, filename
            used.add(info['sha1'])
            photos.append(dict(role=role, fileTitle='File:' + filename, alt=alt, caption=caption,
                               url=info['url'], source=info['descriptionurl'], creator=creator,
                               license=licence, licenseUrl=(meta.get('LicenseUrl', {}).get('value') or info['descriptionurl']).replace('http://creativecommons.org/', 'https://creativecommons.org/'),
                               sha1=info['sha1'], width=info['width'], height=info['height'], reviewState='metadata-reviewed'))
        internal = re.findall(r'\[([^]]+)\]\((/[^)]+)\)', text)
        # Sources and descriptive internal links are already rendered in the body.
        # Keep their metadata available without adding duplicate footer sections.
        seo = dict(enabled=['title', 'description', 'socialTitle', 'socialDescription', 'imageAlt', 'imageCaption'],
                   title=entry['seoTitle'], description=entry['description'], socialTitle=entry['title'],
                   socialDescription=entry['description'], sources='\n'.join(sources),
                   internalLinks='\n'.join(url for _, url in internal), authorUrl='', socialImage='',
                   imageAlt=photos[0]['alt'], imageCaption=photos[0]['caption'])
        post = dict(id='trend-20261103-' + entry['key'], title=entry['title'], slug=entry['slug'],
                    category=entry.get('category', 'sports'), excerpt=entry['description'], content=text, featuredImage='',
                    author='RayTech Institute', datePublished='', readTime=f'{math.ceil(words / 220)} min read', tags=tags, seo=seo)
        editorial = {k: v for k, v in entry.items() if k not in ['tags', 'photos']}
        editorial.update(tags=tags, photos=photos, sources=sources, sourceChecked='2026-11-03')
        review = dict(state='sourced-draft-awaiting-image-verification', words=words, sourceChecked='2026-11-03',
                      sources=[dict(url=u) for u in sources], factualLimitations=entry['limitations'], published=False)
        for filename, data in [('editorial.json', editorial), ('post.json', post), ('review.json', review), ('images-candidates.json', photos)]:
            (directory / filename).write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf8')
        prepared.append(dict(key=entry['key'], words=words))
    print(json.dumps(prepared))


if __name__ == '__main__':
    main()
