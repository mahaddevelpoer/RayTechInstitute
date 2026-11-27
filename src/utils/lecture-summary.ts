import type { Lecture } from '../types';

export const canonicalLectureText = (text: string) => text.replace(/(?:https?:\/\/)?raytechinstitute\.web\.app\b/gi, 'https://raytechinstitute.com');

/** Remove promotional lines before selecting a short, actually rendered excerpt. */
export function lectureSummary(lecture: Pick<Lecture, 'title' | 'description' | 'keyConcepts'>): string {
  const text = canonicalLectureText(lecture.description).replace(/\\n/g, '\n').split(/\r?\n/)
    .filter(line => !/\b(?:like\b.{0,20}\b(?:share|video|channel)|share\b.{0,20}\b(?:video|channel)|subscribe|follow us|click the bell|notification bell|join our|watch now|visit our)\b/i.test(line))
    .map(line => line.replace(/https?:\/\/\S+/gi, '').replace(new RegExp('#[\\p{L}\\p{N}_-]+', 'gu'), '').replace(/[*_`]+/g, '').trim())
    .filter(line => new RegExp('[\\p{L}\\p{N}]', 'u').test(line)).join(' ').replace(/\s+/g, ' ').trim();
  const summary = text || (lecture.keyConcepts.length ? lecture.keyConcepts.join('; ') + '.' : `Study ${lecture.title} with the examples in this recorded lesson.`);
  if (summary.length <= 180) return summary;
  const prefix = summary.slice(0, 177).replace(/\s+\S*$/, '').replace(/[,:;.!?]+$/, '');
  return prefix + '...';
}
