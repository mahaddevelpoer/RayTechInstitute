"use client";

import React, { useState } from "react";
import Link from "next/link";
import { INITIAL_GAZETTES, INITIAL_CLASSES } from "@/data/staticCatalog";
import { BOARDS } from "@/data/boards";
import { BoardDirectory } from "./BoardDirectory";
import { PdfResourceActions } from "./PdfResourceActions";
import { sanitizeUrl } from "@/utils/security";

export function ResultsGazettesClientView() {
  const [board, setBoard] = useState("all");
  const [grade, setGrade] = useState("all");
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const years = Array.from(new Set(INITIAL_GAZETTES.map((g) => g.year))).sort(
    (a, b) => b - a,
  );
  const gazettes = INITIAL_GAZETTES.filter(
    (g) =>
      (board === "all" || g.board === board) &&
      (grade === "all" || g.classSlug === grade) &&
      (year === "all" || String(g.year) === year) &&
      `${g.title} ${g.board} ${g.year}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  ).sort((a, b) => b.year - a.year);
  const reset = () => {
    setBoard("all");
    setGrade("all");
    setYear("all");
    setQuery("");
  };
  return (
    <>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span aria-current="page">Results &amp; Gazettes</span>
      </nav>
      <h1 className="text-3xl font-bold text-navy-900">
        Punjab Boards &amp; FBISE Result Gazettes
      </h1>
      <p className="mt-3 text-base leading-7 text-slate-600">
        Find your board, open available gazettes and follow the original board
        link to check marks.
      </p>
      <Link
        href="/results-gazettes/first-year-result/"
        className="my-6 flex items-center justify-between gap-4 rounded-lg border border-navy-200 bg-navy-50 p-5 text-navy-900"
      >
        <span>
          <strong className="block text-lg">1st year result 2026 guide</strong>
          <span className="mt-1 block text-sm">
            Board links, date verification, roll-number steps and help after
            results.
          </span>
        </span>
        <span aria-hidden="true">→</span>
      </Link>
      <section aria-labelledby="gazette-filter-title">
        <h2
          id="gazette-filter-title"
          className="text-xl font-bold text-navy-900"
        >
          Find a gazette
        </h2>
        <div className="my-5 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-sm font-semibold">
            Search
            <input
              className="study-input mt-2"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Board, title or year"
            />
          </label>
          <label className="text-sm font-semibold">
            Board
            <select
              className="study-input mt-2"
              value={board}
              onChange={(e) => setBoard(e.target.value)}
            >
              <option value="all">All boards</option>
              {BOARDS.map((b) => (
                <option key={b.name}>{b.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Class
            <select
              className="study-input mt-2"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
            >
              <option value="all">All classes</option>
              {Array.from(new Set([...INITIAL_CLASSES.map(c => c.slug), ...INITIAL_GAZETTES.map(g => g.classSlug)])).map(slug => <option key={slug} value={slug}>{INITIAL_CLASSES.find(c => c.slug === slug)?.title || slug.replace(/-/g, ' ')}</option>)}
            </select>
          </label>
          <label className="text-sm font-semibold">
            Year
            <select
              className="study-input mt-2"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="all">All years</option>
              {years.map((y) => (
                <option key={y}>{y}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <p role="status" className="text-sm text-slate-600">
            {gazettes.length} matching{" "}
            {gazettes.length === 1 ? "gazette" : "gazettes"}
          </p>
          <button type="button" onClick={reset} className="btn-outline text-sm">
            Clear filters
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {gazettes.map((g) => {
            const href = `/results-gazettes/${g.id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}/`;
            return (
              <article key={g.id} className="edu-card p-5">
                <p className="text-sm font-semibold text-navy-700">{g.board}</p>
                <h3 className="my-2 text-lg font-bold text-navy-900">
                  <Link href={href}>{g.title}</Link>
                </h3>
                <p className="mb-4 text-sm text-slate-600">
                  {g.year} · Session: {g.session}
                </p>
                <PdfResourceActions
                  pdfUrl={g.pdfUrl}
                  title={g.title}
                  detailHref={href}
                />
                {sanitizeUrl(g.directResultUrl) && (
                  <a
                    className="mt-4 inline-flex min-h-12 items-center text-sm font-semibold text-navy-700 underline"
                    href={sanitizeUrl(g.directResultUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit result source
                  </a>
                )}
              </article>
            );
          })}
        </div>
        {!gazettes.length && (
          <div className="rounded-lg border border-slate-200 p-6 text-sm leading-7 text-slate-600">
            <h3 className="font-bold text-navy-900">
              No matching gazette has been added
            </h3>
            <p>
              Try clearing the filters or visit your board using the directory
              below. A missing PDF here does not mean the board has not
              announced a result.
            </p>
          </div>
        )}
      </section>
      <BoardDirectory />
    </>
  );
}
