import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef, useMemo } from 'react';
import { AppState, DayLog, MorningPlan, QuickLog, EveningReview, WeeklyPlan, PillarId, Pillar, Habit, HabitPriority } from './types';
import { defaultPillars } from './data/pillars';
import { format } from 'date-fns';

const STORAGE_KEY = 'life-compass-data';
const PRIORITY_ORDER: Record<string, number> = { high: 0, medium: 1, low: 2 };

function getToday(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function migrateHabits(pillars: Pillar[]): Pillar[] {
  const today = getToday();
  return pillars.map(p => ({
    ...p,
    habits: p.habits.map(h => ({
      ...h,
      priority: h.priority || 'medium',
      createdDate: (() => {
        const created = h.createdDate || '2000-01-01';
        return created > today ? today : created;
      })(),
    })),
  }));
}

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...getDefaultState(),
        ...parsed,
        pillars: migrateHabits(parsed.pillars || defaultPillars),
      };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return getDefaultState();
}

function getDefaultState(): AppState {
  return {
    userName: '',
    onboarded: false,
    pillars: migrateHabits(defaultPillars),
    dayLogs: {},
    weeklyPlans: {},
    theme: 'auto',
  };
}

function ensureDayLog(state: AppState, date: string): DayLog {
  return state.dayLogs[date] || {
    date,
    morningPlan: null,
    quickLogs: [],
    eveningReview: null,
    habitCompletions: {},
  };
}

