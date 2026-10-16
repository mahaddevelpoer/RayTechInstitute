import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { INITIAL_BLOGS } from '@/data/staticCatalog';
import { BlogDetailClientView } from '@/components/educational/BlogDetailClientView';
import { buildSeoTitle } from '@/utils/seo';

export function generateStaticParams() {
  return INITIAL_BLOGS.map((b) => ({
    slug: b.slug,
  }));
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = INITIAL_BLOGS.find((b) => b.slug === slug);
  if (!post) {
    return {
      title: buildSeoTitle('Educational Bulletin and Update'),
      description: 'Official board examination alerts, admissions schedules, and academic news.',
      alternates: {
        canonical: `https://raytechinstitute.web.app/blogs/${slug}/`,
      },
    };
  }

  const seoTitle = buildSeoTitle(post.title);
  const seoDescription = post.excerpt.length > 155
    ? `${post.excerpt.slice(0, 152).replace(/\s+\S*$/, '')}...`
    : post.excerpt;

  return {
    title: seoTitle,
    description: seoDescription,
    alternates: {
      canonical: `https://raytechinstitute.web.app/blogs/${slug}/`,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      url: `https://raytechinstitute.web.app/blogs/${slug}/`,
      images: [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.datePublished,
      authors: [post.author],
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const initialPost = INITIAL_BLOGS.find((b) => b.slug === slug);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <BlogDetailClientView slug={slug} initialPost={initialPost} />
      </main>

      <Footer />
    </div>
  );
}
