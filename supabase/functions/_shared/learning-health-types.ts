export type HealthState = 'ok' | 'error' | 'attention' | 'not-tested';
export interface HealthCheck { id: string; label: string; status: HealthState; detail: string; checkedAt: string; durationMs: number }
export interface HealthConfiguration { databaseUrl: string; serviceKey: string; geminiKey: string; openRouterKey: string; youtubeKey: string; githubToken: string; repository: string; origin: string }
