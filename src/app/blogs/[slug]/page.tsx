import { withSocialMetadata } from '@/utils/social-metadata';
import { staticExportParams } from "@/utils/staticExport";
import { siteUrl } from "@/lib/site";
import React from "react";
import { notFound } from "next/navigation";
import { needsSourceReview } from "@/utils/editorial";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { INITIAL_BLOGS } from "@/data/staticCatalog";
import { BlogDetailClientView } from "@/components/educational/BlogDetailClientView";
import { buildSeoTitle } from "@/utils/seo";
import { REVIEWED_ARTICLE_COVERS, REVIEWED_ARTICLE_KEYWORDS } from '@/data/reviewedArticleMedia';

export function generateStaticParams() {
  return staticExportParams(
    INITIAL_BLOGS.map((b) => ({
      slug: b.slug,
    })),
    ["slug"],
  );
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = INITIAL_BLOGS.find((b) => b.slug === slug);
  if (!post) {
    return withSocialMetadata({
      title: buildSeoTitle("Educational Bulletin and Update"),
      description:
        "Official board examination alerts, admissions schedules, and academic news.",
      alternates: {
        canonical: siteUrl(`/blogs/${slug}/`),
      },
    });
  }

  const enabled=(key:string)=>post.seo?.enabled?.includes(key);
  const seoTitle = buildSeoTitle(enabled('title')&&post.seo?.title?post.seo.title:post.title);
  const seoDescription = needsSourceReview(post.content)
    ? "This educational update is awaiting source verification. Read current result guidance and check your board notice for the latest confirmed information."
    : enabled('description')&&post.seo?.description?post.seo.description:post.excerpt;

  return withSocialMetadata({
    robots: needsSourceReview(post.content)
      ? { index: false, follow: true }
      : undefined,
    title: seoTitle,
    description: seoDescription,
    keywords: REVIEWED_ARTICLE_KEYWORDS[post.id] || post.tags,
    alternates: {
      canonical: siteUrl(`/blogs/${slug}/`),
    },
    twitter: {card:"summary_large_image",title: enabled("socialTitle")&&post.seo?.socialTitle?post.seo.socialTitle:seoTitle,description:enabled("socialDescription")&&post.seo?.socialDescription?post.seo.socialDescription:seoDescription,images:[enabled("socialImage")&&post.seo?.socialImage&&/^https:\/\//.test(post.seo.socialImage)?post.seo.socialImage:post.featuredImage]},
    openGraph: {
      title: enabled("socialTitle")&&post.seo?.socialTitle?post.seo.socialTitle:seoTitle,
      description: enabled("socialDescription")&&post.seo?.socialDescription?post.seo.socialDescription:seoDescription,
      url: siteUrl(`/blogs/${slug}/`),
      images: [
        {
          url: needsSourceReview(post.content)
            ? siteUrl("/android-chrome-512x512.png")
            : enabled("socialImage")&&post.seo?.socialImage&&/^https:\/\//.test(post.seo.socialImage)?post.seo.socialImage:post.featuredImage,
          width: REVIEWED_ARTICLE_COVERS[post.featuredImage]?.width || 1200,
          height: REVIEWED_ARTICLE_COVERS[post.featuredImage]?.height || 630,
          alt: REVIEWED_ARTICLE_COVERS[post.featuredImage]?.alt || post.title,
        },
      ],
      type: "article",
      publishedTime: post.datePublished,
      authors: [post.author],
    },
  });
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const initialPost = INITIAL_BLOGS.find((b) => b.slug === slug);

  if (!initialPost) notFound();
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 py-10 px-4 sm:px-6 max-w-4xl mx-auto w-full"
      >
        <BlogDetailClientView
          slug={slug}
          initialPost={initialPost}
          coverMetadata={REVIEWED_ARTICLE_COVERS[initialPost.featuredImage]}
          seoKeywords={REVIEWED_ARTICLE_KEYWORDS[initialPost.id]}
        />
      </main>

      <Footer />
    </div>
  );
}
