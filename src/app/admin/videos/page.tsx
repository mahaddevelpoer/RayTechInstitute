'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useYouTubeSync } from '@/hooks/useYouTubeSync';
import { EducationalStore } from '@/data/educationalStore';
import { VideoInteractiveMCQ, MCQItem } from '@/types/educational';
import { Lecture } from '@/types';
import {
  Video,
  Play,
  PlusCircle,
  Clock,
  HelpCircle,
  Trash2,
  Edit,
  Save,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function AdminVideosInteractiveMCQPage() {
  const { lectures, isLiveConnected, isSyncing } = useYouTubeSync();
  const [selectedVideo, setSelectedVideo] = useState<Lecture | null>(null);
  const [videoMCQs, setVideoMCQs] = useState<VideoInteractiveMCQ[]>([]);
  const [existingMCQs, setExistingMCQs] = useState<MCQItem[]>([]);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [timestampMinutes, setTimestampMinutes] = useState<number>(1);
  const [timestampSeconds, setTimestampSeconds] = useState<number>(30);
  const [topic, setTopic] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [codeSnippet, setCodeSnippet] = useState<string>('');
  const [options, setOptions] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [correctIndex, setCorrectIndex] = useState<number>(0);
  const [explanation, setExplanation] = useState<string>('');
  const [importMCQId, setImportMCQId] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Initial load
  useEffect(() => {
    if (lectures && lectures.length > 0 && !selectedVideo) {
      setSelectedVideo(lectures[0]);
    }
    setExistingMCQs(EducationalStore.getMCQs());
  }, [lectures, selectedVideo]);

  // Load MCQs whenever selected video changes
  useEffect(() => {
    if (selectedVideo) {
      const list = EducationalStore.getVideoMCQs(selectedVideo.videoId);
      setVideoMCQs(list);
    }
  }, [selectedVideo]);

  const resetForm = () => {
    setEditingId(null);
    setTimestampMinutes(1);
    setTimestampSeconds(30);
    setTopic('');
    setQuestion('');
    setCodeSnippet('');
    setOptions(['', '', '', '']);
    setCorrectIndex(0);
    setExplanation('');
    setImportMCQId('');
  };

  const handleEditMCQ = (item: VideoInteractiveMCQ) => {
    setEditingId(item.id);
    const mins = Math.floor(item.timestampSeconds / 60);
    const secs = item.timestampSeconds % 60;
    setTimestampMinutes(mins);
    setTimestampSeconds(secs);
    setTopic(item.topic);
    setQuestion(item.question);
    setCodeSnippet(item.codeSnippet || '');
    setOptions([...item.options] as [string, string, string, string]);
    setCorrectIndex(item.correctIndex);
    setExplanation(item.explanation);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleDeleteMCQ = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this interactive timeline checkpoint?')) return;
    await EducationalStore.deleteVideoMCQ(id);
    if (selectedVideo) {
      setVideoMCQs(EducationalStore.getVideoMCQs(selectedVideo.videoId));
    }
    setStatusMessage('Checkpoint deleted successfully.');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleImportExistingMCQ = (mcqId: string) => {
    setImportMCQId(mcqId);
    const found = existingMCQs.find((m) => m.id === mcqId);
    if (found) {
      setQuestion(found.question);
      setCodeSnippet(found.codeSnippet || '');
      setOptions([...found.options]);
      setCorrectIndex(found.correctIndex);
      setExplanation(found.explanation);
      if (!topic) {
        setTopic(`Chapter ${found.chapterNumber} Concept Review`);
      }
    }
  };

  const handleSaveCheckpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVideo) {
      alert('Please select a video first.');
      return;
    }

    if (!topic.trim() || !question.trim() || options.some((o) => !o.trim())) {
      alert('Please fill out the Topic, Question, and all 4 Options.');
      return;
    }

    setIsSaving(true);
    const totalSeconds = timestampMinutes * 60 + timestampSeconds;
    const formatted = `${String(timestampMinutes).padStart(2, '0')}:${String(timestampSeconds).padStart(2, '0')}`;

    const newMCQ: VideoInteractiveMCQ = {
      id: editingId || `vmcq-${Date.now()}`,
      videoId: selectedVideo.videoId,
      videoTitle: selectedVideo.title,
      timestampSeconds: totalSeconds,
      timestampFormatted: formatted,
      topic: topic.trim(),
      question: question.trim(),
      codeSnippet: codeSnippet.trim() || undefined,
      options: [options[0].trim(), options[1].trim(), options[2].trim(), options[3].trim()],
      correctIndex,
      explanation: explanation.trim() || 'Refer to the lecture explanation at this timestamp.',
    };

    await EducationalStore.saveVideoMCQ(newMCQ);
    setVideoMCQs(EducationalStore.getVideoMCQs(selectedVideo.videoId));
    setIsSaving(false);
    setStatusMessage(editingId ? 'Checkpoint updated!' : 'Interactive checkpoint attached to timeline!');
    resetForm();
    setTimeout(() => setStatusMessage(''), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Video className="w-5 h-5 text-navy-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-navy-900">
              Interactive Video Timeline MCQs
            </h1>
          </div>
          <p className="text-xs text-slate-500">
            Real-time YouTube channel synchronization &bull; Attach on-screen concept check questions at specific video timestamps.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span>{isSyncing ? 'Syncing Channel...' : `${lectures.length} Videos Live`}</span>
          </span>
          <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
            className="btn-outline text-xs py-1.5 px-3 flex items-center gap-1"
          >
            <span>Preview Player</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Main Grid: Video Selector + Timeline Quiz Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: YouTube Video Catalog List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-navy-900 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-navy-600" />
                <span>Select YouTube Lecture</span>
              </h2>
              <span className="text-[11px] text-slate-400">
                {lectures.length} Lectures
              </span>
            </div>

            <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
              {lectures.map((lec) => {
                const count = EducationalStore.getVideoMCQs(lec.videoId).length;
                const isSelected = selectedVideo?.videoId === lec.videoId;

                return (
                  <button
                    key={lec.id}
                    onClick={() => {
                      setSelectedVideo(lec);
                      resetForm();
                    }}
                    className={`w-full text-left p-2.5 rounded border transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-navy-50 border-navy-600 ring-1 ring-navy-600'
                        : 'bg-white hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="relative w-20 aspect-video rounded overflow-hidden shrink-0 bg-slate-100">
                      <img
                        src={lec.thumbnail}
                        alt={lec.title}
                        width={160}
                        height={90}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[9px] px-1 rounded font-mono">
                        {lec.duration}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-[10px] font-semibold text-navy-600 uppercase">
                          {lec.chapter}
                        </span>
                        {count > 0 && (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                            {count} Quiz{count > 1 ? 'zes' : ''}
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-medium text-slate-800 line-clamp-2 leading-tight">
                        {lec.title}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Columns: Video Player Preview & MCQ Timeline Editor */}
        <div className="lg:col-span-2 space-y-6">
          {selectedVideo ? (
            <>
              {/* Selected Video Info Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <span className="badge-primary mb-1">
                      {selectedVideo.chapter} &bull; {selectedVideo.lectureNo}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-navy-900 mt-1">
                      {selectedVideo.title}
                    </h2>
                  </div>
                  <a
                    href={selectedVideo.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-1 shrink-0"
                  >
                    <span>Open on YouTube</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Embedded Video Player */}
                <div className="aspect-video w-full rounded overflow-hidden border border-slate-300 bg-black">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo.videoId}?rel=0&modestbranding=1`}
                    title={selectedVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>

              {/* Form: Add or Edit Timeline Checkpoint */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <span>{editingId ? 'Edit Timeline Checkpoint' : 'Attach New Interactive Checkpoint'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      The video will pause automatically at this exact second to display this question.
                    </p>
                  </div>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-xs text-slate-500 hover:text-slate-800 underline"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>

                {/* Quick Import Existing MCQ */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded text-xs space-y-2">
                  <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                    <Sparkles className="w-3.5 h-3.5 text-navy-600" />
                    <span>Quick Import: Attach an existing MCQ from database</span>
                  </div>
                  <select
                    value={importMCQId}
                    onChange={(e) => handleImportExistingMCQ(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-navy-600"
                  >
                    <option value="">-- Choose an MCQ to auto-fill this form --</option>
                    {existingMCQs.map((m) => (
                      <option key={m.id} value={m.id}>
                        [Ch {m.chapterNumber}] {m.question.substring(0, 85)}...
                      </option>
                    ))}
                  </select>
                </div>

                <form onSubmit={handleSaveCheckpoint} className="space-y-4">
                  {/* Timeline Timestamp Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-navy-600" />
                        <span>Timestamp Trigger</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5">
                          <input
                            type="number"
                            min="0"
                            max="180"
                            value={timestampMinutes}
                            onChange={(e) => setTimestampMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                            className="w-12 text-center text-xs font-mono bg-transparent border-0 focus:outline-none font-bold"
                          />
                          <span className="text-xs text-slate-400">min</span>
                        </div>

                        <span className="font-bold text-slate-400">:</span>

                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5">
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={timestampSeconds}
                            onChange={(e) => setTimestampSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-12 text-center text-xs font-mono bg-transparent border-0 focus:outline-none font-bold"
                          />
                          <span className="text-xs text-slate-400">sec</span>
                        </div>

                        <span className="text-xs text-slate-500 font-mono">
                          (= {timestampMinutes * 60 + timestampSeconds}s)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Topic Name (On-screen badge)
                      </label>
                      <input
                        type="text"
                        required
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Python input() function return type"
                        className="w-full text-xs p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-600"
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      MCQ Question Text
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="e.g. What data type is returned by the input() function in Python 3?"
                      className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-600"
                    />
                  </div>

                  {/* Code Snippet (Optional) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Code Snippet (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={codeSnippet}
                      onChange={(e) => setCodeSnippet(e.target.value)}
                      placeholder="e.g. user_age = input('Enter age:')&#10;print(type(user_age))"
                      className="w-full text-xs font-mono p-2.5 rounded border border-slate-300 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-navy-600"
                    />
                  </div>

                  {/* 4 Options & Correct Answer Radio */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      4 Options (Select radio button for Correct Answer):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`flex items-center gap-2 p-2 rounded border transition-colors ${
                            correctIndex === idx
                              ? 'bg-emerald-50 border-emerald-400'
                              : 'bg-white border-slate-200'
                          }`}
                        >
                          <input
                            type="radio"
                            name="correctIndex"
                            checked={correctIndex === idx}
                            onChange={() => setCorrectIndex(idx)}
                            className="text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-slate-500 w-4">
                            {String.fromCharCode(65 + idx)}:
                          </span>
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => {
                              const copy = [...options] as [string, string, string, string];
                              copy[idx] = e.target.value;
                              setOptions(copy);
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                            className="flex-1 text-xs p-1 bg-transparent border-0 focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explanation */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Pedagogical Explanation
                    </label>
                    <textarea
                      rows={2}
                      value={explanation}
                      onChange={(e) => setExplanation(e.target.value)}
                      placeholder="e.g. In Python 3, input() always evaluates to a string. To convert to an integer, use int(input())."
                      className="w-full text-xs p-2.5 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-navy-600"
                    />
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end gap-2 pt-2">
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="btn-outline text-xs py-2 px-4"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="btn-primary text-xs py-2 px-5 flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{isSaving ? 'Saving...' : editingId ? 'Update Checkpoint' : 'Save Checkpoint'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* List of Attached Checkpoints for this Video */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold text-navy-900">
                      Timeline Checkpoints for this Lecture ({videoMCQs.length})
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Sorted chronologically
                  </span>
                </div>

                {videoMCQs.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No interactive checkpoints attached to this video yet. Use the form above to add one!
                  </div>
                ) : (
                  <div className="space-y-3">
                    {videoMCQs.map((item, idx) => (
                      <div
                        key={item.id}
                        className="p-4 bg-slate-50 border border-slate-200 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 bg-navy-600 text-white font-mono text-[11px] font-bold rounded">
                              {item.timestampFormatted}
                            </span>
                            <span className="text-xs font-bold text-navy-900">
                              {item.topic}
                            </span>
                          </div>

                          <div className="text-xs text-slate-700">
                            {item.question}
                          </div>

                          <div className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Correct: {String.fromCharCode(65 + item.correctIndex)} ({item.options[item.correctIndex]})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleEditMCQ(item)}
                            className="p-1.5 text-navy-600 hover:bg-navy-50 rounded transition-colors"
                            title="Edit Checkpoint"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMCQ(item.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Checkpoint"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="py-20 text-center bg-white border border-slate-200 rounded-lg text-xs text-slate-500">
              Select a video from the left catalog to configure timeline interactive questions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
