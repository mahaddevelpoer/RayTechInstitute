import { siteUrl } from "@/lib/site";
import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ClassesClientView } from "@/components/educational/ClassesClientView";
import { serializeJsonLd, buildSeoTitle } from "@/utils/seo";

export const metadata: Metadata = {
  title: buildSeoTitle("11th and 12th Class Notes and Past Papers"),
  description:
    "Access complete intermediate study resources for 11th and 12th class, including chapter notes in PDF, interactive MCQs tests, and board past papers.",
  alternates: {
    canonical: siteUrl("/classes/"),
  },
  openGraph: {
    title: buildSeoTitle("11th and 12th Class Notes and Past Papers"),
    description:
      "Access complete intermediate study resources for 11th and 12th class, including chapter notes in PDF, interactive MCQs tests, and board past papers.",
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
