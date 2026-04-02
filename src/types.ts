export type PillarId = string;

export interface Milestone {
  id: string;
  title: string;
  completed: boolean;
  completedDate?: string;
}

export interface Goal {
  id: string;
  pillarId: PillarId;
  title: string;
  description: string;
  milestones: Milestone[];
  targetDate?: string;
  status: 'active' | 'completed' | 'paused';
}

export type HabitPriority = 'high' | 'medium' | 'low';

export interface Habit {
  id: string;
  pillarId: PillarId;
  title: string;
  frequency: 'daily' | 'weekly';
  icon?: string;
  priority: HabitPriority;
  createdDate: string;        // yyyy-MM-dd — when this habit was added
  removedDate?: string;       // yyyy-MM-dd — soft-delete: still visible for past days
}

export interface Pillar {
  id: PillarId;
  name: string;
  tagline: string;
  color: string;
  gradient: string;
  iconName: string;
  goals: Goal[];
  habits: Habit[];
}

export interface MorningPlan {
  topPriorities: string[];
  intentions: string;
  energyLevel: number;
  timestamp: string;
}

export interface QuickLog {
  id: string;
  pillarId: PillarId;
  note: string;
  timestamp: string;
  type: 'progress' | 'blocker' | 'win' | 'thought';
}

export interface EveningReview {
  wins: string[];
  challenges: string[];
  gratitude: string;
  tomorrowFocus: string;
  overallRating: number;
  timestamp: string;
}

export interface DayLog {
  date: string;
  morningPlan: MorningPlan | null;
  quickLogs: QuickLog[];
  eveningReview: EveningReview | null;
  habitCompletions: Record<string, boolean>;
}

export interface WeeklyPlan {
  weekStart: string;
  pillarGoals: Record<PillarId, string[]>;
  topPriority: string;
  reflection?: string;
}

export interface AppState {
  userName: string;
  onboarded: boolean;
  pillars: Pillar[];
  dayLogs: Record<string, DayLog>;
  weeklyPlans: Record<string, WeeklyPlan>;
  theme: 'light' | 'dark' | 'auto';
}
