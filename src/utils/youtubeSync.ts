import { Lecture } from '@/types';
import { lecturesData } from '@/data/lectures';

const CACHE_KEY = 'raytech_youtube_lectures_cache_v3';
const CACHE_TIME_KEY = 'raytech_youtube_lectures_last_sync_v3';

export const YOUTUBE_CHANNEL_ID = 'UCvrHqZtn6MSx_OXJB1cm1OA';
export const YOUTUBE_UPLOADS_PLAYLIST_ID = 'UUvrHqZtn6MSx_OXJB1cm1OA';

/**
 * Parses ISO 8601 duration (e.g. PT10M26S, PT1H2M3S) into clean human-readable format (10m 26s).
 */
export function formatDuration(pt?: string): string {
  if (!pt) return 'Duration unavailable';
  const m = pt.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return pt;
  const hours = parseInt(m[1] || '0', 10);
  const minutes = parseInt(m[2] || '0', 10);
  const seconds = parseInt(m[3] || '0', 10);
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  }
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
}

/**
 * Extracts Chapter and Lecture numbering from title & description.
 */
export function extractChapterAndLecture(title: string, desc: string): { chapter: string; lectureNo: string } {
  let chapter = 'Core Curriculum';
  let lectureNo = 'Lecture';

  const chMatch = title.match(/Ch(?:apter)?\s*#?\s*(\d+)/i) || desc.match(/Chapter\s*#?\s*(\d+)/i);
  if (chMatch) {
    chapter = `Chapter ${chMatch[1].padStart(2, '0')}`;
  } else if (/Tutorial\s*#?\s*(\d+)/i.test(title)) {
    chapter = 'Tutorial Series';
  } else if (/Setup|Install|Config/i.test(title)) {
    chapter = 'Environment Setup';
  }

  const lecMatch = title.match(/Lec(?:ture)?\s*#?\s*(\d+)/i) || desc.match(/Lecture\s*#?\s*(\d+)/i);
  if (lecMatch) {
    lectureNo = `Lecture ${lecMatch[1].padStart(2, '0')}`;
  } else if (/part\s*#?\s*(\d+)/i.test(title)) {
    const pMatch = title.match(/part\s*#?\s*(\d+)/i);
    lectureNo = `Part ${pMatch ? pMatch[1].padStart(2, '0') : '01'}`;
  } else if (/Tutorial\s*#?\s*(\d+)/i.test(title)) {
    const tMatch = title.match(/Tutorial\s*#?\s*(\d+)/i);
    lectureNo = `Tutorial ${tMatch ? tMatch[1].padStart(2, '0') : '01'}`;
  } else if (/Setup|Guide/i.test(title)) {
    lectureNo = 'Setup Guide';
  }

  return { chapter, lectureNo };
}

/**
 * Extracts pedagogical key concepts from video description bullet points.
 */
export function extractKeyConcepts(desc: string, title: string): string[] {
  const concepts: string[] = [];
  const lines = desc.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (/^[-•*]\s+/.test(trimmed)) {
      const clean = trimmed.replace(/^[-•*]\s+/, '').trim();
      if (clean.length > 3 && clean.length < 90 && !clean.includes('http') && !clean.startsWith('#')) {
        concepts.push(clean);
      }
    }
  }

  if (concepts.length >= 2) {
    return concepts.slice(0, 5);
  }

  // Fallback concepts synthesized from title keywords
  const titleConcepts: string[] = [];
  const parts = title.split(/[|–-]/).map((p) => p.trim());
  parts.forEach((p) => {
    if (p.length > 4 && !p.toLowerCase().includes('raytech') && !titleConcepts.includes(p)) {
      titleConcepts.push(p);
    }
  });

  return titleConcepts.length > 0 ? titleConcepts.slice(0, 4) : [
    'Direct video release from RayTech Institute YouTube channel',
    'Practical code demonstration and pedagogical breakdown'
  ];
}

/**
 * Intelligent categorization based on title, description, and creator tags.
 */
export function classifyLecture(
  title: string,
  desc: string,
  apiTags: string[] = []
): {
  category: "Computer Science" | "Programming" | "Web" | "Development Tools";
  subCategory: string;
  tags: string[];
} {
  const combined = `${title.toLowerCase()} ${desc.toLowerCase()}`;
  const tagsSet = new Set<string>();

  apiTags.forEach((t) => {
    if (t.length > 2 && t.length < 35 && !t.includes('http')) {
      const cleanTag = t
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
      tagsSet.add(cleanTag);
    }
  });

  let category: "Computer Science" | "Programming" | "Web" | "Development Tools" = "Computer Science";
  let subCategory = "Computer Science Theory";

  if (combined.includes('python')) {
    category = "Programming";
    subCategory = "Python";
    tagsSet.add("Python");
    tagsSet.add("Programming");
  } else if (combined.includes('c++') || combined.includes('c programming')) {
    category = "Programming";
    subCategory = "C / C++";
    tagsSet.add("C / C++");
    tagsSet.add("Programming");
  } else if (combined.includes('html') || combined.includes('web markup') || combined.includes('elements| attributes')) {
    category = "Web";
    subCategory = "HTML & Standards";
    tagsSet.add("Web");
    tagsSet.add("HTML");
  } else if (combined.includes('clion') || combined.includes('vs code') || combined.includes('visual studio code')) {
    category = "Development Tools";
    subCategory = "Development Environments";
    tagsSet.add("Tools");
    tagsSet.add("VS Code");
  } else if (combined.includes('pairing scheme') || combined.includes('paper scheme') || combined.includes('board exam')) {
    category = "Computer Science";
    subCategory = "Board Schemes & Papers";
    tagsSet.add("Examination");
    tagsSet.add("Board Scheme");
    tagsSet.add("Computer Science");
  } else if (combined.includes('sdlc') || combined.includes('software development') || combined.includes('logic gates')) {
    category = "Computer Science";
    subCategory = "Theory & Architecture";
    tagsSet.add("Computer Science");
  }

  // Cross-cutting academic tags
  if (combined.includes('11th') || combined.includes('1st year') || combined.includes('first year') || combined.includes('class 11')) {
    tagsSet.add("11th Computer");
    tagsSet.add("Computer Science");
  }
  if (combined.includes('12th') || combined.includes('2nd year') || combined.includes('second year') || combined.includes('class 12')) {
    tagsSet.add("12th Computer");
    tagsSet.add("Computer Science");
  }
  if (combined.includes('comment')) {
    tagsSet.add("Comments");
  }
  if (combined.includes('syntax')) {
    tagsSet.add("Syntax");
  }
  if (combined.includes('print')) {
    tagsSet.add("Print Function");
  }

  return {
    category,
    subCategory,
    tags: Array.from(tagsSet).slice(0, 6),
  };
}

/**
 * Synchronously retrieves fastest available lecture dataset
 * (localStorage cache or local catalog) for instant 0ms first render.
 */
export function getInitialLectures(): Lecture[] {
  if (typeof window === 'undefined') {
    return lecturesData;
  }

  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Graceful fallback to static data
  }

  return lecturesData;
}

/**
 * Live background synchronization with YouTube Data API v3.
 * Runs on every reload/mount to auto-detect any newly published videos,
 * fetch their thumbnails, title, description, duration, and metadata,
 * and categorize them properly.
 */
export async function syncYouTubeFeedInBackground(apiKeyOverride?: string): Promise<{
  updated: boolean;
  lectures: Lecture[];
  isLive: boolean;
  error?: string;
}> {
  // Build-only callers supply the server key explicitly. Never bundle a public-env API secret.
  const rawKey = typeof apiKeyOverride === 'string' ? apiKeyOverride : '';

  if (!rawKey || typeof rawKey !== 'string' || rawKey === 'PASTE_YOUTUBE_API_KEY_HERE' || rawKey.trim() === '') {
    return {
      updated: false,
      lectures: getInitialLectures(),
      isLive: false,
      error: 'No API key configured. Using local catalog.',
    };
  }

  const key = rawKey.trim();

  try {
    // Step 1: Fetch upload playlist items
    const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${YOUTUBE_UPLOADS_PLAYLIST_ID}&maxResults=50&key=${key}`;
    const pRes = await fetch(playlistUrl, { signal: AbortSignal.timeout(15000) });

    if (!pRes.ok) {
      const errJson = await pRes.json().catch(() => ({}));
      const message = errJson?.error?.message || `YouTube API returned status ${pRes.status}`;
      return {
        updated: false,
        lectures: getInitialLectures(),
        isLive: false,
        error: message,
      };
    }

    const pData = await pRes.json();
    const items = pData.items || [];

    if (items.length === 0) {
      return {
        updated: false,
        lectures: getInitialLectures(),
        isLive: true,
      };
    }

    // Step 2: Batch fetch video details for all video IDs to obtain exact duration and tags
    const videoIds: string[] = items
      .map((it: any) => it.contentDetails?.videoId || it.snippet?.resourceId?.videoId)
      .filter(Boolean);

    const videoDetailsMap = new Map<string, any>();
    if (videoIds.length > 0) {
      try {
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoIds.slice(0, 50).join(',')}&key=${key}`;
        const vRes = await fetch(videosUrl, { signal: AbortSignal.timeout(15000) });
        if (vRes.ok) {
          const vData = await vRes.json();
          (vData.items || []).forEach((v: any) => videoDetailsMap.set(v.id, v));
        }
      } catch (e) {
        // Video details fallback: playlist item data will still be used
      }
    }

    // Step 3: Map existing curated lectures to preserve hand-tailored metadata
    const existingMap = new Map<string, Lecture>();
    lecturesData.forEach((lec) => {
      existingMap.set(lec.videoId, lec);
    });

    const mergedLectures: Lecture[] = [];

    items.forEach((item: any, idx: number) => {
      const vid = item.contentDetails?.videoId || item.snippet?.resourceId?.videoId;
      if (!vid) return;

      const title = item.snippet?.title || 'Untitled Lecture';
      if (title === 'Private video' || title === 'Deleted video') return;

      const desc = item.snippet?.description || '';
      const thumb =
        item.snippet?.thumbnails?.maxres?.url ||
        item.snippet?.thumbnails?.standard?.url ||
        item.snippet?.thumbnails?.high?.url ||
        item.snippet?.thumbnails?.medium?.url ||
        `https://i.ytimg.com/vi/${vid}/hqdefault.jpg`;

      const videoDetail = videoDetailsMap.get(vid);
      const exactDuration = formatDuration(videoDetail?.contentDetails?.duration);
      const apiTags: string[] = videoDetail?.snippet?.tags || [];

      if (existingMap.has(vid)) {
        const existing = existingMap.get(vid)!;
        mergedLectures.push({
          ...existing,
          title: title || existing.title,
          thumbnail: thumb || existing.thumbnail,
          duration: exactDuration && exactDuration !== 'Duration unavailable' ? exactDuration : existing.duration,
          description: desc.trim().length > 30 ? desc.trim() : existing.description,
        });
      } else {
        // Brand new video automatically discovered from YouTube!
        const { chapter, lectureNo } = extractChapterAndLecture(title, desc);
        const { category, subCategory, tags } = classifyLecture(title, desc, apiTags);
        const keyConcepts = extractKeyConcepts(desc, title);
        const newEntryNumber = String(items.length - idx).padStart(2, '0');

        mergedLectures.push({
          id: `yt-${vid}`,
          number: newEntryNumber,
          videoId: vid,
          youtubeUrl: `https://www.youtube.com/watch?v=${vid}`,
          title,
          category,
          subCategory,
          chapter,
          lectureNo,
          duration: exactDuration,
          thumbnail: thumb,
          description: desc.trim() || 'Newly published lecture from RayTech Institute YouTube channel.',
          tags,
          featured: false,
          keyConcepts,
        });
      }
    });

    // Step 4: Update localStorage cache so subsequent page loads are instant
    if (typeof window !== 'undefined' && mergedLectures.length > 0) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(mergedLectures));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      } catch (e) {
        // Storage full or unavailable
      }
    }

    return {
      updated: true,
      lectures: mergedLectures,
      isLive: true,
    };
  } catch (err: any) {
    return {
      updated: false,
      lectures: getInitialLectures(),
      isLive: false,
      error: err.message || 'Network error',
    };
  }
}
