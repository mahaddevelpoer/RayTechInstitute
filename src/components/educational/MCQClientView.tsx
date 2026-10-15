'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { EducationalStore, INITIAL_SUBJECTS, INITIAL_CLASSES } from '@/data/educationalStore';
import { MCQItem } from '@/types/educational';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowLeft,
  Code,
} from 'lucide-react';

interface MCQClientViewProps {
  classSlug: string;
  subjectSlug: string;
}

export const MCQClientView: React.FC<MCQClientViewProps> = ({ classSlug, subjectSlug }) => {
  const [mcqs, setMCQs] = useState<MCQItem[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [selectedChapter, setSelectedChapter] = useState<number | 'all'>('all');

  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug
  );

  useEffect(() => {
    setMCQs(EducationalStore.getMCQs(classSlug, subjectSlug));
  }, [classSlug, subjectSlug]);

  const filteredMCQs =
    selectedChapter === 'all'
      ? mcqs
      : mcqs.filter((m) => m.chapterNumber === selectedChapter);

  const handleSelectOption = (mcqId: string, optionIdx: number, correctIdx: number) => {
    if (selectedAnswers[mcqId] !== undefined) return;

    setSelectedAnswers((prev) => ({ ...prev, [mcqId]: optionIdx }));
    setScore((prev) => ({
      correct: optionIdx === correctIdx ? prev.correct + 1 : prev.correct,
      total: prev.total + 1,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setScore({ correct: 0, total: 0 });
  };

  const chapters = Array.from(new Set(mcqs.map((m) => m.chapterNumber))).sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 max-w-5xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/classes">Classes</Link>
          <span>/</span>
          <Link href={`/classes/${classSlug}`}>{currentClass?.title || classSlug}</Link>
          <span>/</span>
          <Link href={`/classes/${classSlug}/${subjectSlug}`}>{currentSubject?.title || subjectSlug}</Link>
          <span>/</span>
          <span className="text-slate-700">MCQs Quiz</span>
        </nav>

        {/* Back link */}
        <div className="mb-4">
          <Link
            href={`/classes/${classSlug}/${subjectSlug}`}
            className="inline-flex items-center gap-1.5 text-xs text-navy-600 hover:text-navy-800 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {currentSubject?.title || 'Subject'} Hub</span>
          </Link>
        </div>

        {/* Header & Score bar */}
        <div className="edu-card p-5 bg-slate-50 border-slate-200 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-1">
              <span className="badge-primary">{currentClass?.title}</span>
              <span className="badge-accent">{currentSubject?.title}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-navy-900">
              Online MCQs Practice Test
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              Click any option to see instant answer verification and chapter explanation.
            </p>
          </div>

          {/* Live Score Counter */}
          <div className="flex items-center gap-4 bg-white border border-slate-200 px-4 py-2.5 rounded shadow-sm shrink-0 text-xs">
            <div>
              <div className="text-[10px] text-slate-500 uppercase font-semibold">Attempted</div>
              <div className="text-sm font-bold text-slate-800">{score.total} / {filteredMCQs.length}</div>
            </div>
            <div className="h-7 w-px bg-slate-200" />
            <div>
              <div className="text-[10px] text-emerald-700 uppercase font-semibold">Score</div>
              <div className="text-sm font-bold text-emerald-700">
                {score.correct} Correct
              </div>
            </div>
            {score.total > 0 && (
              <button
                onClick={handleResetQuiz}
                className="ml-2 p-1 text-slate-400 hover:text-navy-700 transition-colors"
                title="Reset Quiz"
                aria-label="Reset Quiz"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Chapter Tabs */}
        {chapters.length > 1 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            <button
              onClick={() => setSelectedChapter('all')}
              className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                selectedChapter === 'all'
                  ? 'bg-navy-600 text-white'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              All Chapters ({mcqs.length})
            </button>
            {chapters.map((ch) => (
              <button
                key={ch}
                onClick={() => setSelectedChapter(ch)}
                className={`text-xs px-3 py-1.5 rounded font-medium transition-colors ${
                  selectedChapter === ch
                    ? 'bg-navy-600 text-white'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                Chapter {ch}
              </button>
            ))}
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-4">
          {filteredMCQs.map((mcq, idx) => {
            const hasAnswered = selectedAnswers[mcq.id] !== undefined;
            const chosenIdx = selectedAnswers[mcq.id];
            const isCorrect = chosenIdx === mcq.correctIndex;

            return (
              <div
                key={mcq.id}
                className="edu-card p-5 bg-white space-y-3"
              >
                {/* Question */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded bg-navy-50 text-navy-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h2 className="text-sm sm:text-base font-semibold text-navy-900 leading-snug">
                      {mcq.question}
                    </h2>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium shrink-0">
                    Ch {mcq.chapterNumber}
                  </span>
                </div>

                {/* Optional Code Snippet */}
                {mcq.codeSnippet && (
                  <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs">
                    <pre className="text-slate-800 font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                      {mcq.codeSnippet}
                    </pre>
                  </div>
                )}

                {/* 4 Multiple Choice Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {mcq.options.map((option, optIdx) => {
                    const isSelected = chosenIdx === optIdx;
                    const isThisTheCorrectAnswer = mcq.correctIndex === optIdx;

                    let btnStyles = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300';

                    if (hasAnswered) {
                      if (isThisTheCorrectAnswer) {
                        btnStyles = 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold';
                      } else if (isSelected && !isCorrect) {
                        btnStyles = 'bg-red-50 border-red-500 text-red-800 font-semibold';
                      } else {
                        btnStyles = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleSelectOption(mcq.id, optIdx, mcq.correctIndex)}
                        className={`p-3 rounded border text-left text-xs transition-colors flex items-center justify-between ${btnStyles}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span>{option}</span>
                        </div>

                        {hasAnswered && (
                          <span>
                            {isThisTheCorrectAnswer ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : isSelected ? (
                              <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                            ) : null}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation */}
                {hasAnswered && (
                  <div
                    className={`p-3.5 rounded border text-xs leading-relaxed flex items-start gap-2.5 ${
                      isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        : 'bg-orange-50 border-orange-200 text-orange-900'
                    }`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs uppercase mb-0.5">
                        {isCorrect ? 'Correct Answer!' : 'Explanation:'}
                      </div>
                      <p>{mcq.explanation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
};
