'use client';

import { useState, useEffect, useRef } from 'react';
import { Lecture } from '@/types';
import { lecturesData } from '@/data/lectures';
import { getInitialLectures, syncYouTubeFeedInBackground } from '@/utils/youtubeSync';

export function useYouTubeSync() {
  // 1. Instant 0ms Render: Always initialize with static catalog so Server and Client hydration match 100%
  const [lectures, setLectures] = useState<Lecture[]>(lecturesData);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;

    // After hydration completes on client, load cached data from localStorage if available
    const initialCached = getInitialLectures();
    if (initialCached && initialCached.length > 0) {
      setLectures(initialCached);
    }

    // 2. Immediate non-blocking background sync on every page reload/visit
    const triggerSync = () => {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      if (!apiKey || apiKey === 'PASTE_YOUTUBE_API_KEY_HERE') {
        return;
      }

      setIsSyncing(true);
      syncYouTubeFeedInBackground()
        .then((result) => {
          if (!isMountedRef.current) return;
          if (result.isLive) {
            setIsLiveConnected(true);
            if (result.lectures && result.lectures.length > 0) {
              setLectures(result.lectures);
            }
          }
        })
        .catch(() => {
          // Graceful fallback to cached catalog
        })
        .finally(() => {
          if (isMountedRef.current) {
            setIsSyncing(false);
          }
        });
    };

    // Execute immediately without delay so new videos are fetched instantly
    triggerSync();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return {
    lectures,
    isLiveConnected,
    isSyncing,
  };
}
