import { siteUrl } from "@/lib/site";
import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultsGazettesClientView } from "@/components/educational/ResultsGazettesClientView";
import { INITIAL_GAZETTES } from "@/data/staticCatalog";
import { serializeJsonLd, buildSeoTitle } from "@/utils/seo";

export const metadata: Metadata = {
  title: buildSeoTitle("11th and 12th Class Result Gazettes"),
  description:
    "Download official 11th and 12th class result gazettes for BISE Lahore, Gujranwala, Multan, Rawalpindi, and FBISE with PDF mirrors and verification links.",
  alternates: {
    canonical: siteUrl("/results-gazettes/"),
  },
  openGraph: {
    title: buildSeoTitle("11th and 12th Class Result Gazettes"),
    description:
      "Download official 11th and 12th class result gazettes for BISE Lahore, Gujranwala, Multan, Rawalpindi, and FBISE with PDF mirrors and verification links.",
    url: siteUrl("/results-gazettes/"),
    type: "website",
  },
};

export default function ResultsGazettesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Punjab Educational Boards & FBISE Intermediate Result Gazettes",
    description:
      "Official result gazettes in PDF and roll number verification directories for BISE Lahore, Gujranwala, Multan, and Federal Board.",
    publisher: {
      "@type": "Organization",
      name: "Boards of Intermediate and Secondary Education (PBCC & FBISE)",
    },
    mainEntity: INITIAL_GAZETTES.map((g) => ({
      "@type": "LearningResource",
      name: g.title,
      learningResourceType: "Result Gazette",
      educationalLevel: "Intermediate Higher Secondary",
      url: g.pdfUrl,
    })),
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main id="main-content" tabIndex={-1} className="page-main flex-1">
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />

        <ResultsGazettesClientView />
      </main>

      <Footer />
    </div>
  );
}
