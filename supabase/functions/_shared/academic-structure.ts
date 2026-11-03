/** Optional program/semester grouping, shared by admin and static directories. */
export function academicPlacement(program: unknown, semester: unknown): { programTitle?: string; semesterNumber?: number } {
  if (program !== undefined && program !== null && typeof program !== 'string') throw new Error('Enter a valid program name.');
  const title = typeof program === 'string' ? program.trim().replace(/\s+/g, ' ') : '';
  const emptySemester = semester === undefined || semester === null || semester === '';
  if (!title && emptySemester) return {};
  if (!title || title.length > 100) throw new Error('Enter a program name of up to 100 characters.');
  const number = emptySemester || !['string', 'number'].includes(typeof semester) ? NaN : Number(semester);
  if (!Number.isInteger(number) || number < 1 || number > 16) throw new Error('Choose a semester number from 1 to 16, or leave both program and semester empty for a school class.');
  return { programTitle: title, semesterNumber: number };
}

export function academicGroups<T extends { programTitle?: string; semesterNumber?: number; isActive: boolean }>(classes: T[]) {
  const schoolClasses: T[] = [];
  const programs = new Map<string, { title: string; semesters: T[] }>();
  for (const item of classes.filter(c => c.isActive)) {
    if (!item.programTitle?.trim() || !Number.isInteger(item.semesterNumber) || item.semesterNumber! < 1) {
      schoolClasses.push(item);
      continue;
    }
    const title = item.programTitle.trim().replace(/\s+/g, ' ');
    const key = title.toLowerCase();
    if (!programs.has(key)) programs.set(key, { title, semesters: [] });
    programs.get(key)!.semesters.push(item);
  }
  return { schoolClasses, programs: Array.from(programs.values()).map(p => ({ ...p, semesters: p.semesters.sort((a, b) => a.semesterNumber! - b.semesterNumber!) })) };
}
