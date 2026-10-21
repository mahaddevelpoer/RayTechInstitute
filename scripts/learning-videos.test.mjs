import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTypescript } from './load-typescript.mjs';
const { listLearningVideos, verifyLearningVideos, LEARNING_CHANNEL_ID, learningYouTubeKey } = await loadTypescript('supabase/functions/_shared/learning-videos.ts');

test('server YouTube key accepts the existing vault alias without using database credentials', () => {
  assert.equal(learningYouTubeKey(name => ({ YOUTUBE_API_KEY: ' canonical ', 'YOUTUBE-API': 'alias' })[name]), 'canonical');
  assert.equal(learningYouTubeKey(name => ({ YOUTUBE_API_KEY: ' ', 'YOUTUBE-API': ' alias ' })[name]), 'alias');
  const names = [];
  assert.equal(learningYouTubeKey(name => { names.push(name); return ({ SERVICE_ROLE_KEY: 'not-a-youtube-key' })[name]; }), '');
  assert.deepEqual(names, ['YOUTUBE_API_KEY', 'YOUTUBE-API']);
});
test('video picker uses the fixed channel uploads playlist and excludes other owners', async () => {
  const seen = [];
  const result = await listLearningVideos('private-key', 'next-page', async url => {
    const u = new URL(url); seen.push(u);
    if (u.pathname.endsWith('/channels')) return Response.json({ items: [{ contentDetails: { relatedPlaylists: { uploads: 'uploads-list' } } }] });
    return Response.json({ nextPageToken: 'more', items: [{ snippet: { title: 'Variables', videoOwnerChannelId: LEARNING_CHANNEL_ID }, contentDetails: { videoId: 'abcdefghijk' } }, { snippet: { title: 'Foreign', videoOwnerChannelId: 'other' }, contentDetails: { videoId: 'ABCDEFGHIJK' } }] });
  });
  assert.equal(seen[0].searchParams.get('id'), LEARNING_CHANNEL_ID);
  assert.equal(seen[1].searchParams.get('playlistId'), 'uploads-list');
  assert.equal(seen[1].searchParams.get('pageToken'), 'next-page');
  assert.equal(result.videos.length, 1); assert.equal(result.nextPageToken, 'more');
  assert.ok(!JSON.stringify(result).includes('private-key'));
});
test('publishing rejects missing, foreign, private and non-embeddable videos', async () => {
  const good = { id: 'abcdefghijk', snippet: { channelId: LEARNING_CHANNEL_ID }, status: { embeddable: true, privacyStatus: 'public' } };
  await verifyLearningVideos([good.id], 'key', async () => Response.json({ items: [good] }));
  for (const items of [[], [{ ...good, snippet: { channelId: 'other' } }], [{ ...good, status: { embeddable: false, privacyStatus: 'public' } }], [{ ...good, status: { embeddable: true, privacyStatus: 'private' } }]]) {
    await assert.rejects(verifyLearningVideos([good.id], 'key', async () => Response.json({ items })));
  }
  await assert.rejects(verifyLearningVideos([good.id, good.id], 'key'), /distinct/);
});
test('missing YouTube configuration and upstream errors fail safely', async () => {
  await assert.rejects(listLearningVideos(''), /YOUTUBE_API_KEY/);
  await assert.rejects(listLearningVideos('key', '', async () => new Response('private detail', { status: 403 })), /unavailable/);
  await verifyLearningVideos([], '');
});
