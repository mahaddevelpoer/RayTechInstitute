import { LearningSessionProvider } from '@/components/learning/LearningSession';
export default function LearnLayout({ children }: { children: React.ReactNode }) { return <LearningSessionProvider>{children}</LearningSessionProvider>; }
