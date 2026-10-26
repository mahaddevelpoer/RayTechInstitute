import { siteUrl } from "@/lib/site";
import { DEFAULT_SOCIAL_IMAGE } from '@/data/social';
import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClassesClientView } from "@/components/educational/ClassesClientView";
import { serializeJsonLd, buildSeoTitle } from "@/utils/seo";

export const metadata: Metadata = {
  title: buildSeoTitle("Class Study Notes, MCQs and Past Papers"),
  description:
    "Choose your class and subject to find notes, chapter-wise MCQs and past papers. Browse available study resources and programming courses.",
  alternates: {
    canonical: siteUrl("/classes/"),
  },
  openGraph: {
    images: [DEFAULT_SOCIAL_IMAGE],
    title: buildSeoTitle("Class Study Notes, MCQs and Past Papers"),
    description:
      "Choose your class and subject to find notes, chapter-wise MCQs and past papers. Browse available study resources and programming courses.",
    url: siteUrl("/classes/"),
    type: "website",
  },
};

export default function ClassesIndexPage() {
  const jsonLd = {
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
        name: "Academic Classes",
        item: siteUrl("/classes/"),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main id="main-content" tabIndex={-1} className="page-main flex-1">
        {/* SEO Breadcrumbs Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />

        <ClassesClientView />
      </main>

      <Footer />
    </div>
  );
}
