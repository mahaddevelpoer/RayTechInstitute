import documents from '@/data/smart-syllabus.json';
import { INITIAL_BLOGS } from '@/data/staticCatalog';
import { publishedSyllabusPosts } from './syllabus-records';
export { syllabusPath } from './syllabus-records';

// Deleted articles must disappear from the next static export, never fall back to seeds.
export const smartSyllabuses = publishedSyllabusPosts(INITIAL_BLOGS).map(({ post, ...identity }) => {
  const original = documents.find(d => d.grade === identity.grade && d.subject === identity.subject && identity.year === 2027);
  const source = post.seo?.sources?.split('\n').find(Boolean) || original?.source || '';
  return { ...identity, post, pdf: post.actionButtonUrl!, image: post.featuredImage,
    notificationImage: original?.notificationImage, source, pages: original?.pdf && post.actionButtonUrl!.endsWith(original.pdf) ? original.pages : undefined,
    sourcePages: original?.sourcePages, notification: original?.notification, date: original?.date };
});

export function syllabusSubjectName(subject: string) {
  const titles: Record<string, string> = {
    'computer-science': 'Computer Science and Entrepreneurship',
    mathematics: 'Mathematics', physics: 'Physics', chemistry: 'Chemistry',
    biology: 'Biology', urdu: 'Urdu', english: 'English', islamiat: 'Islamiat',
  };
  return titles[subject] || subject;
}

export function subjectSyllabus(grade: number, title: string) {
  const name = title.toLowerCase().replace(/[^a-z]/g, '');
  return smartSyllabuses.find(item => item.grade === grade && (
    name === item.subject.replace(/-/g, '') ||
    (item.subject === 'computer-science' && name.startsWith('computerscience')) ||
    (item.subject === 'mathematics' && ['maths', 'math', 'mathematicsscience'].includes(name)) ||
    (item.subject === 'islamiat' && ['islamiyat', 'islamicstudies', 'islamiatcompulsory'].includes(name))
  ));
}
