import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PdfDetailClientView } from '@/components/educational/PdfDetailClientView';
import { INITIAL_CLASSES, INITIAL_GAZETTES } from '@/data/staticCatalog';

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function generateStaticParams() {
  return INITIAL_GAZETTES.map((gazette) => ({ gazetteSlug: slug(gazette.id) }));
}

export default function GazetteDetailPage({ params }: { params: { gazetteSlug: string } }) {
  const gazette = INITIAL_GAZETTES.find((item) => slug(item.id) === params.gazetteSlug);
  const currentClass = INITIAL_CLASSES.find((item) => item.slug === gazette?.classSlug);
  if (!gazette) notFound();
  return <div className="flex min-h-screen flex-col bg-white text-slate-800"><Header /><PdfDetailClientView backHref="/results-gazettes" backLabel="Back to result gazettes" eyebrow={`${gazette!.board} · ${gazette!.year}`} title={gazette!.title} description={`${gazette!.session} result gazette for ${currentClass?.title || 'Intermediate students'}, with official result context and board verification details.`} content={gazette!.content} pdfUrl={gazette!.pdfUrl} metadata={[gazette!.board, currentClass?.title || 'Intermediate', `${gazette!.year}`, gazette!.session, gazette!.passingPercentage || 'Official result']} /><Footer /></div>;
}
