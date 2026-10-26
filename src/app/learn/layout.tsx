import { LearningSessionProvider } from '@/components/learning/LearningSession';
import '../learning.css';
import '../codi.css';
export default function LearnLayout({ children }: { children: React.ReactNode }) { return <LearningSessionProvider>{children}</LearningSessionProvider>; }
