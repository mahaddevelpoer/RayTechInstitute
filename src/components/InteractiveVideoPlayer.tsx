'use client';

import React, { useState, useEffect, useRef } from 'react';
import { EducationalStore } from '@/data/educationalStore';
import { VideoInteractiveMCQ } from '@/types/educational';
import { Play, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, HelpCircle } from 'lucide-react';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface InteractiveVideoPlayerProps {
  videoId: string;
  title: string;
  thumbnail?: string;
  autoPlayOnClick?: boolean;
  className?: string;
}

export const InteractiveVideoPlayer: React.FC<InteractiveVideoPlayerProps> = ({
  videoId,
  title,
  thumbnail,
  autoPlayOnClick = true,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playerReady, setPlayerReady] = useState<boolean>(false);
  const [activeMCQ, setActiveMCQ] = useState<VideoInteractiveMCQ | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredMCQs, setAnsweredMCQs] = useState<Record<string, boolean>>({});
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState<number>(0);

  const containerId = useRef<string>(`yt-player-${videoId}-${Math.random().toString(36).substring(2, 7)}`);
  const playerRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const answeredSetRef = useRef<Set<string>>(new Set());

  // Get interactive questions attached to this video
  const [videoMCQs, setVideoMCQs] = useState<VideoInteractiveMCQ[]>([]);

  useEffect(() => {
    const list = EducationalStore.getVideoMCQs(videoId);
    setVideoMCQs(list);
  }, [videoId]);

  // Load YouTube IFrame API script once
  useEffect(() => {
    if (!isPlaying) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(containerId.current, {
        videoId: videoId,
        playerVars: {
          autoplay: autoPlayOnClick ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          enablejsapi: 1,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
          },
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING is 1
            if (event.data === 1) {
              startTimeTracker();
            } else {
              stopTimeTracker();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      stopTimeTracker();
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [isPlaying, videoId, autoPlayOnClick]);

  const startTimeTracker = () => {
    stopTimeTracker();
    timerRef.current = setInterval(() => {
      if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;

      const currentTime = Math.floor(playerRef.current.getCurrentTime());
      setCurrentPlaybackTime(currentTime);

      // Check if current time matches any pending MCQ checkpoint
      const currentMCQs = EducationalStore.getVideoMCQs(videoId);
      for (const mcq of currentMCQs) {
        if (
          Math.abs(currentTime - mcq.timestampSeconds) <= 1 &&
          !answeredSetRef.current.has(mcq.id)
        ) {
          // Pause video and trigger on-screen quiz
          try {
            playerRef.current.pauseVideo();
          } catch {}
          setActiveMCQ(mcq);
          setSelectedOption(null);
          setShowFeedback(false);
          stopTimeTracker();
          break;
        }
      }
    }, 500);
  };

  const stopTimeTracker = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleSelectOption = (index: number) => {
    if (showFeedback || !activeMCQ) return;
    setSelectedOption(index);
    setShowFeedback(true);
    const isCorrect = index === activeMCQ.correctIndex;
    setAnsweredMCQs((prev) => ({ ...prev, [activeMCQ.id]: isCorrect }));
    answeredSetRef.current.add(activeMCQ.id);
  };

  const handleResumeVideo = () => {
    setActiveMCQ(null);
    setSelectedOption(null);
    setShowFeedback(false);
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      try {
        playerRef.current.playVideo();
      } catch {}
      startTimeTracker();
    }
  };

  const handleSeekToMarker = (seconds: number) => {
    if (!isPlaying) {
      setIsPlaying(true);
    }
    setTimeout(() => {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        try {
          playerRef.current.seekTo(seconds, true);
          playerRef.current.playVideo();
        } catch {}
      }
    }, 500);
  };

  // Thumbnail Facade View (Before play button is pressed)
  if (!isPlaying) {
    const imgSrc = thumbnail || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    return (
      <div className={`space-y-2 ${className}`}>
        <div
          className="relative w-full aspect-video bg-navy-950 overflow-hidden border border-slate-200 group cursor-pointer rounded-md shadow-sm"
          onClick={() => setIsPlaying(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsPlaying(true);
            }
          }}
          aria-label={`Play lecture video: ${title}`}
        >
          <img
            src={imgSrc}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] filter brightness-[0.9] group-hover:brightness-95"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-navy-950/30" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-navy-900/90 text-emerald-400 border border-emerald-500/50 shadow-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 group-hover:scale-105">
              <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5 fill-current" />
            </div>
          </div>

          {/* Interactive Quiz Badge */}
          {videoMCQs.length > 0 && (
            <div className="absolute top-3 left-3 bg-navy-900/90 text-white border border-navy-700 px-2.5 py-1 text-[11px] font-semibold rounded flex items-center gap-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{videoMCQs.length} Interactive Timeline Quiz{videoMCQs.length > 1 ? 'zes' : ''}</span>
            </div>
          )}
        </div>

        {/* Timeline Markers Preview */}
        {videoMCQs.length > 0 && (
          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded text-xs flex flex-wrap items-center gap-2">
            <span className="font-semibold text-navy-900 flex items-center gap-1 text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-navy-600" />
              <span>Interactive Topics:</span>
            </span>
            {videoMCQs.map((m) => (
              <button
                key={m.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSeekToMarker(m.timestampSeconds);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-300 hover:border-navy-600 hover:text-navy-700 text-slate-700 rounded text-[11px] font-medium transition-colors"
              >
                <span className="font-mono text-navy-600 font-semibold">{m.timestampFormatted}</span>
                <span>{m.topic}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Active Player View with Live Interactive Overlay
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="relative w-full aspect-video bg-black overflow-hidden border border-slate-300 rounded-md shadow-md">
        {/* YouTube Container */}
        <div id={containerId.current} className="w-full h-full" />

        {/* On-Screen Interactive MCQ Modal Overlay */}
        {activeMCQ && (
          <div className="absolute inset-0 z-30 bg-navy-950/85 backdrop-blur-sm p-4 sm:p-6 flex flex-col justify-between overflow-y-auto animate-fade-in text-white">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between border-b border-navy-700 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                    Checkpoint • {activeMCQ.timestampFormatted}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {activeMCQ.topic}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">
                  Video paused automatically
                </span>
              </div>

              {/* Question */}
              <h3 className="text-sm sm:text-base font-bold text-white leading-snug mb-2">
                {activeMCQ.question}
              </h3>

              {/* Code Snippet if present */}
              {activeMCQ.codeSnippet && (
                <pre className="p-2.5 bg-navy-900 border border-navy-700 rounded text-xs font-mono text-emerald-300 overflow-x-auto mb-3">
                  <code>{activeMCQ.codeSnippet}</code>
                </pre>
              )}
            </div>

            {/* 4 Interactive Options */}
            <div className="space-y-2 my-2">
              {activeMCQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === activeMCQ.correctIndex;
                let optionStyle = 'bg-navy-900/80 hover:bg-navy-800 border-navy-700 text-slate-200';

                if (showFeedback) {
                  if (isCorrect) {
                    optionStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-semibold';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-red-950/90 border-red-500 text-red-200';
                  } else {
                    optionStyle = 'bg-navy-950/50 border-navy-800 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showFeedback}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded border text-xs flex items-center justify-between transition-all ${optionStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center font-bold text-[10px] shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {showFeedback && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {showFeedback && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation & Resume Action */}
            <div className="pt-2 border-t border-navy-800">
              {showFeedback ? (
                <div className="space-y-3">
                  <div className="p-2.5 bg-navy-900/90 border-l-2 border-emerald-400 rounded-r text-[11px] text-slate-300 leading-relaxed">
                    <span className="font-semibold text-emerald-300 mr-1">Explanation:</span>
                    {activeMCQ.explanation}
                  </div>

                  <div className="flex items-center justify-end">
                    <button
                      onClick={handleResumeVideo}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors shadow"
                    >
                      <span>Resume Lecture</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Select an answer to verify your conceptual grasp.</span>
                  <button
                    onClick={handleResumeVideo}
                    className="text-slate-400 hover:text-white underline text-[11px]"
                  >
                    Skip Question
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interactive Timeline Markers Bar */}
      {videoMCQs.length > 0 && (
        <div className="bg-white border border-slate-200 p-3 rounded-md shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Interactive Video Checkpoints ({videoMCQs.length})</span>
            </span>
            <span className="text-[11px] text-slate-500">
              Click any timestamp to test that concept
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {videoMCQs.map((m) => {
              const answered = answeredMCQs[m.id];
              return (
                <button
                  key={m.id}
                  onClick={() => handleSeekToMarker(m.timestampSeconds)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
                    answered
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 hover:border-navy-600 text-slate-700'
                  }`}
                >
                  <span className="font-mono font-bold text-navy-700">
                    {m.timestampFormatted}
                  </span>
                  <span>{m.topic}</span>
                  {answered ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1" />
                  ) : (
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400 ml-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
