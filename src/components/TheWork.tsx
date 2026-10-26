import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { INITIAL_CLASSES, INITIAL_SUBJECTS } from "@/data/staticCatalog";

export function TheWork() {
  return (
    <section id="work" className="border-b border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="section-title">Start with your class</h2>
        <p className="mb-6 text-base text-slate-600">
          Choose a subject, then open its chapter notes, MCQs or past papers.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {INITIAL_CLASSES.filter((c) => c.isActive).map((c) => (
            <article
              key={c.id}
              className="rounded-lg border border-slate-200 bg-white p-6"
            >
              <h3 className="flex items-center gap-3 text-xl font-bold text-navy-900">
                <BookOpen className="h-5 w-5" />
                {c.title}
              </h3>
              <ul className="my-5 space-y-1">
                {INITIAL_SUBJECTS.filter((s) => s.classSlug === c.slug).map(
                  (subject) => (
                    <li key={subject.id}>
                      <Link
                        className="flex min-h-12 items-center justify-between gap-3 border-b border-slate-100 py-3 text-sm font-semibold text-navy-700"
                        href={`/classes/${c.slug}/${subject.slug}/`}
                        aria-label={`${c.title}: ${subject.title} study resources`}
                      >
                        {subject.title}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </li>
                  ),
                )}
              </ul>
              <Link
                className="btn-outline text-sm"
                href={`/classes/${c.slug}/`}
              >
                All {c.title} resources
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