type Action =
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'auto' }
  | { type: 'SAVE_MORNING_PLAN'; payload: { date: string; plan: MorningPlan } }
  | { type: 'ADD_QUICK_LOG'; payload: { date: string; log: QuickLog } }
  | { type: 'SAVE_EVENING_REVIEW'; payload: { date: string; review: EveningReview } }
  | { type: 'TOGGLE_HABIT'; payload: { date: string; habitId: string } }
  | { type: 'TOGGLE_MILESTONE'; payload: { goalId: string; milestoneId: string } }
  | { type: 'SAVE_WEEKLY_PLAN'; payload: WeeklyPlan }
  | { type: 'UPDATE_PILLARS'; payload: Pillar[] }
  | { type: 'SET_USER_NAME'; payload: string }
  | { type: 'COMPLETE_ONBOARDING'; payload?: Pillar[] }
  | { type: 'REMOVE_HABIT'; payload: { habitId: string } }
  | { type: 'ADD_HABIT'; payload: { pillarId: string; title: string; icon: string; frequency: 'daily' | 'weekly' } }
  | { type: 'SET_HABIT_PRIORITY'; payload: { habitId: string; priority: HabitPriority } }
  | { type: 'RESET_STATE' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };

    case 'SAVE_MORNING_PLAN': {
      const { date, plan } = action.payload;
      const dayLog = ensureDayLog(state, date);
      return {
        ...state,
        dayLogs: {
          ...state.dayLogs,
          [date]: { ...dayLog, morningPlan: plan },
        },
      };
    }

    case 'ADD_QUICK_LOG': {
      const { date, log } = action.payload;
      const dayLog = ensureDayLog(state, date);
      return {
        ...state,
        dayLogs: {
          ...state.dayLogs,
          [date]: { ...dayLog, quickLogs: [...dayLog.quickLogs, log] },
        },
      };
    }

    case 'SAVE_EVENING_REVIEW': {
      const { date, review } = action.payload;
      const dayLog = ensureDayLog(state, date);
      return {
        ...state,
        dayLogs: {
          ...state.dayLogs,
          [date]: { ...dayLog, eveningReview: review },
        },
      };
    }

    case 'TOGGLE_HABIT': {
      const { date, habitId } = action.payload;
      const dayLog = ensureDayLog(state, date);
      return {
        ...state,
        dayLogs: {
          ...state.dayLogs,
          [date]: {
            ...dayLog,
            habitCompletions: {
              ...dayLog.habitCompletions,
              [habitId]: !dayLog.habitCompletions[habitId],
            },
          },
        },
      };
    }

    case 'TOGGLE_MILESTONE': {
      const { goalId, milestoneId } = action.payload;
      return {
        ...state,
        pillars: state.pillars.map(p => ({
          ...p,
          goals: p.goals.map(g => {
            if (g.id !== goalId) return g;
            return {
              ...g,
              milestones: g.milestones.map(m => {
                if (m.id !== milestoneId) return m;
                return {
                  ...m,
                  completed: !m.completed,
                  completedDate: !m.completed ? getToday() : undefined,
                };
              }),
            };
          }),
        })),
      };
    }

    case 'SAVE_WEEKLY_PLAN':
      return {
        ...state,
        weeklyPlans: {
          ...state.weeklyPlans,
          [action.payload.weekStart]: action.payload,
        },
      };

    case 'UPDATE_PILLARS':
      return { ...state, pillars: migrateHabits(action.payload) };

    case 'REMOVE_HABIT': {
      const { habitId } = action.payload;
      // Soft-delete: set removedDate so habit stays visible for past days
      return {
        ...state,
        pillars: state.pillars.map(p => ({
          ...p,
          habits: p.habits.map(h =>
            h.id === habitId ? { ...h, removedDate: getToday() } : h
          ),
        })),
      };
    }

    case 'ADD_HABIT': {
      const { pillarId, title, icon, frequency } = action.payload;
      const newHabit: Habit = {
        id: `habit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        pillarId,
        title,
        icon,
        frequency,
        priority: 'medium',
        createdDate: getToday(),
      };
      return {
        ...state,
        pillars: state.pillars.map(p =>
          p.id === pillarId ? { ...p, habits: [...p.habits, newHabit] } : p
        ),
      };
    }

    case 'SET_HABIT_PRIORITY': {
      const { habitId, priority } = action.payload;
      return {
        ...state,
        pillars: state.pillars.map(p => ({
          ...p,
          habits: p.habits.map(h =>
            h.id === habitId ? { ...h, priority } : h
          ),
        })),
      };
    }

    case 'SET_USER_NAME':
      return { ...state, userName: action.payload };

    case 'COMPLETE_ONBOARDING': {
      // Use custom pillars from onboarding if provided, otherwise keep current
      const rawPillars = action.payload && action.payload.length > 0
        ? action.payload
        : state.pillars;
      // Ensure all habits have priority and createdDate fields
      const finalPillars = migrateHabits(rawPillars);
      // Start completely fresh — no seeded data, no fake streaks
      const t = getToday();
      const freshLogs: Record<string, DayLog> = {
        [t]: { date: t, morningPlan: null, quickLogs: [], eveningReview: null, habitCompletions: {} },
      };
      return { ...state, onboarded: true, pillars: finalPillars, dayLogs: freshLogs };
    }

    case 'RESET_STATE':
      return getDefaultState();

    default:
      return state;
  }
}

interface HabitHistory {
  completedDays: number;
  totalDays: number;
  pct: number;
  last7: number;
  last30: number;
  longestStreak: number;
  daysSinceLastDone: number | null; // null if never done
}

interface StoreContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  today: string;
  todayLog: DayLog;
  getAllHabits: (forDate?: string) => { habit: Habit; pillarName: string; pillarColor: string }[];
  getHabitStreak: (habitId: string) => number;
  getHabitHistory: (habitId: string) => HabitHistory;
  getDayCompletionRate: (date: string) => number;
  getDayLog: (date: string) => DayLog;
}

const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const today = getToday();
  const todayLog = ensureDayLog(state, today);

  // Debounced localStorage persistence (300ms)
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save state:', e);
      }
    }, 300);
    return () => { if (saveTimeout.current) clearTimeout(saveTimeout.current); };
  }, [state]);

  const getAllHabits = useCallback((forDate?: string) => {
    const d = forDate || today;
    return state.pillars.flatMap(p =>
      p.habits
        .filter(h => {
          // Only show habits that existed on the given date
          const created = h.createdDate || '2000-01-01';
          if (d < created) return false;
          // If removed, only show for dates before removal
          if (h.removedDate && d >= h.removedDate) return false;
          return true;
        })
        .map(h => ({
          habit: h,
          pillarName: p.name,
          pillarColor: p.color,
        }))
    ).sort((a, b) => (PRIORITY_ORDER[a.habit.priority || 'medium'] ?? 1) - (PRIORITY_ORDER[b.habit.priority || 'medium'] ?? 1));
  }, [state.pillars, today]);

  const MAX_STREAK_LOOKBACK = 60;
  const getHabitStreak = useCallback((habitId: string) => {
    let streak = 0;
    for (let i = 0; i < MAX_STREAK_LOOKBACK; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const log = state.dayLogs[dateStr];
      if (log?.habitCompletions[habitId]) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    return streak;
  }, [state.dayLogs]);

  const activeHabitsForDate = useCallback((date: string) => {
    return state.pillars.flatMap(p =>
      p.habits.filter(h => {
        const created = h.createdDate || '2000-01-01';
        if (date < created) return false;
        if (h.removedDate && date >= h.removedDate) return false;
        return true;
      })
    );
  }, [state.pillars]);

  const getHabitHistory = useCallback((habitId: string): HabitHistory => {
    let completedDays = 0;
    let totalDays = 0;
    let last7 = 0;
    let last30 = 0;
    let longestStreak = 0;
    let currentRun = 0;
    let daysSinceLastDone: number | null = null;

    for (let i = 0; i < MAX_STREAK_LOOKBACK; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = format(d, 'yyyy-MM-dd');
      const log = state.dayLogs[dateStr];
      if (!log) continue;
      totalDays++;
      if (log.habitCompletions[habitId]) {
        completedDays++;
        currentRun++;
        if (currentRun > longestStreak) longestStreak = currentRun;
        if (i < 7) last7++;
        if (i < 30) last30++;
        if (daysSinceLastDone === null) daysSinceLastDone = i;
      } else {
        currentRun = 0;
      }
    }

    return {
      completedDays,
      totalDays: Math.max(totalDays, 1),
      pct: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
      last7,
      last30,
      longestStreak,
      daysSinceLastDone,
    };
  }, [state.dayLogs]);

  const getDayCompletionRate = useCallback((date: string) => {
    const log = state.dayLogs[date];
    const habits = activeHabitsForDate(date);
    if (!log || habits.length === 0) return 0;
    const completed = habits.filter(h => log.habitCompletions[h.id]).length;
    return Math.round((completed / habits.length) * 100);
  }, [state.dayLogs, activeHabitsForDate]);

  const getDayLog = useCallback((date: string) => ensureDayLog(state, date), [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch, today, todayLog, getAllHabits, getHabitStreak, getHabitHistory, getDayCompletionRate, getDayLog }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
