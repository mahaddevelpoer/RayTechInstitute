'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Lecture } from '@/types';
import { lecturesData } from '@/data/lectures';
import { Search, Play, Clock } from 'lucide-react';

interface LectureArchiveProps {
  lectures?: Lecture[];
  isLiveConnected?: boolean;
  isSyncing?: boolean;
  onOpenModal: (lectureId: string) => void;
  selectedCategoryFilter?: string;
  onFilterChange?: (category: string) => void;
}

export const LectureArchive: React.FC<LectureArchiveProps> = ({
  lectures = lecturesData,
  isLiveConnected = false,
  isSyncing = false,
  onOpenModal,
  selectedCategoryFilter = 'ALL',
  onFilterChange,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(selectedCategoryFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (selectedCategoryFilter) {
      setActiveFilter(selectedCategoryFilter.toUpperCase());
    }
  }, [selectedCategoryFilter]);

  const categories = [
    { label: 'All Lectures', value: 'ALL' },
    { label: 'Computer Science', value: 'COMPUTER SCIENCE' },
    { label: 'Python', value: 'PYTHON' },
    { label: 'C / C++', value: 'C / C++' },
    { label: 'Web (HTML)', value: 'WEB' },
  ];

  const handleFilterSelect = (val: string) => {
    setActiveFilter(val);
    if (onFilterChange) onFilterChange(val);
  };

  const filteredLectures = useMemo(() => {
    return lectures.filter((lec) => {
      let matchesCategory = true;
      if (activeFilter !== 'ALL') {
        const cat = activeFilter.toLowerCase();
        if (cat === 'python') {
          matchesCategory =
            lec.tags.some((t) => t.toLowerCase() === 'python') ||
            (lec.subCategory?.toLowerCase().includes('python') ?? false) ||
            lec.title.toLowerCase().includes('python');
        } else if (cat === 'c / c++') {
          matchesCategory =
            lec.tags.some((t) => t.toLowerCase().includes('c++') || t.toLowerCase() === 'c / c++') ||
            (lec.subCategory?.toLowerCase().includes('c') ?? false) ||
            lec.title.toLowerCase().includes('c++') ||
            lec.title.toLowerCase().includes('c programming');
        } else if (cat === 'computer science') {
          matchesCategory =
            lec.category === 'Computer Science' ||
            lec.tags.some((t) => t.toLowerCase().includes('computer')) ||
            (lec.subCategory?.toLowerCase().includes('computer') ?? false) ||
            lec.title.toLowerCase().includes('computer');
        } else if (cat === 'web') {
          matchesCategory =
            lec.category === 'Web' ||
            lec.tags.some((t) => t.toLowerCase().includes('html') || t.toLowerCase().includes('web')) ||
            lec.title.toLowerCase().includes('html');
        }
      }

      const matchesSearch =
        searchQuery === '' ||
        lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lec.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [lectures, activeFilter, searchQuery]);

  return (
    <section id="archive" className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="section-title mb-1">
              Video Lectures Library
            </h2>
            <p className="text-slate-600 text-xs">
              Search and filter recorded lectures and tutorials.
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium" suppressHydrationWarning>
            Showing {filteredLectures.length} of {lectures.length} lectures
          </span>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-slate-50 border border-slate-200 rounded p-3 mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c.value}
                onClick={() => handleFilterSelect(c.value)}
                className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                  activeFilter === c.value
                    ? 'bg-navy-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <input
              type="text"
              placeholder="Search lectures..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-1.5 pl-8 focus:outline-none focus:border-navy-600 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Video Cards Grid */}
        {filteredLectures.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm">
            Koi lecture match nahi hua. Search query ya category filter change karein.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLectures.map((lec) => (
              <div
                key={lec.id}
                className="edu-card overflow-hidden flex flex-col justify-between group cursor-pointer"
                onClick={() => onOpenModal(lec.id)}
              >
                <div>
                  {/* Thumbnail */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    <img
                      src={lec.thumbnail}
                      alt={lec.title}
                      width={640}
                      height={360}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                      <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                      {lec.duration}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="badge-primary text-[10px]">{lec.category}</span>
                      {lec.subCategory && (
                        <span className="badge-accent text-[10px]">{lec.subCategory}</span>
                      )}
                    </div>
                    <p className="font-semibold text-navy-900 text-sm line-clamp-2 mb-2 group-hover:text-navy-600 transition-colors">
                      {lec.title}
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {lec.description}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 text-xs font-semibold text-navy-600 flex items-center justify-between">
                  <span>View Details</span>
                  <span>&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
