import type { ClassItem, SubjectItem, GazetteItem } from '@/types/educational';

export interface StudyLink { id: string; label: string; href: string }
export function buildStudyLinks(classes: ClassItem[], subjects: SubjectItem[], gazettes: Pick<GazetteItem, 'id' | 'title' | 'classSlug'>[] = []): StudyLink[] {
  const active = Array.from(new Map(classes.filter(c => c.isActive).map(c => [c.slug, c])).values()).sort((a, b) => a.numericGrade - b.numericGrade || a.title.localeCompare(b.title));
  const links: StudyLink[] = [];
  for (const grade of active) {
    const label = grade.title.replace(/\s*\([^)]*\)/g, '').trim() || grade.title;
    const base = `/classes/${encodeURIComponent(grade.slug)}/`;
    links.push({ id: grade.slug, label: `${label} subjects`, href: base });
    const matched = Array.from(new Map(subjects.filter(s => s.classSlug === grade.slug).map(s => [s.slug, s])).values()).sort((a, b) => a.title.localeCompare(b.title));
    for (const subject of matched)
      for (const [route, resource] of [['notes', 'Notes'], ['mcqs', 'MCQs'], ['past-papers', 'Past Papers']])
        links.push({ id: `${grade.slug}/${subject.slug}/${route}`, label: `${label} ${subject.title} ${resource}`, href: `${base}${encodeURIComponent(subject.slug)}/${route}/` });
  }
  for (const gazette of gazettes.filter(g => active.some(c => c.slug === g.classSlug))) {
    const slug = gazette.id.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (slug) links.push({ id: `gazette/${slug}`, label: gazette.title, href: `/results-gazettes/${slug}/` });
  }
  return Array.from(new Map(links.map(link => [link.href, link])).values());
}
