"use client";

import {blogCategoryLabel} from '@/data/blogCategories';
import { siteUrl } from "@/lib/site";

import React, { useState } from "react";
import {
  articleSections,
  readingMinutes,
  needsSourceReview,
} from "@/utils/editorial";
import Link from "next/link";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ShieldCheck,
  Download,
  ExternalLink,
} from "lucide-react";
import { BlogPostItem } from "@/types/educational";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { AdReservation } from '@/components/AdReservation';
import { sanitizeUrl } from "@/utils/security";
import { serializeJsonLd } from "@/utils/seo";
import { ArticleAttachment } from './ArticleAttachment';

interface BlogDetailClientViewProps {
  slug: string;
  initialPost?: BlogPostItem;
}

export function BlogDetailClientView({
  slug,
  initialPost,
}: BlogDetailClientViewProps) {
  const post = initialPost || null;
  const [copyStatus, setCopyStatus] = useState("");
  const fallbackImage = "/android-chrome-512x512.png";

  if (!post) {
    return (
      <div className="py-16 text-center max-w-md mx-auto">
        <h2 className="text-xl font-bold text-navy-900 mb-2">
          Article Not Found
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          The requested article &quot;{slug}&quot; was not found or has been
          moved.
        </p>
        <Link
          href="/blogs"
          className="btn-primary text-xs py-2 px-4 inline-flex"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          <span>Back to All Updates</span>
        </Link>
      </div>
    );
  }

  const sourceReview = needsSourceReview(post.content);
  const sections = sourceReview ? [] : articleSections(post.content);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: sourceReview
      ? "This article is awaiting source verification. Consult the current result guide and official board notices."
      : post.excerpt,
    datePublished: post.datePublished,
    author: {
      "@type": post.author === "RayTech Institute" ? "Organization" : "Person",
      name: post.author,
    },
    publisher: {
      "@type": "Organization",
      name: "RayTech Institute",
    },
    image: sourceReview
      ? siteUrl(fallbackImage)
      : post.featuredImage.startsWith("/")
        ? siteUrl(post.featuredImage)
        : post.featuredImage,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": siteUrl(`/blogs/${slug}/`),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Updates & Bulletins",
        item: siteUrl("/blogs/"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: siteUrl(`/blogs/${slug}/`),
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
        <span className="badge-primary">{blogCategoryLabel(post.category)}</span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{post.datePublished}</span>
        </span>
        <span>&bull;</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>
            {sourceReview
              ? "Source review pending"
              : `${readingMinutes(post.content)} min read`}
          </span>
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
        <p>
          {sourceReview
            ? "This article is awaiting source verification. Earlier result claims should not be relied on. Use the current result guide and official board notices."
            : post.excerpt}
        </p>
      </div>

      {/* Optional Admin Action / Download Button (Top Bar) */}
      {post.actionButtonText && sanitizeUrl(post.actionButtonUrl) && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div>
            <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Download className="w-4 h-4 text-emerald-700" />
              <span>Source link supplied by the editor</span>
            </div>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Check the source, publication date and examination session before
              relying on it.
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
      {post.actionButtonUrl&&<ArticleAttachment url={post.actionButtonUrl} label={post.actionButtonText||'Source document'}/>}
      <div className="aspect-[16/9] w-full rounded overflow-hidden bg-slate-100 mb-8 border border-slate-200">
        <img
          src={
            sourceReview
              ? fallbackImage
              : sanitizeUrl(post.featuredImage) || fallbackImage
          }
          alt={post.title}
          width={800}
          height={450}
          loading="eager"
          decoding="async"
          fetchPriority="high"
          className="w-full h-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = fallbackImage;
          }}
        />
      </div>

      {sections.length > 1 && (
        <nav
          aria-label="Article contents"
          className="my-6 rounded-lg border border-slate-200 bg-slate-50 p-5"
        >
          <h2 className="font-bold text-navy-900">On this page</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-block py-1 text-navy-700 underline"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="my-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="btn-outline text-sm"
          onClick={() => window.print()}
        >
          Print article
        </button>
        <button
          type="button"
          className="btn-outline text-sm"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              setCopyStatus("Link copied.");
            } catch {
              setCopyStatus("Copy the address from your browser to share.");
            }
          }}
        >
          Copy article link
        </button>
        <span role="status" className="text-sm text-slate-600">
          {copyStatus}
        </span>
      </div>
      {/* Article Body with Full AI Markdown Support */}
      <div className="bg-white rounded-lg py-2">
        {sourceReview ? (
          <aside className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
            <h2 className="text-lg font-bold">
              This article needs a source review
            </h2>
            <p>
              Earlier text included result claims we cannot currently verify. It
              has been withheld while the editor checks the original notices.
            </p>
            <Link
              href="/results-gazettes/first-year-result/"
              className="mt-3 inline-flex min-h-12 items-center font-semibold underline"
            >
              Read the current result guidance and official board links
            </Link>
          </aside>
        ) : (
          <MarkdownRenderer content={post.content} />
        )}
      </div>

      <AdReservation placement="article" />
      {/* Optional Admin Action / Download Button (Bottom CTA) */}
      {post.actionButtonText && sanitizeUrl(post.actionButtonUrl) && (
        <div className="mt-8 p-5 bg-navy-50 border border-navy-200 rounded-md flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-navy-900">
              Need Direct Access to this Notification?
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Check the original source for the latest instructions and any
              corrections.
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

      <p className="mt-8 text-sm leading-7 text-slate-600">
        Result dates, fees and eligibility must be checked against the board's
        current notice.{" "}
        <Link href="/#contact" className="underline">
          Report a correction
        </Link>{" "}
        with the article URL and original source.
      </p>
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
          <span>Independent educational guidance</span>
        </div>
      </div>
    </>
  );
}
