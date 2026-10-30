import { siteUrl } from "@/lib/site";
import { withSocialMetadata } from '@/utils/social-metadata';
import React from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata = withSocialMetadata({
  title: "Privacy Policy | RayTech Institute Educational Archive",
  description:
    "Official privacy policy regarding educational materials, user data protection, cookie compliance, and transparent site operations.",
  alternates: {
    canonical: siteUrl("/privacy-policy/"),
  },
});

export default function PrivacyPolicyPage() {
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
          <p className="text-xs text-slate-500">Last Updated: October 2026</p>
        </div>

        <nav className="legal-contents" aria-label="On this page"><h2>On this page</h2><ol>{["Optional Codi voice tutor","1. Introduction","2. Information Collection","3. In-Browser Python Terminal Execution","4. Third-Party Integrations","5. Assignment Feedback","6. Contact Information","7. Weekly Competition"].map((title,index)=><li key={title}><a href={`#policy-section-${index+1}`}>{title}</a></li>)}</ol></nav>
        <div className="edu-card p-6 sm:p-8 space-y-6 text-sm text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 id="policy-section-1" className="text-lg font-bold text-navy-900">Optional Codi voice tutor</h2>
            <p>Codi cloud voice is optional, requires your explicit consent and does not require sign-in. A random browser-session identifier is used for a best-effort usage allowance, alongside enforced shared service limits. Selected lesson text and the relevant lesson excerpt are sent to Google Gemini to generate speech or an explanation. We do not request microphone or camera access. Google's free-tier processing may use submitted content to improve its products. Do not include passwords, personal information or private code in voice requests.</p>
            <p>Generated reading audio may be stored in a bounded browser cache on your device so it can be reused. Clear this site's browser storage to remove it. Cloud voice has usage limits and may be unavailable. English device voice does not use our Gemini service, although your browser or operating system may use its own speech provider. Lessons and practice remain available without cloud voice. Generated explanations and translations can contain mistakes.</p>
          </section>
          <section className="space-y-2">
            <h2 id="policy-section-2" className="text-lg font-bold text-navy-900">1. Introduction</h2>
            <p>
              RayTech Institute operates as a free digital educational
              repository for class-wise study resources and computer
              science syllabus, notes, MCQs, board past papers, and result
              gazettes. We are strictly committed to safeguarding the privacy of
              visiting students and teachers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 id="policy-section-3" className="text-lg font-bold text-navy-900">
              2. Information Collection
            </h2>
            <p>
              We do not sell, rent, or monetize personal student data. We
              use analytics to understand page usage and performance. If you
              choose to sign in, Firebase Authentication processes your account
              details. AI assignment submissions use your account identifier to
              enforce feedback limits; the identifier is not included in the
              prompt sent to the AI provider. Guest quiz answers and practice
              code stay in the current learning session and clear on reload.
              Signed-in students can save topic checkpoints in Cloud Firestore,
              including quiz answers, question history, lesson completion,
              editor drafts and received assignment feedback. These records
              belong to your account. Checkpoints are saved when you submit a
              quiz, mark a lesson studied, receive assignment feedback or choose
              Save work. Typing alone does not save your code to the database.
            </p>
          </section>

          <section className="space-y-2">
            <h2 id="policy-section-4" className="text-lg font-bold text-navy-900">
              3. In-Browser Python Terminal Execution
            </h2>
            <p>
              Our interactive Python sandbox compiler runs 100% in your local
              web browser using WebAssembly (Pyodide). Running code in the
              compiler does not submit your source code or execution output to
              our servers. Choosing to submit an assignment for AI feedback is
              a separate action described below.
            </p>
          </section>

          <section className="space-y-2">
            <h2 id="policy-section-5" className="text-lg font-bold text-navy-900">
              4. Third-Party Integrations
            </h2>
            <p>
              Educational video materials are hosted through YouTube. When
              playing video embeds, YouTube may set standard technical cookies
              as governed by Google&apos;s Privacy Policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 id="policy-section-6" className="text-lg font-bold text-navy-900">
              5. Assignment Feedback
            </h2>
            <p>
              AI feedback requires sign-in. When you submit, your code, the
              published lesson and its assignment instructions are sent through
              our Supabase function to OpenRouter and the selected model
              provider. Your account name, email and identifier are not included
              in that model request. Do not include passwords, API keys or
              personal information in your code. Provider processing and
              retention follow their own policies; we do not promise that a
              free model offers private or training-free processing.
            </p>
            <p>
              You can study, use the compiler and take quizzes without sending
              an assignment. The reviewer assesses your submitted code against
              the lesson rubric without executing it, and its feedback can be
              incorrect. Check suggestions against the lesson and your own
              practice results.
            </p>
          </section>

          <section className="space-y-2">
            <h2 id="policy-section-7" className="text-lg font-bold text-navy-900">
              6. Contact Information
            </h2>
            <p>
              For any questions regarding this Privacy Policy or study
              materials, please contact the RayTech Institute administrator via
              our official contact form.
            </p>
          </section>
          <section className="space-y-2">
            <h2 id="policy-section-8" className="text-lg font-bold text-navy-900">7. Weekly Competition</h2>
            <p>Ranked competition entry uses Google sign-in. Before entering, you choose a display name and agree that your name, score, completion time and rank can appear publicly on the leaderboard and shared result page. Your Google profile photo appears only if you opt in. Your Google email and account identifier are not displayed in public results. Guest practice does not enter the leaderboard.</p>
            <p>Private competition records use your account identifier to enforce one ranked attempt per Pakistan calendar week and resume interrupted tests. We record limited page-visibility events for manual review. Switching tabs alone does not disqualify you. No camera or microphone is used. Administrators can hold and restore a ranking with a private audit reason.</p>
            <p>Firebase verifies identity, Supabase stores competition records, and Cloudflare provides bot protection and a connection proxy. Network addresses are processed transiently for protection; this feature stores a rotating keyed hash for rate limits rather than raw IP addresses. Expired rate-limit records are removed by scheduled maintenance. Provider operational logs follow their own settings. Contact the administrator through our contact form about your competition record or public display.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
