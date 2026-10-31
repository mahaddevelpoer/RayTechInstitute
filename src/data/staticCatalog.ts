import {
  INITIAL_BLOGS as SEED_BLOGS,
  INITIAL_CLASSES as SEED_CLASSES,
  INITIAL_GAZETTES as SEED_GAZETTES,
  INITIAL_MCQS as SEED_MCQS,
  INITIAL_NOTES as SEED_NOTES,
  INITIAL_PAST_PAPERS as SEED_PAST_PAPERS,
  INITIAL_SUBJECTS as SEED_SUBJECTS,
  INITIAL_VIDEO_MCQS as SEED_VIDEO_MCQS,
} from './educationalData';
import { STATIC_OVERRIDES } from './staticOverrides';

const derivedSeedChapters = SEED_MCQS.reduce<Record<string, { id: string; classSlug: string; subjectSlug: string; chapterNumber: number; title: string; isActive: boolean }>>((result, mcq) => {
  const key = `${mcq.classSlug}:${mcq.subjectSlug}:${mcq.chapterNumber}`;
  if (!result[key]) {
    result[key] = {
      id: `chapter-${mcq.classSlug}-${mcq.subjectSlug}-${mcq.chapterNumber}`,
      classSlug: mcq.classSlug,
      subjectSlug: mcq.subjectSlug,
      chapterNumber: mcq.chapterNumber,
      title: `Chapter ${mcq.chapterNumber}`,
      isActive: true,
    };
  }
  return result;
}, {});

export const INITIAL_CLASSES = STATIC_OVERRIDES.classes ?? SEED_CLASSES;
export const INITIAL_SUBJECTS = STATIC_OVERRIDES.subjects ?? SEED_SUBJECTS;
export const INITIAL_NOTES = STATIC_OVERRIDES.notes ?? SEED_NOTES;
// These five computer-fundamentals records were published under SDLC Chapter 1.
// Keep the saved records intact; withhold them from public quizzes until their
// textbook/edition and chapter association have been reviewed by an editor.
const CHAPTER_REVIEW_PENDING = new Set(['mcq-1791959684546-sn62b','mcq-1791959685116-xidgz','mcq-1791959685379-8st80','mcq-1791959685663-b8b3q','mcq-1791959685796-p9mf4']);
export const INITIAL_MCQS = (STATIC_OVERRIDES.mcqs ?? SEED_MCQS).filter(item=>!CHAPTER_REVIEW_PENDING.has(item.id));
export const INITIAL_PAST_PAPERS = STATIC_OVERRIDES.pastPapers ?? SEED_PAST_PAPERS;
export const INITIAL_GAZETTES = STATIC_OVERRIDES.gazettes ?? SEED_GAZETTES;
export const INITIAL_BLOGS = STATIC_OVERRIDES.blogs ?? SEED_BLOGS;
export const INITIAL_VIDEO_MCQS = STATIC_OVERRIDES.videoMcqs ?? SEED_VIDEO_MCQS;
export const INITIAL_CHAPTERS = STATIC_OVERRIDES.chapters ?? Object.values(derivedSeedChapters);
