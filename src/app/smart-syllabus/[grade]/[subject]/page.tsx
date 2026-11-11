import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArticleAttachment } from '@/components/educational/ArticleAttachment';
import { smartSyllabuses, syllabusPath, syllabusSubjectName } from '@/lib/smart-syllabus';
import { siteUrl } from '@/lib/site';
import { buildSeoTitle, serializeJsonLd } from '@/utils/seo';
import { withSocialMetadata } from '@/utils/social-metadata';

type Props = { params: Promise<{ grade: string; subject: string }> };
function getDocument(grade: string, subject: string) {
  return smartSyllabuses.find(item => `grade-${item.grade}` === grade && item.subject === subject);
}
export const dynamicParams = false;
export function generateStaticParams() {
  return smartSyllabuses.map(item => ({ grade: `grade-${item.grade}`, subject: item.subject }));
}
export async function generateMetadata({ params }: Props) {
  const { grade, subject } = await params;
  const item = getDocument(grade, subject);
  if (!item) return {};
  const name = subject === 'computer-science' ? 'Computer Science' : syllabusSubjectName(subject);
  return withSocialMetadata({
    title: buildSeoTitle(subject === 'computer-science' ? `Grade ${item.grade} Computer Science ALP ${item.year}` : `Grade ${item.grade} ${name} Smart Syllabus ${item.year}`),
    description: `Download Punjab Grade ${item.grade} ${name} smart syllabus ${item.year}. Preview the subject PDF, check official instructions and plan exam revision.`,
    alternates: { canonical: siteUrl(syllabusPath(item)) },
    openGraph: { images: [{ url: item.image.startsWith('/') ? siteUrl(item.image) : item.image }] },
  });
}
export default async function SubjectSmartSyllabus({ params }: Props) {
  const { grade, subject } = await params;
  const item = getDocument(grade, subject);
  if (!item) notFound();
  const name = syllabusSubjectName(item.subject);
  const url = siteUrl(syllabusPath(item));
  const pdf = item.pdf.startsWith('/') ? siteUrl(item.pdf) : item.pdf;
  const schema = [ { '@context': 'https://schema.org', '@type': 'LearningResource', '@id': url,
    name: `Grade ${item.grade} ${name} Smart Syllabus ${item.year}`, url,
    description: item.post.excerpt, educationalLevel: `Grade ${item.grade}`, learningResourceType: 'Syllabus',
    inLanguage: 'en', isBasedOn: item.source || undefined,
    associatedMedia: { '@type': 'MediaObject', contentUrl: pdf, encodingFormat: 'application/pdf' },
    publisher: { '@type': 'Organization', name: 'RayTech Institute', url: siteUrl('/') } },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Classes', item: siteUrl('/classes/') },
      { '@type': 'ListItem', position: 2, name: 'Smart syllabus', item: siteUrl('/smart-syllabus/') },
      { '@type': 'ListItem', position: 3, name: `Grade ${item.grade} ${name}`, item: url },
    ] } ];
  return <><Header/><main id="main-content" className="page-main">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }}/>
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/classes/">Classes</Link><span>/</span><Link href="/smart-syllabus/">Smart syllabus</Link><span>/</span><span>{name}</span></nav>
    <article className="mx-auto max-w-4xl">
      <p className="directory-kicker">Punjab annual examination {item.year}</p>
      <h1 className="my-4 text-3xl font-bold">Grade {item.grade} {name} Smart Syllabus {item.year}</h1>
      <p className="my-4">{item.post.excerpt}</p>
      {item.grade === 11 && item.subject === 'islamiat' && item.year === 2027 && <p className="my-4 rounded-md border border-amber-400 p-4"><strong>Year note needs clarification:</strong> the section heading says 2026-27, but its footer says 2025-26. Ask your school or board to confirm this conflicting note before finalising your exam plan.</p>}
      <ArticleAttachment url={pdf} label={`Grade ${item.grade} ${name} smart syllabus ${item.year}`}/>
      <section className="my-6 rounded-lg border border-[var(--border)] p-5">
        <h2 className="mb-3 text-xl font-bold">Read the subject guide</h2>
        <p>Check the explained syllabus changes, preparation advice and common questions before marking your textbook.</p>
        <Link className="inline-flex min-h-12 items-center font-semibold underline" href={`/blogs/${item.post.slug}/`}>Read the {name} syllabus article</Link>
      </section>
      <h2 className="my-5 text-xl font-bold">Which document am I downloading?</h2>
      <p>{item.pages && item.sourcePages ? `This subject-only PDF contains ${item.pages} pages, extracted from pages ${item.sourcePages[0]} to ${item.sourcePages[1]} of the official Grade ${item.grade} booklet. It includes the subject instructions and accompanying assessment material. ` : 'The attached document is the syllabus selected by the editor for this grade and subject. '}
      This resource is separate from class notes and past papers. Follow the detailed inclusion and exclusion wording in the document; a deleted exercise question does not automatically delete the whole chapter.</p>
      <h2 className="my-5 text-xl font-bold">Use the PDF beside your textbook</h2>
      <ol className="list-decimal space-y-3 pl-6"><li>Confirm your grade, subject, textbook edition and examination year.</li><li>Mark each excluded topic and exercise reference separately.</li><li>Use the paper instructions to plan question types, available choices and timing.</li><li>Practise retained content and review mistakes before trying the model paper.</li><li>Check later official notices for amendments before the examination.</li></ol>
      {item.notificationImage && <><h2 className="my-5 text-xl font-bold">Official notification</h2><p className="mb-4">Reference {item.notification}, dated 6 November 2026. The notification identifies academic session 2026-27 and annual examination 2027.</p><Image src={item.notificationImage} alt={`PECTAA Grade ${item.grade} notification dated 6 November 2026`} width={894} height={1263} sizes="(max-width: 900px) 100vw, 850px" className="h-auto w-full rounded-lg border"/></>}
      <h2 className="my-5 text-xl font-bold">Sources</h2>
      <ul className="my-4 list-disc pl-6">{item.source && <li><a href={item.source} className="underline">Original syllabus document</a></li>}<li><a href="https://pectaa.edu.pk/downloads-2-2/" className="underline">PECTAA official downloads</a></li></ul>
      <Link href="/smart-syllabus/" className="inline-flex min-h-12 items-center underline">Browse other subjects</Link>
    </article>
  </main><Footer/></>;
}
