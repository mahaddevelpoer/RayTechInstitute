import { siteUrl } from "@/lib/site";
import { withSocialMetadata } from '@/utils/social-metadata';
import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, ArrowLeft } from "lucide-react";
import { buildSeoTitle } from "@/utils/seo";

export const metadata = withSocialMetadata({
  title: buildSeoTitle("Terms and Conditions for RayTech students"),
  description:
    "Read the terms, content-use rules, source-link guidance, and educational disclaimer for the RayTech Institute study archive.",
  alternates: {
    canonical: siteUrl("/terms-and-conditions/"),
  },
});

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main
        id="main-content"
        tabIndex={-1}
        className="legal-page flex-1 py-10 px-4 sm:px-6 max-w-4xl mx-auto w-full"
      >
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Terms &amp; Conditions</span>
        </nav>

        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-navy-600 hover:text-navy-800 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 badge-primary mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Academic Guidelines &bull; Usage Policy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-1">
            Terms &amp; Conditions
          </h1>
          <p className="text-xs text-slate-500">Last Updated: October 2026</p>
        </div>

        <nav className="legal-contents" aria-label="On this page"><h2>On this page</h2><ol>{["1. Acceptance of Terms","2. Intellectual Property & Educational Materials","3. In-Browser Python Terminal Usage","4. Disclaimer of Warranty"].map((title,index)=><li key={title}><a href={`#policy-section-${index+1}`}>{title}</a></li>)}</ol></nav>
        <div className="edu-card p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 id="policy-section-1" className="text-lg font-bold text-navy-900">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing RayTech Institute, you agree to comply with and be
              bound by these Terms and Conditions. All content provided is
              strictly for personal educational study, preparation for board
              examinations, and academic reference.
            </p>
          </section>

          <section className="space-y-2">
            <h2 id="policy-section-2" className="text-lg font-bold text-navy-900">
              2. Intellectual Property &amp; Educational Materials
            </h2>
            <p>
              All original lecture notes, curated MCQs testing questions, and
              video guides are the property of RayTech Institute. Official
              examination past papers and result gazettes originate from
              respective educational boards (PBCC and FBISE) and are indexed for
              public academic reference.
            </p>
          </section>

          <section className="space-y-2">
            <h2 id="policy-section-3" className="text-lg font-bold text-navy-900">
              3. In-Browser Python Terminal Usage
            </h2>
            <p>
              The integrated Pyodide compiler sandbox is provided free of charge
              for students to test curriculum algorithms and data structures.
              Automated abuse, stress testing, or malicious code injection
              attempts are strictly prohibited.
            </p>
          </section>

          <section className="space-y-2">
            <h2 id="policy-section-4" className="text-lg font-bold text-navy-900">
              4. Disclaimer of Warranty
            </h2>
            <p>
              While every effort is made to maintain complete syllabus accuracy
              and error-free past papers, RayTech Institute provides all
              materials on an &ldquo;as-is&rdquo; basis. Students are encouraged
              to cross-reference with official board textbooks.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
