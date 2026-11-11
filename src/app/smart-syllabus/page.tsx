import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { smartSyllabuses, syllabusPath, syllabusSubjectName } from '@/lib/smart-syllabus';
import { withSocialMetadata } from '@/utils/social-metadata';
import { serializeJsonLd } from '@/utils/seo';
import { siteUrl } from '@/lib/site';

export const metadata = withSocialMetadata({
  title: 'Punjab Smart Syllabus 2027 PDFs | RayTech Institute',
  description: 'Find subject-wise Punjab Grade 9 and Grade 11 smart syllabus PDFs for annual exams 2027, with notification images, previews and downloads.',
  alternates: { canonical: siteUrl('/smart-syllabus/') },
});

export default function SmartSyllabusDirectory() {
  return <><Header/><main id="main-content" className="page-main">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ '@context': 'https://schema.org', '@type': 'ItemList', name: 'Punjab subject smart syllabus PDFs', itemListElement: smartSyllabuses.map((item, index) => ({ '@type': 'ListItem', position: index + 1, name: `Grade ${item.grade} ${syllabusSubjectName(item.subject)} ALP ${item.year}`, url: siteUrl(syllabusPath(item)) })) }) }}/>
    <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/classes/">Classes</Link><span>/</span><span>Smart syllabus</span></nav>
    <div className="directory-intro"><p className="directory-kicker">Punjab • Annual examination 2027</p><h1>Subject-wise smart syllabus</h1><p>Open your subject to read the notification, preview its extracted PDF and download the syllabus, pairing scheme and model paper.</p></div>
    {Array.from(new Set([9, 10, 11, ...smartSyllabuses.map(item => item.grade)])).sort((a,b) => a-b).map(grade => <section key={grade} className="my-8">
      <h2 className="directory-section-title">Grade {grade}</h2>
      <div className="study-family-grid">{smartSyllabuses.filter(item => item.grade === grade).map(item => <Link key={item.subject} href={syllabusPath(item)} className="study-option-card"><h3>{syllabusSubjectName(item.subject)}</h3><p>{item.pages ? `${item.pages} pages · ` : ''}Examination {item.year}</p><span>Read syllabus and preview PDF →</span></Link>)}</div>
      {grade === 9 && !smartSyllabuses.some(item => item.grade === 9 && item.subject === 'computer-science') && <p className="my-4">Computer Science is awaiting verification of a separate current official document.</p>}
      {grade === 10 && !smartSyllabuses.some(item => item.grade === 10) && <p className="my-4">A current Grade 10 ALP notification is awaiting verification. Check your board’s current syllabus instructions.</p>}
    </section>)}
    <p>Source checked on 11 November 2026. <a href="https://pectaa.edu.pk/downloads-2-2/" className="underline">PECTAA official downloads</a></p>
  </main><Footer/></>;
}
