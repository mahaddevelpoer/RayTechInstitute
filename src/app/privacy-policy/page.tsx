import React from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Shield, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy | RayTech Institute Educational Archive',
  description: 'Official privacy policy regarding educational materials, user data protection, and cookie compliance.',
  alternates: {
    canonical: 'https://raytechinstitute.web.app/privacy-policy/',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col">
      <Header />

      <main className="flex-1 py-10 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <span className="text-slate-700">Privacy Policy</span>
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
            <span>Legal Notice &bull; Student Privacy</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-1">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500">
            Last Updated: October 2026
          </p>
        </div>

        <div className="edu-card p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">1. Introduction</h2>
            <p>
              RayTech Institute operates as a free digital educational repository for Intermediate (11th and 12th Classes) computer science syllabus, notes, MCQs, board past papers, and result gazettes. We are strictly committed to safeguarding the privacy of visiting students and teachers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">2. Information Collection</h2>
            <p>
              We do not sell, rent, or monetize personal student data. We collect only anonymous analytics data necessary for website stability, including standard browser user-agents and page performance metrics.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">3. In-Browser Python Terminal Execution</h2>
            <p>
              Our interactive Python sandbox compiler runs 100% in your local web browser using WebAssembly (Pyodide). None of your source code, algorithms, or execution outputs are transmitted to any external server.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">4. Third-Party Integrations</h2>
            <p>
              Educational video materials are hosted through YouTube. When playing video embeds, YouTube may set standard technical cookies as governed by Google&apos;s Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-navy-900">5. Contact Information</h2>
            <p>
              For any questions regarding this Privacy Policy or study materials, please contact the RayTech Institute administrator via our official contact form.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
