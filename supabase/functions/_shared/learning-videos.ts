export const LEARNING_CHANNEL_ID = 'UCvrHqZtn6MSx_OXJB1cm1OA';
export function learningYouTubeKey(read: (name: string) => string | undefined): string {
  return read('YOUTUBE_API_KEY')?.trim() || read('YOUTUBE-API')?.trim() || '';
}
async function youtube(path: string, params: Record<string, string>, key: string, fetcher: typeof fetch) {
  if (!key) throw new Error('YouTube selection requires the server YOUTUBE_API_KEY or YOUTUBE-API secret.');
  const query = new URLSearchParams({ ...params, key });
  const response = await fetcher(`https://www.googleapis.com/youtube/v3/${path}?${query}`, { signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error('YouTube is unavailable or its quota was reached. Existing attachments are unchanged.');
  const data = await response.json();
  if (!Array.isArray(data.items)) throw new Error('YouTube returned an invalid list.');
  return data;
}

export async function listLearningVideos(key: string, pageToken = '', fetcher: typeof fetch = fetch) {
  if (typeof pageToken !== 'string' || pageToken.length > 500) throw new Error('Invalid video page token.');
  const channel = await youtube('channels', { part: 'contentDetails', id: LEARNING_CHANNEL_ID }, key, fetcher);
  const playlistId = channel.items[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (typeof playlistId !== 'string') throw new Error('The RayTech upload playlist could not be found.');
  const page = await youtube('playlistItems', { part: 'snippet,contentDetails', playlistId, maxResults: '30', ...(pageToken ? { pageToken } : {}) }, key, fetcher);
  const videos = page.items.filter((item: any) => item.snippet?.videoOwnerChannelId === LEARNING_CHANNEL_ID && /^[a-zA-Z0-9_-]{11}$/.test(item.contentDetails?.videoId)).map((item: any) => ({ id: item.contentDetails.videoId as string, title: String(item.snippet.title || 'RayTech lesson'), publishedAt: String(item.contentDetails.videoPublishedAt || item.snippet.publishedAt || '') }));
  return { success: true, videos, nextPageToken: typeof page.nextPageToken === 'string' ? page.nextPageToken : '' };
}

export async function verifyLearningVideos(ids: string[], key: string, fetcher: typeof fetch = fetch) {
  if (!ids.length) return;
  if (ids.length > 20 || new Set(ids).size !== ids.length || ids.some(id => !/^[a-zA-Z0-9_-]{11}$/.test(id))) throw new Error('Choose up to 20 distinct RayTech videos.');
  const result = await youtube('videos', { part: 'snippet,status', id: ids.join(',') }, key, fetcher);
  if (result.items.length !== ids.length || result.items.some((item: any) => !ids.includes(item.id) || item.snippet?.channelId !== LEARNING_CHANNEL_ID || item.status?.embeddable !== true || item.status?.privacyStatus !== 'public')) throw new Error('Every attached video must be public, embeddable and owned by the RayTech channel.');
}
