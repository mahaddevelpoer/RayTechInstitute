"use client";

import {BLOG_CATEGORIES} from '@/data/blogCategories';
import { REVIEWED_ARTICLE_COVERS } from '@/data/reviewedArticleMedia';
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { EducationalStore } from "@/data/educationalStore";
import { readingMinutes, needsSourceReview } from "@/utils/editorial";
import { BlogPostItem } from "@/types/educational";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { sanitizeUrl } from "@/utils/security";

export function BlogsClientView() {
  const fallbackImage = "/android-chrome-512x512.png";
  // 1. Instant 0ms Static First Render (Zero DB wait, Zero flicker)
  const [blogs, setBlogs] = useState<BlogPostItem[]>(() =>
    EducationalStore.getBlogs(),
  );
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setBlogs(EducationalStore.getBlogs());
  }, []);

  const filteredBlogs = blogs
    .filter(
      (b) =>
        (selectedCategory === "all" ||
          (selectedCategory === "results"
            ? /result|gazette/i.test(b.title)
            : b.category === selectedCategory)) &&
        `${b.title} ${b.excerpt} ${b.tags.join(" ")}`
          .toLowerCase()
          .includes(query.trim().toLowerCase()),
    )
    .sort((a, b) => b.datePublished.localeCompare(a.datePublished));

  const categories = [{id:'all',label:'All Updates'},{id:'results',label:'Results'},...BLOG_CATEGORIES];

  // Every published blog is generated at its own slug URL during the build.
  // Keeping one route for all posts prevents newly added articles from being
  // sent to the editor/preview page (`/blogs/post`) by mistake.
  const getBlogHref = (slug: string) => `/blogs/${encodeURIComponent(slug)}`;

  return (
    <>
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span className="text-slate-700">Blogs &amp; Updates</span>
      </nav>

      {/* Header */}
      <div className="page-intro mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Educational News &amp; Updates
        </h1>
        <p className="text-slate-600 text-sm">
          Study updates, admission guidance, and clear explainers on science,
          technology, sport and current affairs for Pakistani learners.
        </p>
      </div>

      <label className="mb-5 block text-sm font-semibold">
        Search educational updates
        <input
          type="search"
          className="study-input mt-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Topic, board or keyword"
        />
      </label>
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c.id}
            aria-pressed={selectedCategory === c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`min-h-12 text-sm px-3.5 py-1.5 rounded font-medium transition-colors ${
              selectedCategory === c.id
                ? "bg-navy-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="mb-4 text-sm text-slate-600" role="status">
        {filteredBlogs.length} matching updates
      </p>
      {!filteredBlogs.length && (
        <div className="my-6 rounded-lg border border-slate-200 p-6">
          <p className="mb-3">No articles match this selection.</p>
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              setQuery("");
              setSelectedCategory("all");
            }}
          >
            Clear filters
          </button>
        </div>
      )}
      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlogs.map((post) => (
          <article
            key={post.id}
            className="edu-card overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Cover Image */}
              <div className="relative aspect-video bg-slate-100 overflow-hidden">
                <img
                  src={
                    needsSourceReview(post.content)
                      ? fallbackImage
                      : sanitizeUrl(post.featuredImage) || fallbackImage
                  }
                  alt={REVIEWED_ARTICLE_COVERS[post.featuredImage]?.alt || post.title}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = fallbackImage;
                  }}
                />
                <span className="absolute top-2 left-2 badge-primary">
                  {post.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5">
                <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{post.datePublished}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{readingMinutes(post.content)} min read</span>
                  </span>
                </div>

                <h2 className="font-bold text-navy-900 text-base mb-2 line-clamp-2 hover:text-navy-600 transition-colors">
                  <Link href={getBlogHref(post.slug)}>{post.title}</Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {needsSourceReview(post.content)
                    ? "Source review pending. Check the current result guide and original board notice before relying on this update."
                    : post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                href={getBlogHref(post.slug)}
                className="inline-flex items-center text-xs font-semibold text-navy-600 hover:text-navy-800 gap-1 pt-3 border-t border-slate-100 w-full justify-between"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
