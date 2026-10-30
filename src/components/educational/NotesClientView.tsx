"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  INITIAL_CLASSES,
  INITIAL_NOTES,
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
} from "@/data/staticCatalog";
import { PdfResourceActions } from "./PdfResourceActions";
import { chapterDisplayLabel, chapterPlacement, usesChapterBooks } from '@/utils/chapter-books';
import type { ChapterItem, NoteItem } from '@/types/educational';
import { BookNotesDirectory } from './BookNotesDirectory';

export function NotesClientView({
  classSlug,
  subjectSlug,
}: {
  classSlug: string;
  subjectSlug: string;
}) {
  const [query, setQuery] = useState("");
  const [chapter, setChapter] = useState("all");
  const [book, setBook] = useState("all");
  const bookLayout = usesChapterBooks(classSlug, subjectSlug);
  const chapterForNote = (note: NoteItem) => INITIAL_CHAPTERS.find(item => item.classSlug === classSlug && item.subjectSlug === subjectSlug && item.chapterNumber === note.chapterNumber) || { ...note, title: note.chapterTitle };
  const currentClass = INITIAL_CLASSES.find((c) => c.slug === classSlug);
  const subject = INITIAL_SUBJECTS.find(
    (s) => s.classSlug === classSlug && s.slug === subjectSlug,
  );
  const notes = useMemo(
    () =>
      INITIAL_NOTES.filter(
        (n) => n.classSlug === classSlug && n.subjectSlug === subjectSlug,
      ).sort((a, b) => a.chapterNumber - b.chapterNumber),
    [classSlug, subjectSlug],
  );
  const directoryChapters: ChapterItem[] = INITIAL_CHAPTERS.filter(item => item.classSlug === classSlug && item.subjectSlug === subjectSlug && item.isActive !== false);
  // A published document remains discoverable if its chapter catalog entry is missing.
  for (const note of notes) {
    if (!directoryChapters.some(item => item.chapterNumber === note.chapterNumber)) directoryChapters.push({ id: `note-chapter-${note.chapterNumber}`, classSlug, subjectSlug, chapterNumber: note.chapterNumber, title: note.chapterTitle, isActive: true });
  }
  const chapters = Array.from(new Set((bookLayout ? directoryChapters : notes).map(item => item.chapterNumber))).sort((a, b) => a - b);
  const books = Array.from(new Map(directoryChapters.map(item => { const placement = chapterPlacement(item); return [placement?.bookId, placement]; })).values()).filter(item => item !== null);
  const filtered = notes.filter(
    (n) =>
      (chapter === "all" || String(n.chapterNumber) === chapter) &&
      (book === "all" || chapterPlacement(chapterForNote(n))?.bookId === book) &&
      `${n.title} ${n.chapterTitle} ${n.description} ${chapterDisplayLabel(chapterForNote(n))}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
  const renderNote = (note: NoteItem) => {
    const href = `/classes/${classSlug}/${subjectSlug}/notes/${note.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`;
    return (
      <article key={note.id} className="edu-card p-5 sm:p-6">
        <p className="text-sm font-semibold text-navy-700">
          {chapterDisplayLabel(chapterForNote(note))}
        </p>
        <h2 className="mt-2 text-xl font-bold text-navy-900">
          <a href={href}>{note.title}</a>
        </h2>
        <p className="my-3 text-sm leading-7 text-slate-600">
          {note.description}
        </p>
        <p className="mb-4 text-xs text-slate-500">
          {note.lastUpdated && (
            <>
              Updated{" "}
              <time dateTime={note.lastUpdated}>{note.lastUpdated}</time>
            </>
          )}
          {note.fileSize && <> · File size: {note.fileSize}</>}
        </p>
        <PdfResourceActions
          pdfUrl={note.pdfUrl}
          title={note.title}
          detailHref={href}
        />
      </article>
    );
  };
  return (
    <main id="main-content" tabIndex={-1} className="page-main flex-1">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/classes/">Classes</Link>
        <span>/</span>
        <Link href={`/classes/${classSlug}/`}>{currentClass?.title}</Link>
        <span>/</span>
        <Link href={`/classes/${classSlug}/${subjectSlug}/`}>
          {subject?.title}
        </Link>
        <span>/</span>
        <span aria-current="page">Notes</span>
      </nav>
      <h1 className="text-3xl font-bold text-navy-900">
        {currentClass?.title} {subject?.title} Chapter Notes
      </h1>
      <p className="mt-3 text-base text-slate-600">
        {bookLayout ? "Choose a book and chapter to find chapter notes and MCQ revision notes. Open a document to read its guide, preview the PDF or revise offline." : "Choose a chapter, read the study guide and open the available document for offline revision."}
      </p>
      <div className="my-6 grid gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
        <label className="text-sm font-semibold text-slate-700">
          Search notes
          <input
            type="search"
            className="study-input mt-2"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chapter name or topic"
          />
        </label>
        {bookLayout && <label className="text-sm font-semibold text-slate-700">Book<select aria-label="Book" className="study-input mt-2" value={book} onChange={event => { setBook(event.target.value); setChapter('all'); }}><option value="all">All books</option>{books.map(item => <option key={item!.bookId} value={item!.bookId}>{item!.bookTitle}</option>)}</select></label>}
        <label className="text-sm font-semibold text-slate-700">
          Chapter
          <select
            className="study-input mt-2"
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
          >
            <option value="all">All chapters</option>
            {chapters.filter(number => book === 'all' || directoryChapters.some(item => item.chapterNumber === number && chapterPlacement(item)?.bookId === book)).map((n) => (
              <option key={n} value={n}>
                {bookLayout ? chapterDisplayLabel(directoryChapters.find(item => item.chapterNumber === n)!) : `Chapter ${n}`}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p role="status" className="mb-4 text-sm text-slate-600">
        {filtered.length} study{" "}
        {filtered.length === 1 ? "resource" : "resources"} available
      </p>
      <div className="space-y-4">
        {bookLayout ? <BookNotesDirectory
          chapters={directoryChapters.filter(item => (book === 'all' || chapterPlacement(item)?.bookId === book) && (chapter === 'all' || String(item.chapterNumber) === chapter) && (!query.trim() || filtered.some(note => note.chapterNumber === item.chapterNumber)))}
          notes={filtered}
          renderNote={renderNote}
        /> : filtered.map(renderNote)}
      </div>
      {!filtered.length && (
        <div className="rounded-lg border border-slate-200 p-8">
          <h2 className="text-lg font-bold text-navy-900">
            {notes.length ? "No matching notes" : "Notes are not available yet"}
          </h2>
          <p className="my-3 text-sm text-slate-600">
            {notes.length
              ? "Try another chapter or a shorter search."
              : "You can explore the subject hub for other study resources."}
          </p>
          {notes.length ? (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setQuery("");
                setChapter("all");
                setBook("all");
              }}
            >
              Clear filters
            </button>
          ) : (
            <Link
              className="btn-outline"
              href={`/classes/${classSlug}/${subjectSlug}/`}
            >
              Open subject hub
            </Link>
          )}
        </div>
      )}
    </main>
  );
}
