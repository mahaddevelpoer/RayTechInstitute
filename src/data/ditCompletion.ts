import data from '../../content/dit/completion/generated.json';
import type { ChapterItem, MCQItem, NoteItem, SubjectItem } from '@/types/educational';

export const DIT_COMPLETION_SUBJECTS = data.subjects as SubjectItem[];
export const DIT_COMPLETION_CHAPTERS = data.chapters as ChapterItem[];
export const DIT_COMPLETION_NOTES = data.notes as NoteItem[];
export const DIT_COMPLETION_MCQS: MCQItem[] = data.mcqs.map(question => ({ ...question, options: question.options as MCQItem['options'] }));
const replacements = data.replacements as Record<string, NoteItem>;

/** Preserve saved resource identities and current counters while completing guides. */
export function completeDitNote(note: NoteItem): NoteItem {
  const replacement = replacements[note.id];
  if (!replacement) return note;
  if (note.classSlug !== replacement.classSlug || note.subjectSlug !== replacement.subjectSlug || note.chapterNumber !== replacement.chapterNumber) {
    throw new Error(`DIT completion note identity changed: ${note.id}`);
  }
  return { ...note, ...replacement, downloadCount: note.downloadCount };
}
