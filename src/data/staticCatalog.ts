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
import type { ChapterItem } from '@/types/educational';
import { addReviewedResources, ditClassInformation, ditSubjectInformation, DIT_ICT_SUBJECT, DIT_ICT_CHAPTERS, DIT_ICT_ALL_MCQS, DIT_ICT_NOTES } from './ditSemesterOne';
import { completeDitNote, DIT_COMPLETION_SUBJECTS, DIT_COMPLETION_CHAPTERS, DIT_COMPLETION_NOTES, DIT_COMPLETION_MCQS } from './ditCompletion';

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

export const INITIAL_CLASSES = (STATIC_OVERRIDES.classes ?? SEED_CLASSES).map(ditClassInformation);
export const INITIAL_SUBJECTS = addReviewedResources((STATIC_OVERRIDES.subjects ?? SEED_SUBJECTS).map(ditSubjectInformation), [DIT_ICT_SUBJECT, ...DIT_COMPLETION_SUBJECTS]);
export const INITIAL_NOTES = addReviewedResources((STATIC_OVERRIDES.notes ?? SEED_NOTES).map(completeDitNote), [...DIT_ICT_NOTES, ...DIT_COMPLETION_NOTES]);
// These five computer-fundamentals records were published under SDLC Chapter 1.
// Keep the saved records intact; withhold them from public quizzes until their
// textbook/edition and chapter association have been reviewed by an editor.
const CHAPTER_REVIEW_PENDING = new Set(['mcq-1791959684546-sn62b','mcq-1791959685116-xidgz','mcq-1791959685379-8st80','mcq-1791959685663-b8b3q','mcq-1791959685796-p9mf4']);
export const INITIAL_MCQS = addReviewedResources((STATIC_OVERRIDES.mcqs ?? SEED_MCQS).filter(item=>!CHAPTER_REVIEW_PENDING.has(item.id)), [...DIT_ICT_ALL_MCQS, ...DIT_COMPLETION_MCQS]);
export const INITIAL_PAST_PAPERS = STATIC_OVERRIDES.pastPapers ?? SEED_PAST_PAPERS;
export const INITIAL_GAZETTES = STATIC_OVERRIDES.gazettes ?? SEED_GAZETTES;
// Identical 8-November duplicate retained in the database for editorial history.
// Its public URL redirects permanently to the original article in public/_redirects.
export const INITIAL_BLOGS = (STATIC_OVERRIDES.blogs ?? SEED_BLOGS).filter(post => post.id !== 'blog-1794137592576');
export const INITIAL_VIDEO_MCQS = STATIC_OVERRIDES.videoMcqs ?? SEED_VIDEO_MCQS;
export const INITIAL_CHAPTERS = addReviewedResources<ChapterItem>(STATIC_OVERRIDES.chapters ?? Object.values(derivedSeedChapters), [...DIT_ICT_CHAPTERS, ...DIT_COMPLETION_CHAPTERS]);
