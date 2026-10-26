import { siteUrl } from "@/lib/site";
import { DEFAULT_SOCIAL_IMAGE } from '@/data/social';
import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogsClientView } from "@/components/educational/BlogsClientView";
import { INITIAL_BLOGS } from "@/data/staticCatalog";
import { serializeJsonLd } from "@/utils/seo";
import { needsSourceReview } from '@/utils/editorial';

export const metadata: Metadata = {
  title: "Date Sheets, Admissions & Academic Updates | RayTech",
  description:
    "Browse educational updates, board date sheets, admissions notices and study guidance. Check the issuing institution for current confirmations.",
  alternates: {
    canonical: siteUrl("/blogs/"),
  },
  openGraph: {
    images: [DEFAULT_SOCIAL_IMAGE],
    title: "Date Sheets, Admissions & Academic Updates | RayTech",
    description:
      "Browse educational updates, board date sheets, admissions notices and study guidance. Check the issuing institution for current confirmations.",
    url: siteUrl("/blogs/"),
    type: "website",
  },
};

export default function BlogsIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "RayTech Educational Portal : News, Date Sheets & Admission Updates",
    description:
      "Educational updates with source links, examination notices, admissions information and study guidance.",
    blogPost: INITIAL_BLOGS.filter(b => !needsSourceReview(b.content)).map((b) => ({
      "@type": "BlogPosting",
      headline: b.title,
      description: b.excerpt,
      datePublished: b.datePublished,
      author: {
        "@type": "Person",
        name: b.author,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main id="main-content" tabIndex={-1} className="page-main flex-1">
        {/* SEO Blog Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />

        <BlogsClientView />
      </main>

      <Footer />
    </div>
  );
}
