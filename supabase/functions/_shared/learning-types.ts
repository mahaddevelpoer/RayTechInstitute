export type BrowserRuntime = 'html' | 'css' | 'javascript' | 'php' | 'python';
export type PublicationState = 'draft' | 'published' | 'archived';

export interface LearningCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  languageIds: string[];
  state: PublicationState;
}

export interface LearningLanguage {
  id: string;
  slug: string;
  title: string;
  description: string;
  runtime: BrowserRuntime;
  state: PublicationState;
}

export interface TopicQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface TopicAssignment {
  instructions: string;
  hints: string[];
  requiredConcepts: string[];
  allowedConcepts: string[];
  prohibitedConcepts: string[];
  rubric: { id: string; description: string; points: number }[];
  starterCode: string;
}

export interface LearningTopic {
  id: string;
  languageId: string;
  slug: string;
  title: string;
  summary: string;
  order: number;
  version: number;
  objectives: string[];
  prerequisiteIds: string[];
  content: string;
  starterCode: string;
  videoIds: string[];
  questions: TopicQuestion[];
  questionsPerAttempt: number;
  assignment: TopicAssignment | null;
  state: PublicationState;
}

export interface AssignmentReview {
  verdict: 'pass' | 'revise';
  score: number;
  summary: string;
  criteria: { id: string; pointsAwarded: number; feedback: string }[];
  conceptViolations: string[];
  nextSteps: string[];
}
