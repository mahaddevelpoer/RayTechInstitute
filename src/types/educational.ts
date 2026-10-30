export interface ClassItem {
  id: string;
  slug: string;
  title: string;
  numericGrade: number;
  description: string;
  isActive: boolean;
}

export interface SubjectItem {
  id: string;
  classSlug: string;
  slug: string;
  title: string;
  iconName: string;
  description: string;
}

export interface ChapterItem {
  id: string;
  classSlug: string;
  subjectSlug: string;
  chapterNumber: number;
  title: string;
  description?: string;
  isActive: boolean;
}

export interface NoteItem {
  id: string;
  classSlug: string;
  subjectSlug: string;
  chapterNumber: number;
  chapterTitle: string;
  title: string;
  description: string;
  pdfUrl: string;
  fileSize?: string;
  downloadCount: number;
  lastUpdated: string;
  content?: string; // Optional AI-written rich Markdown chapter analysis, key concepts, and study guide
  previewPdfUrl?: string; // Optional Google Drive preview link for on-page PDF viewer (separate from download URL)
  actionButtonText?: string; // Optional custom button label (e.g. "Download Solved Exercises", "View Key Points PDF")
  actionButtonUrl?: string; // Optional custom target link for the action button
}

export interface MCQItem {
  id: string;
  classSlug: string;
  subjectSlug: string;
  chapterNumber: number;
  topic?: string;
  createdAt?: string; // Original database creation time; editing does not reset topic freshness.
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface PastPaperItem {
  id: string;
  classSlug: string;
  subjectSlug: string;
  board: string;
  year: number;
  session: 'Annual' | 'Supplementary';
  pdfUrl: string;
  description?: string;
  content?: string;
}

export interface GazetteItem {
  id: string;
  title: string;
  board: string;
  classSlug: string;
  year: number;
  session: string;
  pdfUrl: string;
  directResultUrl: string;
  releaseDate: string;
  totalCandidates?: string;
  passingPercentage?: string;
  actionButtonText?: string; // Optional custom button name (e.g. "Download Gazette PDF", "Check Online Result", "Go to Portal")
  actionButtonUrl?: string; // Optional custom target link
  content?: string; // Optional detailed board notification writing / analysis
}

export type BlogCategory = 'date-sheets' | 'admissions' | 'career-guides' | 'general' | 'sports' | 'technology' | 'science' | 'economy' | 'world-affairs' | 'entertainment' | 'education';

export interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  category: BlogCategory;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: string;
  datePublished: string;
  readTime: string;
  tags: string[];
  actionButtonText?: string; // Optional custom button label (e.g. "Download Date Sheet PDF", "Go to Admissions Portal")
  actionButtonUrl?: string; // Optional destination URL
}

export interface VideoInteractiveMCQ {
  id: string;
  videoId: string;
  videoTitle: string;
  timestampSeconds: number; // e.g. 105 (01:45)
  timestampFormatted: string; // e.g. "01:45"
  topic: string; // e.g. "Python input() function"
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string];
  correctIndex: number; // 0, 1, 2, or 3
  explanation: string;
}
