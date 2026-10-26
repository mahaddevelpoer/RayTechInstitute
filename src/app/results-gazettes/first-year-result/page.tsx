import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BoardDirectory } from "@/components/educational/BoardDirectory";
import { siteUrl } from "@/lib/site";
import { DEFAULT_SOCIAL_IMAGE } from '@/data/social';
import { serializeJsonLd } from "@/utils/seo";

const title = "1st Year Result 2026: Punjab Boards | RayTech Institute";
const description =
  "Check Punjab Board 1st year result guidance for 2026: official board links, roll number steps, gazette help, and what to do after your result.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: siteUrl("/results-gazettes/first-year-result/") },
  openGraph: {
    images: [DEFAULT_SOCIAL_IMAGE],
    title,
    description,
    type: "article",
    url: siteUrl("/results-gazettes/first-year-result/"),
  },
};

export default function FirstYearResultPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" tabIndex={-1} className="page-main flex-1">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href="/results-gazettes/">Results &amp; Gazettes</Link>
          <span>/</span>
          <span aria-current="page">1st year result</span>
        </nav>
        <article className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold leading-tight text-navy-900 sm:text-4xl">
            1st year result 2026: Punjab boards
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700">
            Find your board, check your HSSC Part-I result through its own
            website, and understand the next steps. This guide covers Punjab's
            nine boards; Federal Board information is listed separately.
          </p>
          <p className="mt-3 text-sm text-slate-500">
            RayTech Institute editorial guide · Reviewed{" "}
            <time dateTime="2026-10-16">16 October 2026</time>
          </p>
          <aside className="my-6 rounded-md border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
            <h2 className="font-bold">
              Result date: check the official notice
            </h2>
            <p>
              22 October 2026 has been reported to RayTech as the Punjab
              1st-year result date. We have not independently verified a current
              board notification for that date. Confirm the date and time on
              your board's website before relying on it. This page does not
              announce that results are live.
            </p>
          </aside>
          <nav
            aria-label="On this page"
            className="my-6 flex flex-wrap gap-2 text-sm"
          >
            <a className="btn-outline" href="#board-directory-title">
              Board links
            </a>
            <a className="btn-outline" href="#check-result">
              Check by roll number
            </a>
            <a className="btn-outline" href="#gazette-help">
              Gazette help
            </a>
            <a className="btn-outline" href="#after-result">
              After your result
            </a>
          </nav>
          <BoardDirectory />
          <section
            id="check-result"
            className="my-8 space-y-4 text-base leading-7 text-slate-700"
          >
            <h2 className="text-2xl font-bold text-navy-900">
              How to check your result by roll number
            </h2>
            <ol className="list-decimal space-y-3 pl-6">
              <li>
                Match the board name on your roll-number slip with the directory
                above.
              </li>
              <li>
                Open that board's website and follow its current Results link.
                Select HSSC Part-I / Intermediate Part-I and the correct year
                and examination session.
              </li>
              <li>
                Enter the roll number exactly as printed on your slip, including
                any leading zeros. Do not enter it on a website that claims to
                be RayTech's result database.
              </li>
              <li>
                Check the name, examination session, subjects and marks on the
                result screen. Save or print it for your reference.
              </li>
              <li>
                Use the board-issued result card for formal purposes. A
                screenshot or gazette lookup is not a replacement for that
                document.
              </li>
            </ol>
            <h3 className="text-lg font-bold text-navy-900">
              If the board website is busy
            </h3>
            <p>
              Wait a few minutes and retry the same official link. Avoid
              repeated refreshes, unofficial apps, or websites requesting
              payment to unlock marks. Keep your roll-number slip ready. Your
              board may offer an SMS service, but use only the code and format
              in its current notice; network charges may apply.
            </p>
          </section>
          <section
            id="gazette-help"
            className="my-8 space-y-4 text-base leading-7 text-slate-700"
          >
            <h2 className="text-2xl font-bold text-navy-900">
              Checking the gazette PDF
            </h2>
            <p>
              A gazette is a board's published result list. Before searching it,
              confirm the board, year, class and session on its cover. Use your
              PDF reader's search feature to find your roll number. Name
              searches can match several students, so compare the other details
              as well.
            </p>
            <p>
              Some gazettes are scanned documents and cannot be searched as
              text. In that case, use the official roll-number result portal or
              ask your college for help. A broken viewer does not mean your
              result is missing.
            </p>
            <Link className="btn-primary" href="/results-gazettes/">
              Browse available gazettes
            </Link>
            <p>
              RayTech lists documents when editors add them. We do not promise a
              download at a particular time and do not publish estimated pass
              percentages as facts.
            </p>
          </section>
          <section
            id="after-result"
            className="my-8 space-y-4 text-base leading-7 text-slate-700"
          >
            <h2 className="text-2xl font-bold text-navy-900">
              What to do after receiving your result
            </h2>
            <ul className="list-disc space-y-3 pl-6">
              <li>
                Check your personal details and report discrepancies through
                your college or the board's published procedure.
              </li>
              <li>
                Discuss subject marks with your teacher and plan your 2nd-year
                revision around the topics that need work.
              </li>
              <li>
                For rechecking, consult the current board notice for
                eligibility, deadline, fee and application process. Rules from a
                previous year may not apply.
              </li>
              <li>
                If you need to reappear or improve marks, check your board's
                current policy before paying a fee or selecting subjects.
              </li>
            </ul>
            <p>
              A result is feedback on an examination, not a measure of your
              worth. Speak to a teacher or someone you trust if you feel
              overwhelmed.
            </p>
            <Link className="btn-outline" href="/classes/">
              Continue studying: notes and chapter-wise MCQs
            </Link>
          </section>
          <section className="border-t border-slate-200 pt-6 text-sm leading-7 text-slate-600">
            <h2 className="text-xl font-bold text-navy-900">
              Sources and corrections
            </h2>
            <p>
              The board directory was checked against{" "}
              <a
                className="underline"
                href="https://www.biselahore.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                BISE Lahore's official website and related-board links
              </a>
              . Current result dates, marks, fees and eligibility must be
              confirmed by the relevant board. This independent guide does not
              certify those facts.
            </p>
            <p>
              Found a wrong link or outdated instruction?{" "}
              <Link href="/#contact" className="underline">
                Contact RayTech
              </Link>{" "}
              with the page URL and the current official notice. Do not send a
              password, CNIC or private result card.
            </p>
          </section>
        </article>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: title,
              description,
              datePublished: "2026-10-16",
              dateModified: "2026-10-16",
              author: { "@type": "Organization", name: "RayTech Institute" },
              mainEntityOfPage: siteUrl("/results-gazettes/first-year-result/"),
            }),
          }}
        />
      </main>
      <Footer />
    </div>
  );
}
