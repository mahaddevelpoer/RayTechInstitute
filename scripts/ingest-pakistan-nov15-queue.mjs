import fs from 'node:fs';
import assert from 'node:assert/strict';
import { parseCsvRecords } from './editorial-csv.mjs';

const root = 'content/editorial-drafts/trending-pk-20261115-daily';
const { headers, records } = parseCsvRecords(fs.readFileSync(root + '/input.csv', 'utf8'));
const expected = ['Trends', 'Search volume', 'Started', 'Ended', 'Trend breakdown', 'Explore link'];
assert.deepEqual(headers, expected);
const rows = records.map((record, index) => ({
  row: index + 1,
  query: record.Trends,
  searchVolume: record['Search volume'],
  started: record.Started,
  ended: record.Ended,
  breakdown: record['Trend breakdown'] ? record['Trend breakdown'].split(',') : [],
  exploreLink: record['Explore link'],
}));
assert.equal(new Set(rows.map(r => r.query)).size, rows.length, 'Duplicate trend rows need separate grouping');
fs.writeFileSync(root + '/all-rows.json', JSON.stringify(rows, null, 2) + '\n');
console.log(JSON.stringify({ headers, rows: rows.length }));
