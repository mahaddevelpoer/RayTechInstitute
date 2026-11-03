export { academicPlacement, academicGroups } from '../../supabase/functions/_shared/academic-structure';

/** Start each subject at its first published semester; later semesters remain tabs. */
export function programSubjectChoices<T extends { classSlug: string; title: string }>(semesters: { slug: string }[], subjects: T[]): T[] {
  const seen = new Set<string>();
  return semesters.flatMap(semester => subjects.filter(subject => subject.classSlug === semester.slug)).filter(subject => {
    const identity = subject.title.trim().replace(/\s+/g, ' ').toLowerCase();
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}
