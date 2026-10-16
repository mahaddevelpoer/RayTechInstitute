'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowLeft, ShieldCheck, Download, ExternalLink } from 'lucide-react';
import { BlogPostItem } from '@/types/educational';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';
import { sanitizeUrl } from '@/utils/security';
import { serializeJsonLd } from '@/utils/seo';

interface BlogDetailClientViewProps {
  slug: string;
  initialPost?: BlogPostItem;
}

export function BlogDetailClientView({ slug, initialPost }: BlogDetailClientViewProps) {
  const post = initialPost || null;
  const fallbackImage = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80';

  if (!post) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-navy-900 mb-2">Article Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested article &quot;{slug}&quot; was not found or has been moved.
        </p>
        <Link href="/blogs" className="btn-primary text-xs py-2 px-4 inline-flex">
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Back to All Updates</span>
        </Link>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.datePublished,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'RayTech Institute',
    },
    image: post.featuredImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://raytechinstitute.web.app/blogs/${slug}/`,
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://raytechinstitute.web.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Updates & Bulletins',
        item: 'https://raytechinstitute.web.app/blogs/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://raytechinstitute.web.app/blogs/${slug}/`,
      },
    ],
  };

  return (
    <>
      {/* Schema Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbLd) }}
      />

      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href="/blogs">Updates</Link>
        <span>/</span>
        <span className="text-slate-700 truncate max-w-xs">{post.title}</span>
      </nav>

      {/* Back Button */}
      <div className="mb-4">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-xs text-navy-600 hover:text-navy-800 font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Updates</span>
        </Link>
      </div>

      {/* Article Meta */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-3">
        <span className="badge-primary">{post.category}</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{post.datePublished}</span>
        </span>
        <span>&bull;</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{post.readTime}</span>
        </span>
        <span>&bull;</span>
        <span className="flex items-center gap-1">
          <User className="w-3.5 h-3.5" />
          <span>{post.author}</span>
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 leading-snug mb-4">
        {post.title}
      </h1>

      {/* GEO / AEO Summary Box */}
      <div className="p-4 bg-navy-50 border-l-4 border-navy-600 rounded-r mb-6 text-xs text-slate-700 leading-relaxed">
        <div className="font-semibold text-navy-800 mb-1">
          Summary / Quick Overview
        </div>
        <p>{post.excerpt}</p>
      </div>

      {/* Optional Admin Action / Download Button (Top Bar) */}
      {post.actionButtonText && post.actionButtonUrl && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Official Document / Portal Link Attached</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Access the verified notification file, date sheet, or official link.
            </p>
          </div>

          <a
            href={sanitizeUrl(post.actionButtonUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-semibold transition-colors shadow"
          >
            <span>{post.actionButtonText}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Featured Image */}
      <div className="aspect-[16/9] w-full rounded overflow-hidden bg-slate-100 mb-8 border border-slate-200">
        <img
          src={sanitizeUrl(post.featuredImage) || fallbackImage}
          alt={post.title}
          width={800}
          height={450}
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      {/* Article Body with Full AI Markdown Support */}
      <div className="bg-white rounded-lg py-2">
        <MarkdownRenderer content={post.content} />
      </div>

      {/* Optional Admin Action / Download Button (Bottom CTA) */}
      {post.actionButtonText && post.actionButtonUrl && (
        <div className="mt-8 p-5 bg-navy-50 border border-navy-200 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-navy-900">
              Need Direct Access to this Notification?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Open the verified board document, official download mirror, or registration portal.
            </p>
          </div>

          <a
            href={sanitizeUrl(post.actionButtonUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs py-2.5 px-5 flex items-center gap-2 rounded-md font-semibold shrink-0"
          >
            <span>{post.actionButtonText}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Tags */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified Board Information</span>
        </div>
      </div>
    </>
  );
}
