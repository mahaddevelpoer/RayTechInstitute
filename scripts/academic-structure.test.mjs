import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { academicPlacement, academicGroups } = await loadTypescript('supabase/functions/_shared/academic-structure.ts');
const { writeEducationalContent } = await loadTypescript('supabase/functions/_shared/content-mutations.ts');
const { programSubjectChoices } = await loadTypescript('src/utils/academic-structure.ts');

test('program subjects open the earliest semester without duplicate subject cards', () => {
  const one={classSlug:'dit-one',title:'Computer Science',slug:'computing'};
  const two={classSlug:'dit-two',title:' computer  science ',slug:'computer-science'};
  const maths={classSlug:'dit-two',title:'Mathematics',slug:'maths'};
  const unrelated={classSlug:'bs',title:'Physics',slug:'physics'};
  assert.deepEqual(programSubjectChoices([{slug:'dit-one'},{slug:'dit-two'}],[two,unrelated,maths,one]),[one,maths]);
});

test('legacy classes require no invented program or semester', () => {
  assert.deepEqual(academicPlacement(undefined, null), {});
  assert.deepEqual(academicPlacement('', ''), {});
  const legacy = { id: 'dit', slug: 'dit-intermediate', isActive: true };
  assert.deepEqual(academicGroups([legacy]), { schoolClasses: [legacy], programs: [] });
});

test('program grouping preserves class identities, sorts semesters and excludes inactive rows', () => {
  const two = { id: 'two', slug: 'dit-second', programTitle: ' DIT ', semesterNumber: 2, isActive: true };
  const one = { id: 'one', slug: 'dit-first', programTitle: 'dit', semesterNumber: 1, isActive: true };
  const hidden = { ...one, id: 'hidden', isActive: false };
  const grouped = academicGroups([two, one, hidden]);
  assert.equal(grouped.programs.length, 1);
  assert.deepEqual(grouped.programs[0].semesters.map(c => c.slug), ['dit-first', 'dit-second']);
  assert.equal(grouped.programs[0].semesters[0], one);
});

test('partial and invalid academic placements are rejected', () => {
  assert.deepEqual(academicPlacement('  BS   Computer Science ', '4'), { programTitle: 'BS Computer Science', semesterNumber: 4 });
  for (const pair of [['DIT', null], ['', 2], ['DIT', 0], ['DIT', 17], ['DIT', 1.5], ['DIT', true], ['x'.repeat(101), 1]]) {
    assert.throws(() => academicPlacement(...pair));
  }
});

test('server rejects malformed placement before calling storage and normalizes valid writes', async () => {
  let calls = 0;
  const fetcher = async (_url, options) => {
    calls++;
    const record = JSON.parse(options.body);
    assert.equal(record.program_title, 'DIT');
    assert.equal(record.semester_number, 2);
    return new Response(JSON.stringify([record]), { status: 200 });
  };
  const record = { id: 'dit-sem2', program_title: 'DIT', semester_number: 0 };
  await assert.rejects(writeEducationalContent('https://example.com', 'test', { table: 'classes', operation: 'upsert', record }, fetcher));
  assert.equal(calls, 0);
  await writeEducationalContent('https://example.com', 'test', { table: 'classes', operation: 'upsert', record: { ...record, program_title: ' DIT ', semester_number: '2' } }, fetcher);
  assert.equal(calls, 1);
});

test('older admin payloads do not erase existing program placement', async () => {
  await writeEducationalContent('https://example.com', 'test', {
    table: 'classes', operation: 'upsert', record: { id: 'existing', title: 'Existing class' },
  }, async (_url, options) => {
    const record = JSON.parse(options.body);
    assert.equal('program_title' in record, false);
    assert.equal('semester_number' in record, false);
    return new Response(JSON.stringify([record]), { status: 200 });
  });
});
