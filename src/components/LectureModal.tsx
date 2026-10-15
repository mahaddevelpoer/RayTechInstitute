'use client';

import React, { useEffect } from 'react';
import { Lecture } from '@/types';
import { InteractiveVideoPlayer } from './InteractiveVideoPlayer';
import { X, ExternalLink, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface LectureModalProps {
  lecture: Lecture | null;
  allLectures: Lecture[];
  onClose: () => void;
  onSelectLecture: (lectureId: string) => void;
}

export const LectureModal: React.FC<LectureModalProps> = ({
  lecture,
  allLectures,
  onClose,
  onSelectLecture,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!lecture) return;

      const currentIndex = allLectures.findIndex((l) => l.id === lecture.id);
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelectLecture(allLectures[currentIndex - 1].id);
      }
      if (e.key === 'ArrowRight' && currentIndex < allLectures.length - 1) {
        onSelectLecture(allLectures[currentIndex + 1].id);
      }
    };

    if (lecture) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lecture, allLectures, onClose, onSelectLecture]);

  if (!lecture) return null;

  const currentIndex = allLectures.findIndex((l) => l.id === lecture.id);
  const prevLecture = currentIndex > 0 ? allLectures[currentIndex - 1] : null;
  const nextLecture = currentIndex < allLectures.length - 1 ? allLectures[currentIndex + 1] : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-lecture-title"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-white rounded-md border border-slate-300 shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="badge-primary">
              Lesson {lecture.number}
            </span>
            <span className="text-xs font-semibold text-slate-700">
              {lecture.subCategory || lecture.category}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* YouTube Video Embed with Timeline MCQs */}
          <div className="border border-slate-200 rounded overflow-hidden">
            <InteractiveVideoPlayer
              videoId={lecture.videoId}
              title={lecture.title}
              thumbnail={lecture.thumbnail}
            />
          </div>

          {/* Metadata Sub-Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-navy-600" />
                <span>{lecture.duration}</span>
              </span>
              <span>&bull;</span>
              <span>{lecture.chapter}</span>
            </div>

            <a
              href={lecture.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 font-semibold"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Title & Description */}
          <div>
            <h2
              id="modal-lecture-title"
              className="text-lg sm:text-xl font-bold text-navy-900 mb-2"
            >
              {lecture.title}
            </h2>
            <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {lecture.description}
            </div>
          </div>

          {/* Key Concepts */}
          {lecture.keyConcepts && lecture.keyConcepts.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded">
              <div className="text-xs font-bold text-navy-900 mb-2">
                Core Topics Covered in this Video:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700">
                {lecture.keyConcepts.map((concept, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-navy-600 font-bold">&bull;</span>
                    <span>{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tags */}
          {lecture.tags && lecture.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {lecture.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Modal Navigation Footer: Previous / Next */}
        <div className="sticky bottom-0 z-20 mt-auto px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          {prevLecture ? (
            <button
              onClick={() => onSelectLecture(prevLecture.id)}
              className="flex items-center gap-1 text-slate-700 hover:text-navy-700 font-medium"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Video</span>
            </button>
          ) : (
            <div className="text-slate-400">First Video</div>
          )}

          <div className="text-slate-500 text-[11px] hidden sm:block">
            Press [Esc] to exit
          </div>

          {nextLecture ? (
            <button
              onClick={() => onSelectLecture(nextLecture.id)}
              className="flex items-center gap-1 text-slate-700 hover:text-navy-700 font-medium"
            >
              <span>Next Video</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-slate-400">Latest Video</div>
          )}
        </div>
      </div>
    </div>
  );
};
