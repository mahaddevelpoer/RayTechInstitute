export interface CompetitionRound {
 id: string; title: string; subject: string; startsAt: string; endsAt: string; resultsAt?: string;
 questionCount: number; blueprint: { easy: number; medium: number; hard: number };
 times: { easy: number; medium: number; hard: number }; available?: boolean;
}
export interface CompetitionQuestion {
 id: string; prompt: string; options: string[]; topic: string; difficulty: 'easy'|'medium'|'hard'; seconds: number;
}
export interface CompetitionStanding {
 resultId: string; displayName: string; photoUrl: string|null; score: number; total: number;
 rank: number|null; completedAt: string; roundId?: string; endsAt?:string; resultsPending?:boolean; underReview?: boolean;
}
export interface CompetitionAttemptView {
 id: string; roundId: string; status: 'active'|'completed'; position: number; total: number;
 displayName: string; photoUrl: string|null; serverNow: number; deadline: number|null;
 question: CompetitionQuestion|null; result: CompetitionStanding|null;
}
export interface CompetitionOverview { rounds: CompetitionRound[]; leaderboard: CompetitionStanding[]; serverNow: number; localPreview?: boolean; turnstileSiteKey?: string; }
