import React from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { INITIAL_BLOGS } from '@/data/staticCatalog';
import { BlogDetailClientView } from '@/components/educational/BlogDetailClientView';

export function generateStaticParams() {
  return INITIAL_BLOGS.map((b) => ({
    slug: b.slug,
  }));
}

interface PageProps {
  params: {
    slug: string;
  };
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = INITIAL_BLOGS.find((b) => b.slug === params.slug);
  if (!post) {
    return {
      title: 'Educational Bulletin & Update | RayTech Institute',
      description: 'Official board examination alerts, admissions schedules, and academic news.',
      alternates: {
        canonical: `https://raytechinstitute.firebaseapp.com/blogs/${params.slug}/`,
      },
    };
  }

  return {
    title: `${post.title} | RayTech Institute`,
    description: post.excerpt,
    alternates: {
      canonical: `https://raytechinstitute.firebaseapp.com/blogs/${params.slug}/`,
    },
    openGraph: {
      title: `${post.title} | RayTech Institute`,
      description: post.excerpt,
      url: `https://raytechinstitute.firebaseapp.com/blogs/${params.slug}/`,
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

export default function BlogDetailPage({ params }: PageProps) {
  const initialPost = INITIAL_BLOGS.find((b) => b.slug === params.slug);

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <BlogDetailClientView slug={params.slug} initialPost={initialPost} />
      </main>

      <Footer />
    </div>
  );
}
