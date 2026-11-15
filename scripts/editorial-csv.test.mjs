import test from 'node:test';
import assert from 'node:assert/strict';
import { parseCsv, parseCsvRecords } from './editorial-csv.mjs';

test('quoted fields keep embedded commas, quotes and newlines', () => {
  const rows = parseCsv('\uFEFF"a","b,c"\r\n"say ""hi""","line\nbreak"\n');
  assert.deepEqual(rows, [['a', 'b,c'], ['say "hi"', 'line\nbreak']]);
});

test('records map to headers and reject ragged rows', () => {
  const { headers, records } = parseCsvRecords('Trends,Search volume\r\n"pak vs ind u19","500k+"\r\n');
  assert.deepEqual(headers, ['Trends', 'Search volume']);
  assert.equal(records.length, 1);
  assert.equal(records[0].Trends, 'pak vs ind u19');
  assert.throws(() => parseCsvRecords('a,b\r\none\n'), /fields/);
});

test('blank lines are ignored but empty fields are kept', () => {
  const rows = parseCsv('\n"x","","z"\n\n');
  assert.deepEqual(rows, [['x', '', 'z']]);
});
