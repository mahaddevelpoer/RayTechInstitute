import test from 'node:test';
import assert from 'node:assert/strict';

const host = process.env.FIRESTORE_EMULATOR_HOST;
if (!host || !/^(127\.0\.0\.1|localhost):\d{2,5}$/.test(host)) throw new Error('Run this test only against the local Firestore emulator.');
const project = 'demo-raytech-learning';
const database = `projects/${project}/databases/(default)`;
const base = `http://${host}/v1/${database}/documents`;
const topicPath = 'students/learner-a/learningProgress/variables@1';
function token(uid, provider = 'password') {
  const now = Math.floor(Date.now() / 1000);
  const encoded = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${encoded({ alg: 'none', typ: 'JWT' })}.${encoded({ sub: uid, user_id: uid, aud: project, iss: `https://securetoken.google.com/${project}`, iat: now, exp: now + 3600, auth_time: now, firebase: { sign_in_provider: provider } })}.`;
}
const owner = token('learner-a');
const other = token('learner-b');
async function request(path, credential, options = {}) {
  return fetch(path.startsWith('http:') ? path : `${base}/${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(credential ? { Authorization: `Bearer ${credential}` } : {}) }, signal: AbortSignal.timeout(10000) });
}
function fields(revision = 1) {
  return { topicId: { stringValue: 'variables' }, version: { integerValue: '1' }, revision: { integerValue: String(revision) }, payload: { stringValue: '{"schema":1}' } };
}
function save(data, credential = owner, path = topicPath, timestamp = true) {
  return request(`${base}:commit`, credential, { method: 'POST', body: JSON.stringify({ writes: [{ update: { name: `${database}/documents/${path}`, fields: data }, ...(timestamp ? { updateTransforms: [{ fieldPath: 'updatedAt', setToServerValue: 'REQUEST_TIME' }] } : {}) }] }) });
}

test('Firestore rules protect account checkpoints in the real emulator', async t => {
  const reset = await fetch(`http://${host}/emulator/v1/projects/${project}/databases/(default)/documents`, { method: 'DELETE' });
  assert.equal(reset.status, 200);
  await t.test('owner creates and reads a checkpoint using the server timestamp', async () => {
    const response = await save(fields()); assert.equal(response.status, 200, await response.text());
    assert.equal((await request(topicPath, owner)).status, 200);
  });
  await t.test('guests, anonymous identities and other users cannot read or modify it', async () => {
    for (const credential of [null, other, token('learner-a', 'anonymous')]) {
      assert.equal((await request(topicPath, credential)).status, 403);
      assert.equal((await save(fields(2), credential)).status, 403);
      assert.equal((await request(topicPath, credential, { method: 'DELETE' })).status, 403);
    }
  });
  await t.test('checkpoint enumeration and unrelated collections are denied', async () => {
    assert.equal((await request('students/learner-a/learningProgress', owner)).status, 403);
    assert.equal((await request('students/learner-a', owner)).status, 403);
    assert.equal((await request('admin/settings', owner)).status, 403);
  });
  await t.test('strict fields, payload bounds, document identity and revisions are enforced', async () => {
    for (const data of [
      fields(1), fields(3), { ...fields(2), extra: { booleanValue: true } },
      { ...fields(2), topicId: { stringValue: 'another-topic' } },
      { ...fields(2), version: { integerValue: '2' } },
      { ...fields(2), payload: { stringValue: 'x'.repeat(200001) } },
    ]) assert.equal((await save(data)).status, 403);
    assert.equal((await save(fields(2), owner, topicPath, false)).status, 403);
    assert.equal((await save(fields(1), owner, 'students/learner-a/learningProgress/wrong@1')).status, 403);
    assert.equal((await save(fields(2))).status, 200);
    assert.equal((await save(fields(2))).status, 403);
  });
  await t.test('only the owner can delete their checkpoint', async () => {
    assert.equal((await request(topicPath, other, { method: 'DELETE' })).status, 403);
    assert.equal((await request(topicPath, owner, { method: 'DELETE' })).status, 200);
    assert.equal((await request(topicPath, owner)).status, 404);
  });
});
