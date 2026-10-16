'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { EducationalStore } from '@/data/educationalStore';
import { BlogPostItem } from '@/types/educational';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Link from 'next/link';

// The 3 hardcoded slugs that have their own static pages: redirect to them
const STATIC_BLOG_SLUGS = [
  'punjab-boards-inter-date-sheet-2026',
  'fast-nuces-punjab-university-admissions-2026',
  'computer-science-vs-software-engineering-career-guide',
];

function BlogPostContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const slug = searchParams.get('slug') ?? '';

  const [post, setPost] = useState<BlogPostItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      router.replace('/blogs');
      return;
    }

    // If it's one of the static pre-rendered slugs, redirect to the proper page
    if (STATIC_BLOG_SLUGS.includes(slug)) {
      router.replace(`/blogs/${slug}`);
      return;
    }

    async function load() {
      setLoading(true);
      // 1. Try local cache first (fast)
      const cached = EducationalStore.getBlogs().find((b) => b.slug === slug);
      if (cached) {
        setPost(cached);
        setLoading(false);
        return;
      }

      // 2. Sync from Supabase then retry
      await EducationalStore.syncFromSupabase();
      const fresh = EducationalStore.getBlogs().find((b) => b.slug === slug);
      if (fresh) {
        setPost(fresh);
      } else {
        setNotFound(true);
      }
      setLoading(false);
    }

    load();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-navy-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-500 text-sm">Loading article...</p>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl font-bold text-navy-900 mb-2">Article Not Found</h1>
        <p className="text-slate-500 text-sm mb-6">
          This article may have been removed or the link is incorrect.
        </p>
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-navy-600 hover:text-navy-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Blogs
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto w-full">
      {/* Breadcrumb */}
      <nav className="breadcrumb mb-6">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/blogs">Blogs</Link>
        <span>/</span>
        <span className="text-slate-700 truncate max-w-[200px]">{post.title}</span>
      </nav>

      {/* Back link */}
      <Link
        href="/blogs"
        className="inline-flex items-center gap-1.5 text-sm text-navy-600 hover:text-navy-800 mb-6 font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        All Articles
      </Link>

      {/* Hero Image */}
      {post.featuredImage && (
        <div className="relative aspect-video rounded-lg overflow-hidden mb-8 bg-slate-100">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
            width={800}
            height={450}
            loading="eager"
          />
          <span className="absolute top-3 left-3 badge-primary">{post.category}</span>
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          {post.datePublished}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {post.readTime}
        </span>
        <span className="font-medium text-slate-700">{post.author}</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 leading-tight mb-4">
        {post.title}
      </h1>

      {/* Excerpt / summary */}
      {post.excerpt && (
        <p className="text-base text-slate-600 leading-relaxed mb-6 border-l-4 border-navy-300 pl-4 italic">
          {post.excerpt}
        </p>
      )}

      {/* Markdown Content */}
      <div className="prose-educational">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap gap-2 items-center">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <meta name="robots" content="noindex, nofollow, noarchive" />
      <Header />
      <main className="flex-1 py-10 px-4 sm:px-6">
        <Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-navy-600 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <BlogPostContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
