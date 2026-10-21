'use client';
import { useEffect, useState } from 'react';
import type { Lecture } from '@/types';
import { lectureSnapshot } from '@/data/lectureSnapshot';
import { learningAdminRequest } from '@/lib/learning/admin';

export function useYouTubeSync() {
  const [lectures, setLectures] = useState<Lecture[]>(lectureSnapshot);
  const [isLiveConnected, setConnected] = useState(false);
  const [isSyncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState('');
  useEffect(() => {
    if (!window.location.pathname.startsWith('/admin/')) return;
    let active = true;
    setSyncing(true);
    learningAdminRequest('learning_videos', {}).then(result => {
      if (!Array.isArray(result.videos)) throw new Error('The video service returned an invalid list.');
      const latest: Lecture[] = result.videos.map((video: { id: string; title: string }, index: number) => {
        if (!/^[a-zA-Z0-9_-]{11}$/.test(video.id) || typeof video.title !== 'string') throw new Error('Invalid video metadata.');
        const known = lectureSnapshot.find(item => item.videoId === video.id);
        return known ? { ...known, title: video.title } : { id: video.id, videoId: video.id, title: video.title, number: String(index + 1), youtubeUrl: `https://www.youtube.com/watch?v=${video.id}`, thumbnail: `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`, category: 'Programming', chapter: 'Core Curriculum', lectureNo: 'Lecture', duration: 'Duration unavailable', description: '', tags: [], keyConcepts: [] };
      });
      if (active) { setLectures([...latest, ...lectureSnapshot.filter(item => !latest.some(video => video.videoId === item.videoId))]); setConnected(true); }
    }).catch(() => { if (active) setSyncError('Latest videos could not refresh. The saved catalog remains available; reload to retry.'); }).finally(() => { if (active) setSyncing(false); });
    return () => { active = false; };
  }, []);
  return { lectures, isLiveConnected, isSyncing, syncError };
}
