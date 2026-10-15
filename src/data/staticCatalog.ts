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
export const INITIAL_MCQS = STATIC_OVERRIDES.mcqs ?? SEED_MCQS;
export const INITIAL_PAST_PAPERS = STATIC_OVERRIDES.pastPapers ?? SEED_PAST_PAPERS;
export const INITIAL_GAZETTES = STATIC_OVERRIDES.gazettes ?? SEED_GAZETTES;
export const INITIAL_BLOGS = STATIC_OVERRIDES.blogs ?? SEED_BLOGS;
export const INITIAL_VIDEO_MCQS = STATIC_OVERRIDES.videoMcqs ?? SEED_VIDEO_MCQS;
export const INITIAL_CHAPTERS = STATIC_OVERRIDES.chapters ?? Object.values(derivedSeedChapters);
