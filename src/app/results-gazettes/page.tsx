import { siteUrl } from "@/lib/site";
import React from "react";
import { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultsGazettesClientView } from "@/components/educational/ResultsGazettesClientView";
import { INITIAL_GAZETTES } from "@/data/staticCatalog";
import { serializeJsonLd, buildSeoTitle } from "@/utils/seo";

export const metadata: Metadata = {
  title: buildSeoTitle("Class-wise Results and Examination Gazettes"),
  description:
    "Find class-wise result gazettes, board verification links and PDF resources. Check the original examination board for notices and updates.",
  alternates: {
    canonical: siteUrl("/results-gazettes/"),
  },
  openGraph: {
    title: buildSeoTitle("Class-wise Results and Examination Gazettes"),
    description:
      "Find class-wise result gazettes, board verification links and PDF resources. Check the original examination board for notices and updates.",
    url: siteUrl("/results-gazettes/"),
    type: "website",
  },
};

export default function ResultsGazettesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Class-wise Examination Result Gazettes",
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
      educationalLevel: "School and college education",
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
