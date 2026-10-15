'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EducationalStore } from '@/data/educationalStore';
import { BlogPostItem } from '@/types/educational';
import { Calendar, Clock, ArrowRight } from 'lucide-react';

export function BlogsClientView() {
  // 1. Instant 0ms Static First Render (Zero DB wait, Zero flicker)
  const [blogs, setBlogs] = useState<BlogPostItem[]>(() => EducationalStore.getBlogs());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setBlogs(EducationalStore.getBlogs());
  }, []);

  const filteredBlogs =
    selectedCategory === 'all'
      ? blogs
      : blogs.filter((b) => b.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Updates' },
    { id: 'date-sheets', label: 'Date Sheets' },
    { id: 'admissions', label: 'Admission Alerts' },
    { id: 'career-guides', label: 'Career Guides' },
  ];

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
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-2">
          Educational News &amp; Updates
        </h1>
        <p className="text-slate-600 text-sm">
          Official board date sheets, university admissions, and career counseling guides for Pakistani students.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`text-xs px-3.5 py-1.5 rounded font-medium transition-colors ${
              selectedCategory === c.id
                ? 'bg-navy-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

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
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
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
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <h2 className="font-bold text-navy-900 text-base mb-2 line-clamp-2 hover:text-navy-600 transition-colors">
                  <Link href={getBlogHref(post.slug)}>
                    {post.title}
                  </Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {post.excerpt}
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
