"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  RotateCcw,
  Shuffle,
  XCircle,
} from "lucide-react";
import {
  EducationalStore,
  INITIAL_CHAPTERS,
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
} from "@/data/educationalStore";
import { MCQItem } from "@/types/educational";

interface MCQClientViewProps {
  classSlug: string;
  subjectSlug: string;
}
type QuizQuestion = MCQItem & {
  quizOptions: [string, string, string, string];
  quizCorrectIndex: number;
};
type Answer = { selectedIndex: number; correct: boolean };

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function makeQuiz(items: MCQItem[]): QuizQuestion[] {
  return shuffle(items).map((item) => {
    const indexed = shuffle(
      item.options.map((text, index) => ({ text, index })),
    );
    return {
      ...item,
      quizOptions: indexed.map(
        (option) => option.text,
      ) as QuizQuestion["quizOptions"],
      quizCorrectIndex: indexed.findIndex(
        (option) => option.index === item.correctIndex,
      ),
    };
  });
}

export const MCQClientView: React.FC<MCQClientViewProps> = ({
  classSlug,
  subjectSlug,
}) => {
  const [mcqs, setMCQs] = useState<MCQItem[]>(() =>
    EducationalStore.getMCQs(classSlug, subjectSlug),
  );
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState<number | "all">("all");
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const currentClass = INITIAL_CLASSES.find((item) => item.slug === classSlug);
  const currentSubject = INITIAL_SUBJECTS.find(
    (item) => item.classSlug === classSlug && item.slug === subjectSlug,
  );

  useEffect(() => {
    setMCQs(EducationalStore.getMCQs(classSlug, subjectSlug));
    setQuiz([]);
    setStarted(false);
    setFinished(false);
    setAnswers({});
    setCurrentIndex(0);
  }, [classSlug, subjectSlug]);

  const chapterCatalog = useMemo(() => {
    const named = INITIAL_CHAPTERS.filter(
      (item) =>
        item.classSlug === classSlug &&
        item.subjectSlug === subjectSlug &&
        item.isActive !== false,
    );
    const numbers = Array.from(
      new Set(mcqs.map((item) => item.chapterNumber)),
    ).sort((a, b) => a - b);
    return numbers.map(
      (number) =>
        named.find((item) => item.chapterNumber === number) || {
          id: `fallback-${number}`,
          classSlug,
          subjectSlug,
          chapterNumber: number,
          title: `Chapter ${number}`,
          isActive: true,
        },
    );
  }, [classSlug, subjectSlug, mcqs]);
  const currentQuestion = quiz[currentIndex];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id]
    : undefined;
  const score = Object.values(answers).filter(
    (answer) => answer.correct,
  ).length;

  const startQuiz = (chapter: number | "all" = selectedChapter) => {
    const source =
      chapter === "all"
        ? mcqs
        : mcqs.filter((item) => item.chapterNumber === chapter);
    setSelectedChapter(chapter);
    setQuiz(makeQuiz(source));
    setAnswers({});
    setCurrentIndex(0);
    setStarted(true);
    setFinished(false);
  };
  const chooseAnswer = (optionIndex: number) => {
    if (!currentQuestion || finished) return;
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion.id]: {
        selectedIndex: optionIndex,
        correct: optionIndex === currentQuestion.quizCorrectIndex,
      },
    }));
  };
  const nextQuestion = () => {
    if (!currentAnswer) return;
    if (currentIndex >= quiz.length - 1) setFinished(true);
    else setCurrentIndex((index) => index + 1);
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <div
        className="page-main flex-1"
        role="main"
        id="main-content"
        tabIndex={-1}
      >
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/classes">Classes</Link>
          <span>/</span>
          <Link href={`/classes/${classSlug}`}>
            {currentClass?.title || classSlug}
          </Link>
          <span>/</span>
          <Link href={`/classes/${classSlug}/${subjectSlug}`}>
            {currentSubject?.title || subjectSlug}
          </Link>
          <span>/</span>
          <span className="text-slate-700">MCQs Quiz</span>
        </nav>
        <div className="mb-5">
          <Link
            href={`/classes/${classSlug}/${subjectSlug}`}
            className="inline-flex items-center gap-1.5 text-xs text-navy-600 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to{" "}
            {currentSubject?.title || "Subject"} Hub
          </Link>
        </div>
        <div className="edu-card p-5 bg-slate-50 border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex gap-2 mb-1">
                <span className="badge-primary">{currentClass?.title}</span>
                <span className="badge-accent">{currentSubject?.title}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-navy-900">
                Chapter-wise MCQs Practice
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Chapter select karein. Questions aur options har attempt mein
                random order mein aayenge.
              </p>
            </div>
            {started && !finished && (
              <div className="text-xs font-semibold text-slate-600">
                Question {currentIndex + 1} / {quiz.length}
                <span className="mx-2">·</span>
                {Object.keys(answers).length} answered
              </div>
            )}
          </div>
        </div>

        {!started && (
          <section className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <button
                onClick={() => startQuiz("all")}
                disabled={!mcqs.length}
                className="p-4 rounded-lg border-2 border-navy-200 bg-navy-50 text-left hover:border-navy-500"
              >
                <div className="font-bold text-navy-900">All Chapters</div>
                <div className="text-xs text-slate-600 mt-1">
                  {mcqs.length} MCQs · Random practice
                </div>
              </button>
              {chapterCatalog.map((chapter) => {
                const count = mcqs.filter(
                  (item) => item.chapterNumber === chapter.chapterNumber,
                ).length;
                return (
                  <button
                    key={chapter.id}
                    onClick={() => startQuiz(chapter.chapterNumber)}
                    disabled={!count}
                    className="p-4 rounded-lg border border-slate-200 bg-white text-left hover:border-navy-400 disabled:opacity-50"
                  >
                    <div className="font-bold text-navy-900">
                      {chapter.title === `Chapter ${chapter.chapterNumber}`
                        ? chapter.title
                        : `Chapter ${chapter.chapterNumber}: ${chapter.title}`}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {count} MCQs
                    </div>
                  </button>
                );
              })}
            </div>
            {!mcqs.length && (
              <p className="p-4 rounded bg-amber-50 border border-amber-200 text-xs text-amber-800">
                Is subject ke liye abhi MCQs available nahi hain.
              </p>
            )}
          </section>
        )}

        {started && !finished && currentQuestion && (
          <section className="max-w-3xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {chapterCatalog.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => startQuiz(chapter.chapterNumber)}
                  className={`text-xs px-3 py-1.5 rounded border ${selectedChapter === chapter.chapterNumber ? "bg-navy-600 text-white border-navy-600" : "bg-white text-slate-700 border-slate-200"}`}
                >
                  Ch {chapter.chapterNumber}
                </button>
              ))}
              <button
                onClick={() => startQuiz("all")}
                className={`text-xs px-3 py-1.5 rounded border ${selectedChapter === "all" ? "bg-navy-600 text-white border-navy-600" : "bg-white text-slate-700 border-slate-200"}`}
              >
                All
              </button>
            </div>
            <div className="edu-card p-5 sm:p-7 space-y-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-500">
                    Question {currentIndex + 1}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-navy-900 mt-1 leading-relaxed">
                    {currentQuestion.question}
                  </h2>
                </div>
                <Shuffle className="w-5 h-5 text-navy-500 shrink-0" />
              </div>
              {currentQuestion.codeSnippet && (
                <pre className="p-3 bg-slate-50 border border-slate-200 rounded text-xs overflow-x-auto whitespace-pre-wrap">
                  {currentQuestion.codeSnippet}
                </pre>
              )}
              <div className="grid gap-3">
                {currentQuestion.quizOptions.map((option, index) => {
                  const selected = currentAnswer?.selectedIndex === index;
                  return (
                    <button
                      key={`${currentQuestion.id}-${index}`}
                      aria-pressed={selected}
                      onClick={() => chooseAnswer(index)}
                      className={`p-3 rounded border text-left text-sm transition-colors ${selected ? "bg-navy-50 border-navy-500 text-navy-900 font-semibold" : "bg-white border-slate-200 text-slate-700 hover:border-navy-300"}`}
                    >
                      <span className="inline-flex w-6 h-6 items-center justify-center rounded bg-slate-100 text-xs font-bold mr-2">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <button
                  onClick={() =>
                    setCurrentIndex((index) => Math.max(0, index - 1))
                  }
                  disabled={currentIndex === 0}
                  className="inline-flex items-center gap-1 min-h-12 text-xs font-semibold text-slate-600 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-[11px] text-slate-500">
                  Answers can be changed before the final result.
                </span>
                <button
                  onClick={nextQuestion}
                  disabled={!currentAnswer}
                  className="min-h-12 inline-flex items-center gap-1 px-4 py-2 rounded bg-navy-600 text-white text-xs font-semibold disabled:opacity-40"
                >
                  {currentIndex === quiz.length - 1 ? "View Result" : "Next"}{" "}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        )}

        {finished && (
          <section className="max-w-3xl mx-auto space-y-5">
            <div className="edu-card p-7 text-center bg-emerald-50 border-emerald-200">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-600 mb-2" />
              <h2 className="text-2xl font-bold text-navy-900">
                Quiz Complete
              </h2>
              <p className="text-sm text-slate-700 mt-2">
                Aap ka score:{" "}
                <strong>
                  {score} / {quiz.length}
                </strong>
              </p>
              <button
                onClick={() => startQuiz(selectedChapter)}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded bg-navy-600 text-white text-xs font-semibold"
              >
                <RotateCcw className="w-4 h-4" /> Dobara Random Quiz
              </button>
            </div>
            <div className="space-y-3">
              {quiz.map((question, index) => {
                const answer = answers[question.id];
                const correct = answer?.correct;
                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded border ${correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}
                  >
                    <div className="flex gap-2">
                      <span className="font-bold text-xs">{index + 1}.</span>
                      <div className="text-sm font-semibold text-navy-900">
                        {question.question}
                        <div className="mt-2 text-xs font-normal text-slate-700">
                          Your answer:{" "}
                          {answer
                            ? question.quizOptions[answer.selectedIndex]
                            : "Not answered"}
                        </div>
                        <div className="text-xs font-semibold text-emerald-800 mt-1">
                          Correct answer:{" "}
                          {question.quizOptions[question.quizCorrectIndex]}
                        </div>
                        <div className="text-xs text-slate-600 mt-2">
                          <HelpCircle className="inline w-3.5 h-3.5 mr-1" />
                          {question.explanation}
                        </div>
                      </div>
                      {correct ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
