import { siteUrl } from "@/lib/site";
import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BlogsClientView } from "@/components/educational/BlogsClientView";
import { INITIAL_BLOGS } from "@/data/staticCatalog";
import { serializeJsonLd } from "@/utils/seo";

export const metadata: Metadata = {
  title: "Date Sheets, Admissions & Academic Updates | RayTech",
  description:
    "Verified educational news, board examination date sheets, college and university admissions notifications, and student career counseling roadmaps.",
  alternates: {
    canonical: siteUrl("/blogs/"),
  },
  openGraph: {
    title: "Date Sheets, Admissions & Academic Updates | RayTech",
    description:
      "Verified educational news, board examination date sheets, college and university admissions notifications, and student career counseling roadmaps.",
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
      "Verified academic notifications, school and college date sheets, university admissions alerts, and career roadmaps.",
    blogPost: INITIAL_BLOGS.map((b) => ({
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
