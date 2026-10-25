"use client";

import React from "react";
import { Lecture } from "@/types";
import { lecturesData } from "@/data/lectures";
import { InteractiveVideoPlayer } from "./InteractiveVideoPlayer";
import { Clock, Play } from "lucide-react";

interface FeaturedLectureProps {
  lectures?: Lecture[];
  onOpenModal: (lectureId: string) => void;
}

export const FeaturedLecture: React.FC<FeaturedLectureProps> = ({
  lectures = lecturesData,
  onOpenModal,
}) => {
  const featured =
    lectures.find((l) => l.featured) || lectures[0] || lecturesData[0];

  return (
    <section
      id="featured"
      className="py-12 bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="section-title mb-1">Featured Video Lecture</h2>
            <p className="text-slate-600 text-xs">
              Explore a selected topic with a guided video lesson.
            </p>
          </div>
          <span className="badge-highlight hidden sm:inline-block">
            Recommended Watch
          </span>
        </div>

        {/* Card */}
        <div className="edu-card overflow-hidden bg-white p-5 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Video */}
            <div className="lg:col-span-7">
              <InteractiveVideoPlayer
                videoId={featured.videoId}
                title={featured.title}
                thumbnail={featured.thumbnail}
                className="rounded overflow-hidden shadow-sm"
              />
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-navy-600" />
                  <span>Duration: {featured.duration}</span>
                </span>
                <span>Category: {featured.category}</span>
              </div>
            </div>

            {/* Content */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex flex-wrap gap-1.5 mb-2.5">
                  <span className="badge-primary">{featured.category}</span>
                  {featured.subCategory && (
                    <span className="badge-accent">{featured.subCategory}</span>
                  )}
                </div>

                <h3 className="font-bold text-navy-900 text-lg leading-snug mb-2">
                  {featured.title}
                </h3>

                <p className="text-slate-600 text-xs leading-relaxed mb-4">
                  {featured.description
                    .split(/\\n|\n/)
                    .find((line) => line.trim().length > 30)
                    ?.replace(/[*#]/g, "")
                    .slice(0, 300) ||
                    "Watch this lecture and practise the examples with your textbook."}
                </p>

                {featured.tags && featured.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {featured.tags.slice(0, 4).map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                <button
                  onClick={() => onOpenModal(featured.id)}
                  className="btn-primary text-xs py-2 px-4"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Open Details &amp; Notes</span>
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${featured.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-600 hover:text-navy-700 underline font-medium"
                >
                  Watch on YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
