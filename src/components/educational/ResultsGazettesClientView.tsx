'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EducationalStore } from '@/data/educationalStore';
import { GazetteItem } from '@/types/educational';
import { Award, ExternalLink, Search } from 'lucide-react';
import { sanitizeUrl } from '@/utils/security';
import { PdfResourceActions } from '@/components/educational/PdfResourceActions';


export function ResultsGazettesClientView() {
  const [gazettes, setGazettes] = useState<GazetteItem[]>([]);
  const [selectedBoard, setSelectedBoard] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setGazettes(EducationalStore.getGazettes());
  }, []);

  const BOARDS = [
    'BISE Lahore',
    'BISE Gujranwala',
    'BISE Rawalpindi',
    'BISE Faisalabad',
    'BISE Multan',
    'BISE Sahiwal',
    'BISE Bahawalpur',
    'BISE DG Khan',
    'BISE Sargodha',
    'Federal Board (FBISE)',
  ];

  const filteredGazettes = gazettes.filter((gz) => {
    const matchesBoard = selectedBoard === 'all' || gz.board === selectedBoard;
    const matchesClass = selectedClass === 'all' || gz.classSlug === selectedClass;
    const matchesSearch =
      searchQuery.trim() === '' ||
      gz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gz.board.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBoard && matchesClass && matchesSearch;
  });

  return (
    <>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-slate-700">Result Gazettes</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 badge-highlight mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>Official Board Results</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Punjab Boards &amp; FBISE Result Gazettes
        </h1>
        <p className="text-slate-600 text-sm">
          Download complete official result gazettes (PDF) and verify marks for 11th and 12th class examinations.
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search board or year..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-2 pl-8 focus:outline-none focus:border-navy-600 text-slate-800"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          {/* Filter Board */}
          <div>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-navy-600 text-slate-800"
            >
              <option value="all">All Punjab Boards &amp; FBISE</option>
              {BOARDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Class */}
          <div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs bg-white border border-slate-300 rounded px-3 py-2 focus:outline-none focus:border-navy-600 text-slate-800"
            >
              <option value="all">All Classes (11th &amp; 12th)</option>
              <option value="11th-class">11th Class (1st Year)</option>
              <option value="12th-class">12th Class (2nd Year)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Gazettes Table / List */}
      <div className="edu-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="edu-table">
            <thead>
              <tr>
                <th>Board Name</th>
                <th>Examination Title</th>
                <th>Year</th>
                <th>File Size</th>
                <th>Downloads &amp; Links</th>
              </tr>
            </thead>
            <tbody>
              {filteredGazettes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    No result gazette found for this selection.
                  </td>
                </tr>
              ) : (
                filteredGazettes.map((gz) => (
                  <tr key={gz.id}>
                    <td className="font-semibold text-navy-900 whitespace-nowrap">
                      {gz.board}
                    </td>
                    <td>
                      <Link href={`/results-gazettes/${gz.id.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="font-medium text-slate-800 hover:text-navy-700">{gz.title}</Link>
                      <div className="text-[11px] text-slate-500">
                        Total Candidates: {gz.totalCandidates || 'Official Gazette'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap font-medium text-slate-700">
                      {gz.year}
                    </td>
                    <td className="whitespace-nowrap text-xs text-slate-500 font-mono">
                      {gz.session}
                    </td>
                    <td>
                      <div className="flex min-w-[260px] flex-wrap items-center gap-2">
                        <PdfResourceActions
                          pdfUrl={gz.pdfUrl}
                          title={`${gz.board} ${gz.year} result gazette`}
                          downloadLabel="Download gazette"
                          className="[&>*]:whitespace-nowrap"
                        />
                        {gz.actionButtonText && gz.actionButtonUrl && !gz.actionButtonUrl.includes('example.com') ? (
                          <a
                            href={sanitizeUrl(gz.actionButtonUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-medium"
                          >
                            <span>{gz.actionButtonText}</span>
                          </a>
                        ) : null}

                        {gz.directResultUrl && !gz.directResultUrl.includes('example.com') && (
                          <a
                            href={sanitizeUrl(gz.directResultUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-outline text-xs py-1.5 px-3"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
