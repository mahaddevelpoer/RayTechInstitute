export type LessonBlock =
  | { type: 'Understand'; title: string; stages: UnderstandStage[]; experiment?: 'python-bindings' }
  | { type: 'markdown'; content: string }
  | { type: 'PredictOutput'; title: string; code: string; options: string[]; answer: number; explanation: string }
  | { type: 'CodeTrace'; title: string; steps: { line: string; explanation: string; values: string }[] }
  | { type: 'TryExample'; title: string; code: string; task: string };

export type UnderstandStage = {
  title: string; explanation: string; code: string; hint: string; success: string;
  slots: { label: string; options: string[]; answer: number }[];
};
