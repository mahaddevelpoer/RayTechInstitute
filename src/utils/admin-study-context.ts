import type { ClassItem, SubjectItem } from '@/types/educational';

export function adminStudyContext(classes: ClassItem[], subjects: SubjectItem[], search = '', preferredClass = '', preferredSubject = '') {
  const query = new URLSearchParams(search);
  const ordered = classes.filter(c => c.isActive).slice().sort((a, b) => a.numericGrade - b.numericGrade);
  const classSlug = classes.find(c => c.slug === preferredClass)?.slug || ordered.find(c => c.slug === query.get('class'))?.slug || ordered[0]?.slug || '';
  const available = subjects.filter(s => s.classSlug === classSlug);
  const subjectSlug = available.find(s => s.slug === preferredSubject)?.slug || available.find(s => s.slug === query.get('subject'))?.slug || available[0]?.slug || '';
  return { classSlug, subjectSlug };
}
