export type SubjectCategory = 'Computer Science' | 'Programming' | 'Web' | 'Development Tools';

export interface Lecture {
  id: string;
  number: string;
  videoId: string;
  youtubeUrl: string;
  title: string;
  category: SubjectCategory;
  subCategory?: string;
  chapter: string;
  lectureNo: string;
  duration: string;
  thumbnail: string;
  description: string;
  tags: string[];
  featured?: boolean;
  keyConcepts: string[];
}

export interface SubjectModule {
  id: string;
  code: string;
  title: string;
  category: SubjectCategory;
  description: string;
  topics: string[];
  lectureCount: number;
}

export interface ClassroomComment {
  id: string;
  commenter: string;
  text: string;
  relatedLectureTitle: string;
  relatedCategory: string;
  date?: string;
  status: 'Discussed in Lecture' | 'Core Inquiry' | 'Curriculum Reference';
}

export interface WorkbenchItem {
  id: string;
  name: string;
  category: 'Language' | 'Web Standard' | 'Development Environment';
  role: string;
  description: string;
  specification: string;
  primaryUse: string;
  relatedLectures: string[];
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  organization?: string;
  message: string;
  honeypot?: string;
}

export interface ChannelMeta {
  name: string;
  handle: string;
  tagline: string;
  statement: string;
  videoCount: number;
  subscriberCount: number;
  profileImage: string;
  coverImage: string;
  youtubeUrl: string;
  tiktokUrl: string; // Configurable placeholder
  contentAreas: string[];
}
