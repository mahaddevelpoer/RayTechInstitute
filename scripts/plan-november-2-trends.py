"""Read the supplied CSV and record new intents without publishing content."""
import csv
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path('content/editorial-drafts')
SOURCE = Path(r'C:\Users\HP\Downloads\trending_PK_1d_20261102-0832.csv')
DEST = ROOT / 'trending-pk-20261102'


def norm(value):
    return re.sub(r'[^\w]+', ' ', unicodedata.normalize('NFKC', value).casefold()).strip()


old = json.loads((ROOT / 'trending-pk-20261101/plan.json').read_text(encoding='utf-8'))
known = {}
for group in old['groups']:
    for query in group['queries']:
        known[norm(query)] = {'batch': '2026-11-01', 'key': group['key'], 'state': group['state']}

# Reviewed equivalent queries. Broader incidental CSV keywords are not dedupe keys.
aliases = {
    'pakistan vs oman': 'oman-vs-pakistan',
    'india vs new zealand': 'india-national-cricket-team-vs-new-zealand-national-cricket-team-match-scorecard',
    'ind vs nz': 'india-national-cricket-team-vs-new-zealand-national-cricket-team-match-scorecard',
    'eng vs sa': 'england-vs-south-africa',
    'rockstar games gta vi': 'gta-6-release-date',
    'hong kong sixes 2026 winner': 'hong-kong-sixes-2026-final',
    'hong kong super sixes final': 'hong-kong-sixes-2026-final',
    'sri lanka pakistan cricket match': 'pakistan-sri-lanka',
}
for query, key in aliases.items():
    match = next(g for g in old['groups'] if g['key'] == key)
    known[norm(query)] = {'batch': '2026-11-01', 'key': key, 'state': match['state']}

october = {
    'daryl mitchell': 'daryl-mitchell', 'prince yadav': 'prince-yadav',
    'india': 'india', 'ireland vs namibia': 'ireland-vs-namibia',
    'zimbabwe vs afghanistan': 'afghanistan-vs-zimbabwe', 'srk': 'shah-rukh-khan',
}
for query, key in october.items():
    known[norm(query)] = {'batch': '2026-10-30', 'key': key, 'state': 'existing-article'}

same_intent = {
    'arsenal vs liverpool': 'liverpool-vs-arsenal',
    'mexico gp': 'f1-mexico-gp', 'f1': 'f1-mexico-gp',
    'real madrid match': 'racing-santander-vs-real-madrid',
    'madrid vs': 'racing-santander-vs-real-madrid',
}
rows = list(csv.DictReader(SOURCE.open(encoding='utf-8-sig', newline='')))
groups = {}
existing = []
for row in rows:
    query = row['Trends'].strip()
    normalized = norm(query)
    if normalized in known:
        existing.append({'query': query, **known[normalized]})
        continue
    key = same_intent.get(normalized) or re.sub(r'[^a-z0-9]+', '-', unicodedata.normalize('NFKD', query).encode('ascii', 'ignore').decode().lower()).strip('-')
    group = groups.setdefault(key, {'key': key, 'queries': [], 'keywords': [], 'state': 'queued', 'sourceRows': []})
    group['queries'].append(query)
    group['sourceRows'].append(row)
    for term in row['Trend breakdown'].split(','):
        term = term.strip()
        if term and term not in group['keywords']:
            group['keywords'].append(term)

plan = {
    'date': '2026-11-02', 'sourceFile': str(SOURCE), 'inputSearches': len(rows),
    'publicationAuthorized': True, 'published': 0, 'topicGroups': len(groups),
    'existingSearches': existing, 'groups': list(groups.values()),
    'workflow': 'Finish existing November 1 queue; then research, write, image-review and publish these new intents. No article exists merely because it is queued.',
    'keywordPolicy': 'CSV keywords are unverified search data, not facts. Use only relevant terms; never force unrelated breakdown keywords into copy.',
}
DEST.mkdir(exist_ok=True)
target = DEST / 'plan.json'
assert not target.exists(), 'Do not overwrite a running batch plan'
target.write_text(json.dumps(plan, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'inputSearches': len(rows), 'existingSearches': len(existing), 'newSearches': sum(len(g['queries']) for g in groups.values()), 'newTopicGroups': len(groups)}))
print('\n'.join(groups))
